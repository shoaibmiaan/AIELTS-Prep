import { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from '@/components/ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorPage 
        error={this.state.error} 
        onReset={this.handleReset} 
        showActions={true}
      />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;