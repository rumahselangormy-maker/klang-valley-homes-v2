import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Captured app error:', error, errorInfo);
  }

  public render() {
    const children = (this as unknown as { props: Props }).props?.children;

    if (this.state.hasError) {
      if (
        this.state.error?.message?.includes('Blocked a frame') ||
        this.state.error?.message?.includes('$$typeof')
      ) {
        return children;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-amber-400">Suatu Masalah Telah Berlaku</h2>
            <p className="text-sm text-slate-300">
              Sila muat semula halaman ini untuk meneruskan.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Muat Semula Halaman
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
