// Custom hooks for API calls
import { useState, useEffect } from 'react';
import { ApiResponse, PaginatedResponse } from '../types/database';

// Generic API hook
export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      });
      
      const result: ApiResponse<T> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// API call function for mutations
export async function apiCall<T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

// Mutation hook for POST, PUT, DELETE operations
export function useMutation<T, U = any>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (payload?: U): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (payload && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(payload);
      }
      
      const response = await fetch(url, options);
      const result: ApiResponse<T> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Network error';
      setError(error);
      return {
        success: false,
        error
      };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
}

// Pagination hook
export function usePagination<T>(
  baseUrl: string,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${baseUrl}?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      const result: ApiResponse<PaginatedResponse<T>> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, baseUrl]);

  const nextPage = () => {
    if (data && page < data.totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  return {
    data,
    loading,
    error,
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    refetch: fetchData
  };
}

// Local storage hook for persistence
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

// Debounce hook for search
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
