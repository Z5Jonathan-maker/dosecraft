"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export function useApi<T>(
  fetcher: () => Promise<{ data: T | null; error: string | null }>,
  deps: readonly unknown[] = [],
): UseApiState<T> & { readonly refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetcher();
      setState({
        data: result.data,
        loading: false,
        error: result.error,
      });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}

/** Simple hook for local mock data (no async needed) */
export function useMockData<T>(data: T): UseApiState<T> {
  return { data, loading: false, error: null };
}
