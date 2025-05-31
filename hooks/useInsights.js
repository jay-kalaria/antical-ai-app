import { useQuery } from "@tanstack/react-query";
import { generateInsights } from "../services/api/insightsService";

/**
 * Hook to fetch personalized insights
 * @param {Date} date - The date to generate insights for (defaults to today)
 */
export function useInsights(date = new Date()) {
    return useQuery({
        queryKey: ["insights", date.toISOString().split("T")[0]],
        queryFn: () => generateInsights(date),
        staleTime: 1000 * 60 * 15, // Consider data stale after 15 minutes
        cacheTime: 1000 * 60 * 60, // Keep in cache for 1 hour
        refetchOnWindowFocus: false,
        retry: 2,
    });
}
