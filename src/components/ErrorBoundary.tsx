import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void; // Callback to reset the error state
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Here you would typically log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', border: '1px solid red', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          {this.props.onReset && (
            <button onClick={() => this.setState({ hasError: false, error: null }, this.props.onReset)}>
              Try again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
