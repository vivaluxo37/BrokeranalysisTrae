import { useState, useCallback } from 'react';

type WidgetState = {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
};

const useWidgetState = () => {
  const [widgetState, setWidgetState] = useState<WidgetState>({
    isLoading: true,
    error: null,
    isSuccess: false,
  });

  const setLoading = useCallback(() => {
    setWidgetState({
      isLoading: true,
      error: null,
      isSuccess: false,
    });
  }, []);

  const setError = useCallback((error: Error) => {
    setWidgetState({
      isLoading: false,
      error,
      isSuccess: false,
    });
  }, []);

  const setSuccess = useCallback(() => {
    setWidgetState({
      isLoading: false,
      error: null,
      isSuccess: true,
    });
  }, []);

  return {
    ...widgetState,
    setLoading,
    setError,
    setSuccess,
  };
};

export default useWidgetState;
