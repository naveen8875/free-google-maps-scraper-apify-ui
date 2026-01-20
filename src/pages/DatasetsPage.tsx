import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Eye,
  RefreshCw,
  FileJson,
  FileSpreadsheet,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApifyService, ApifyRun, ApifyDatasetMetadata } from "@/services/apify";
import { toast } from "sonner";
import { format } from "date-fns";

type DatasetStatus = "completed" | "running" | "pending" | "failed";

// UI Interface for display
interface Dataset {
  id: string; // This will hold the defaultDatasetId
  runId: string;
  name: string;
  query: string;
  status: DatasetStatus;
  records: number | string; // itemCount might not be in run stats immediately
  createdAt: string;
  emoji: string;
}

const StatusBadge = ({ status }: { status: DatasetStatus }) => {
  const config = {
    completed: { label: "Completed", className: "status-completed", emoji: "✅" },
    running: { label: "Running", className: "status-running", emoji: "⏳" },
    pending: { label: "Pending", className: "status-pending", emoji: "🕐" },
    failed: { label: "Failed", className: "status-failed", emoji: "❌" },
  };

  const { label, className, emoji } = config[status] || config.completed;

  return (
    <span className={`status-badge ${className}`}>
      <span className="emoji text-xs">{emoji}</span>
      {label}
    </span>
  );
};

