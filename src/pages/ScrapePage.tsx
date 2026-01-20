import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Info, Settings2 } from "lucide-react";
import { ApifyService } from "@/services/apify";
import { toast } from "sonner";

const exampleQueries = [
  { emoji: "🍕", text: "Restaurants in New York" },
  { emoji: "☕", text: "Coffee shops in San Francisco" },
  { emoji: "🏨", text: "Hotels in Miami Beach" },
  { emoji: "💪", text: "Gyms in Los Angeles" },
];

export const ScrapePage = () => {
  const [queries, setQueries] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const queryCount = queries.trim() ? queries.trim().split("\n").filter(q => q.trim()).length : 0;

  useEffect(() => {
    const checkLastRun = async () => {
      try {
        const lastRun = await ApifyService.getLastRun();
        if (lastRun && lastRun.status === "RUNNING") {
          setIsLoading(true);
          toast.info("A scrape job is currently running.");
        }
      } catch (error) {
        console.error("Failed to check last run status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkLastRun();
  }, []);

  const handleStartScrape = async () => {
    if (!queries.trim()) {
      toast.error("Please enter at least one query.");
      return;
    }

    setIsLoading(true);
    try {
      await ApifyService.runActor(queries, maxResults);
      toast.success(`Started scrape for ${maxResults} results!`);
      setQueries("");
    } catch (error) {
      console.error("Scrape failed:", error);
      toast.error("Failed to start scrape job. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAddExample = (example: string) => {
    setQueries(prev => prev ? `${prev}\n${example}` : example);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="emoji">🗺️</span> Scrape Google Maps
          </h1>
          <p className="text-muted-foreground">
            Enter your search queries to extract business data from Google Maps
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl emoji">✨</span>
              <h2 className="font-semibold text-foreground">Search Queries</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Max Results:</span>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="w-20 h-7 text-right px-2 py-0 border-none bg-transparent focus-visible:ring-0 font-mono"
                />
              </div>
              <span className="text-sm text-muted-foreground font-mono bg-secondary px-2 py-1 rounded-lg">
                {queryCount} {queryCount === 1 ? "query" : "queries"}
              </span>
            </div>
          </div>

          <Textarea
            value={queries}
            onChange={(e) => setQueries(e.target.value)}
            placeholder="Enter your search queries, one per line...&#10;&#10;Example:&#10;Restaurants in New York&#10;Coffee shops in San Francisco&#10;Hotels near Times Square"
            className="min-h-[200px] bg-secondary/50 border-border font-mono text-sm resize-none focus:ring-2 focus:ring-primary/20 rounded-xl"
          />

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Info className="w-4 h-4" />
              <span>Separate multiple queries with new lines</span>
            </div>

            <Button
              onClick={handleStartScrape}
              disabled={queryCount === 0 || isLoading || isCheckingStatus}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Scrape
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Quick Add Examples */}
        <Card className="glass-card p-6 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <span className="emoji">⚡</span> Quick Add Examples
          </h3>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example) => (
              <button
                key={example.text}
                onClick={() => handleAddExample(example.text)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors border border-border font-medium"
              >
                <span className="emoji">{example.emoji}</span>
                {example.text}
              </button>
            ))}
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card p-5">
            <div className="text-3xl mb-3 emoji">📍</div>
            <h3 className="font-semibold text-foreground mb-1">Location Data</h3>
            <p className="text-sm text-muted-foreground">
              Extract addresses, coordinates, and geographic information
            </p>
          </Card>

          <Card className="glass-card p-5">
            <div className="text-3xl mb-3 emoji">🏢</div>
            <h3 className="font-semibold text-foreground mb-1">Business Info</h3>
            <p className="text-sm text-muted-foreground">
              Get names, phone numbers, websites, and hours
            </p>
          </Card>

          <Card className="glass-card p-5">
            <div className="text-3xl mb-3 emoji">⭐</div>
            <h3 className="font-semibold text-foreground mb-1">Reviews & Ratings</h3>
            <p className="text-sm text-muted-foreground">
              Collect ratings, review counts, and categories
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
