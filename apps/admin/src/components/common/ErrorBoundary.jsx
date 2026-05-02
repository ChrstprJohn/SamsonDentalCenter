import React from 'react';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';
import { Button } from '../ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl shadow-brand-500/10 border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={40} />
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
              Something went wrong.
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
              An unexpected error occurred in the application. We've been notified and are looking into it.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-brand-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition-all"
              >
                <RefreshCcw size={18} />
                Reload Application
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full h-12 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <Home size={18} />
                Back to Dashboard
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-left overflow-auto max-h-40 border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-mono text-red-500 font-bold uppercase mb-2">Debug Info:</p>
                <p className="text-[10px] font-mono text-gray-400 break-all">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