// Simplified rating component for preview
const RatingStars = ({ rating }: { rating: number }) => {
  if (!rating) return <span className="text-muted-foreground">-</span>;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-500 text-sm">
        {"★".repeat(Math.min(fullStars, 5))}
        {fullStars < 5 && hasHalf && "½"}
      </span>
      <span className="text-foreground font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export const DatasetsPage = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [dynamicSchema, setDynamicSchema] = useState<any>(null);

  // Fetch runs on mount and map to dataset list
  useEffect(() => {
    const fetchRuns = async () => {
      try {
        setIsLoading(true);
        const runs = await ApifyService.getRuns();

        // Sort runs by date descending (newest first)
        const sortedRuns = runs.sort((a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );

        // Map Apify runs to Dataset UI model
        const mappedDatasets: Dataset[] = sortedRuns.map((run: ApifyRun) => {
          let status: DatasetStatus = "pending";
          if (run.status === "SUCCEEDED") status = "completed";
          else if (run.status === "RUNNING") status = "running";
          else if (run.status === "FAILED" || run.status === "ABORTED" || run.status === "TIMED-OUT") status = "failed";

          return {
            id: run.defaultDatasetId,
            runId: run.id,
            name: `Run ${format(new Date(run.startedAt), "MMM d, HH:mm")}`,
            query: "Google Maps Scrape", // Query is in options usually, but not always simple to extract from list
            status: status,
            records: "—", // Could try to get from stats if available, e.g. run.stats?.itemCount
            createdAt: format(new Date(run.startedAt), "MMM d, yyyy HH:mm"),
            emoji: "📊"
          };
        });

        setDatasets(mappedDatasets);
      } catch (error) {
        console.error("Failed to fetch runs:", error);
        toast.error("Failed to load runs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRuns();
  }, []);

  // Fetch preview items when dataset is selected
  useEffect(() => {
    const fetchPreview = async () => {
      if (!selectedDataset) {
        setPreviewData([]);
        setDynamicSchema(null);
        return;
      }

      try {
        setIsPreviewLoading(true);
        setDynamicSchema(null);

        // Fetch schema metadata concurrently with items
        const [items, metadata] = await Promise.all([
          ApifyService.getDatasetItems(selectedDataset.id, 10),
          ApifyService.getDatasetInfo(selectedDataset.id)
        ]);

        setPreviewData(items);

        if (metadata && metadata.schema && metadata.schema.views && metadata.schema.views.overview) {
          setDynamicSchema(metadata.schema.views.overview);
        }

      } catch (error) {
        console.error("Failed to fetch dataset items or info:", error);
        toast.error("Failed to load preview data.");
      } finally {
        setIsPreviewLoading(false);
      }
    };

    fetchPreview();
  }, [selectedDataset]);

  const handleExport = (format: "json" | "csv") => {
    if (!selectedDataset) return;
    const url = ApifyService.getDatasetDownloadUrl(selectedDataset.id, format);

    // Create temporary link to trigger download without opening tab
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedDataset.name.replace(/\s+/g, '_')}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloading ${format.toUpperCase()}...`);
  };

  const renderCell = (record: any, fieldKey: string, format?: string) => {
    const value = record[fieldKey];

    if (format === 'link' || fieldKey === 'url') {
      return value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Link <ExternalLink className="w-3 h-3" />
        </a>
      ) : "-";
    }

    // Simple heuristic updates for specific fields
    if (fieldKey === 'rating' || fieldKey === 'totalScore') {
      return <RatingStars rating={Number(value || 0)} />;
    }

    if (fieldKey === 'reviewCount' || fieldKey === 'reviewsCount' || fieldKey === 'reviews') {
      return <span className="text-xs text-muted-foreground">{value ? `(${Number(value).toLocaleString()})` : '-'}</span>;
    }

    return <span className="text-foreground">{value || "-"}</span>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <span className="emoji">📊</span> History & Datasets
            </h1>
            <p className="text-muted-foreground">
              View your scraping history and download results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg font-medium">
              {datasets.length} runs
            </span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Datasets Table */}
        <Card className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading history...</div>
          ) : datasets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No history found. Start a scrape!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((dataset) => (
                    <tr
                      key={dataset.runId}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedDataset(dataset)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                            <span className="text-xl emoji">{dataset.emoji}</span>
                          </div>
                          <span className="font-medium text-foreground">{dataset.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={dataset.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          {dataset.createdAt}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setSelectedDataset(dataset)}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only md:not-sr-only">Preview</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Dataset Preview Dialog */}
      <Dialog open={!!selectedDataset} onOpenChange={() => setSelectedDataset(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <span className="emoji text-2xl">{selectedDataset?.emoji}</span>
              {selectedDataset?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              {/* Left side actions if needed */}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleExport("csv")}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => handleExport("json")}
              >
                <FileJson className="w-4 h-4" />
                Export JSON
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {isPreviewLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading preview...</div>
            ) : previewData.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No preview data available.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border bg-secondary/50">
                    {dynamicSchema ? (
                      dynamicSchema.transformation.fields.map((fieldKey: string) => (
                        <th key={fieldKey} className="text-left p-3 font-medium text-muted-foreground">
                          {dynamicSchema.display.properties[fieldKey]?.label || fieldKey}
                        </th>
                      ))
                    ) : (
                      // Fallback Headers
                      <>
                        <th className="text-left p-3 font-medium text-muted-foreground">Business Name</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Rating</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Address</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((record, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                      {dynamicSchema ? (
                        dynamicSchema.transformation.fields.map((fieldKey: string) => (
                          <td key={fieldKey} className="p-3">
                            {renderCell(record, fieldKey, dynamicSchema.display.properties[fieldKey]?.format)}
                          </td>
                        ))
                      ) : (
                        // Fallback Row Rendering
                        <>
                          <td className="p-3 font-medium text-foreground">
                            <div className="flex flex-col">
                              <span>{record.businessName || record.title || "N/A"}</span>
                              {record.url && (
                                <a
                                  href={record.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  View on Map <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {record.category || record.categoryName || "-"}
                          </td>
                          <td className="p-3">
                            <RatingStars rating={record.rating || record.totalScore || 0} />
                            <span className="text-xs text-muted-foreground ml-1">
                              ({(record.reviewCount || record.reviewsCount || 0).toLocaleString()} reviews)
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground max-w-[200px] truncate" title={record.address}>
                            {record.address || "-"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex-shrink-0 pt-3 border-t border-border text-center text-sm text-muted-foreground">
            <span className="emoji">👆</span> Showing first {previewData.length} records. Download to see all.
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
