import { useQuery, type QueryKey } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/use-auth";

type PreviewQueryOptions<TData> = {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  previewData: TData;
  enabled?: boolean;
};

export function usePreviewQuery<TData>({ queryKey, queryFn, previewData, enabled = true }: PreviewQueryOptions<TData>) {
  const previewMode = useAuthStore((state) => state.previewMode);
  const query = useQuery<TData, Error>({
    queryKey,
    queryFn,
    enabled: enabled && !previewMode,
    staleTime: 30_000
  });

  return {
    data: previewMode ? previewData : query.data,
    isLoading: previewMode ? false : query.isLoading,
    isError: previewMode ? false : query.isError,
    error: previewMode ? null : query.error,
    source: previewMode ? "preview" : "live",
    refetch: query.refetch
  };
}
