import { useRef, useEffect } from 'react';

/**
 * Hook to get the previous value of a variable
 * Useful for comparisons or detecting changes
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}
