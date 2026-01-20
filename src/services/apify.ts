
const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN;
const APIFY_ACTOR_ID = import.meta.env.VITE_APIFY_ACTOR_ID || "automateitplease~free-basic-google-maps-scraper";

const BASE_URL = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}`;

export interface ApifyRun {
    id: string;
    actId: string;
    userId: string;
    actorTaskId: string | null;
    startedAt: string;
    finishedAt: string | null;
    status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED-OUT" | "ABORTED";
    defaultDatasetId: string;
    defaultKeyValueStoreId: string;
    defaultRequestQueueId: string;
    buildId: string;
    exitCode: number | null;
    meta: {
        origin: string;
        userAgent: string;
    };
    stats: any;
    options: any;
    buildNumber: string;
}

export interface ApifyDatasetMetadata {
    id: string;
    name: string | null;
    userId: string;
    createdAt: string;
    modifiedAt: string;
    accessedAt: string;
    itemCount: number;
    cleanItemCount: number;
    actId: string;
    actRunId: string;
    itemsPublicUrl: string;
    schema?: {
        views: {
            overview: {
                title: string;
                transformation: {
                    fields: string[];
                };
                display: {
                    component: string;
                    properties: Record<string, {
                        label: string;
                        format?: string;
                    }>;
                };
            };
        };
    };
}

export const ApifyService = {
    /**
     * Check the status of the last run for this actor.
     */
    getLastRun: async (): Promise<ApifyRun | null> => {
        if (!APIFY_TOKEN) {
            console.warn("Apify token not found");
            return null;
        }

        try {
            const response = await fetch(`${BASE_URL}/runs/last?token=${APIFY_TOKEN}`);
            if (!response.ok) {
                if (response.status === 404) return null; // No runs yet
                throw new Error(`Failed to fetch last run: ${response.statusText}`);
            }
            const data = await response.json();
            return data.data; // Apify response wraps actual object in "data"
        } catch (error) {
            console.error("Error fetching last run:", error);
            throw error;
        }
    },

    /**
     * Trigger a new run of the actor.
     */
    runActor: async (searchQuery: string, maxResults: number = 5): Promise<ApifyRun> => {
        if (!APIFY_TOKEN) {
            throw new Error("Apify token is missing. Please check your .env file.");
        }

        try {
            const response = await fetch(`${BASE_URL}/runs?token=${APIFY_TOKEN}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    maxResults,
                    searchQuery,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to start run: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error starting actor run:", error);
            throw error;
        }
    },

    /**
     * Fetch recent runs for this actor.
     */
    getRuns: async (): Promise<ApifyRun[]> => {
        if (!APIFY_TOKEN) {
            console.warn("Apify token not found");
            return [];
        }

        try {
            const response = await fetch(`${BASE_URL}/runs?token=${APIFY_TOKEN}&desc=1`);
            if (!response.ok) {
                throw new Error(`Failed to fetch runs: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data.items || [];
        } catch (error) {
            console.error("Error fetching runs:", error);
            throw error;
        }
    },

    /**
     * Fetch metadata for a specific dataset.
     */
    getDatasetInfo: async (datasetId: string): Promise<ApifyDatasetMetadata | null> => {
        if (!APIFY_TOKEN) return null;

        try {
            const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}?token=${APIFY_TOKEN}`);
            if (!response.ok) {
                console.warn(`Failed to fetch info for dataset ${datasetId}`);
                return null;
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error fetching dataset metadata:", error);
            return null;
        }
    },

    /**
     * Get items from a specific dataset.
     */
    getDatasetItems: async (datasetId: string, limit: number = 10): Promise<any[]> => {
        if (!APIFY_TOKEN) return [];

        try {
            const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=${limit}&format=json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch dataset items: ${response.statusText}`);
            }
            // Apify items endpoint returns an array of objects directly
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching dataset items:", error);
            throw error;
        }
    },

    /**
     * Get the download URL for a dataset in a specific format.
     */
    getDatasetDownloadUrl: (datasetId: string, format: "json" | "csv" | "xlsx" | "xml"): string => {
        return `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=${format}&attachment=true`;
    }
};
