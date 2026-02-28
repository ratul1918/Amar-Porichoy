/**
 * useAsync — Safe async data fetching with cleanup, loading, and error state.
 *
 * Prevents state updates on unmounted components.
 * Wraps ApiResponse envelope automatically.
 *
 * @example
 * const { data, status, error, execute } = useAsync(() => identityApi.getProfile());
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApiResponse, AsyncState } from '../types/api';
import { secureLog } from '../lib/security';

export function useAsync<T>(
  asyncFn: () => Promise<ApiResponse<T>>,
  deps: unknown[] = [],
  options: { immediate?: boolean } = { immediate: true }
): {
  state: AsyncState<T>;
  execute: () => void;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async () => {
    if (!mountedRef.current) return;
    setState({ status: 'loading' });

    try {
      const response = await asyncFn();
      if (!mountedRef.current) return;

      if (response.success && response.data !== undefined) {
        setState({ status: 'success', data: response.data });
      } else {
        const errorMsg = response.error?.message ?? 'An unexpected error occurred';
        setState({ status: 'error', error: errorMsg });
      }
    } catch (err) {
      if (!mountedRef.current) return;
      secureLog.error('useAsync error', err);
      setState({ status: 'error', error: 'An unexpected error occurred' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (options.immediate) execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, execute, reset };
}

/**
 * useAsyncMutation — Like useAsync but manually triggered (for POST/PUT/DELETE).
 * Does not auto-execute on mount.
 */
export function useAsyncMutation<TArg, TResult>(
  asyncFn: (arg: TArg) => Promise<ApiResponse<TResult>>
): {
  state: AsyncState<TResult>;
  mutate: (arg: TArg) => Promise<TResult | null>;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<TResult>>({ status: 'idle' });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const mutate = useCallback(async (arg: TArg): Promise<TResult | null> => {
    if (!mountedRef.current) return null;
    setState({ status: 'loading' });

    try {
      const response = await asyncFn(arg);
      if (!mountedRef.current) return null;

      if (response.success && response.data !== undefined) {
        setState({ status: 'success', data: response.data });
        return response.data;
      } else {
        const errorMsg = response.error?.message ?? 'Operation failed';
        setState({ status: 'error', error: errorMsg });
        return null;
      }
    } catch (err) {
      if (!mountedRef.current) return null;
      secureLog.error('useAsyncMutation error', err);
      setState({ status: 'error', error: 'An unexpected error occurred' });
      return null;
    }
  }, [asyncFn]);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, mutate, reset };
}
