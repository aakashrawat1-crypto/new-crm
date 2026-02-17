import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("CRITICAL UI ERROR:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 p-10 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-red-100">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! The UI Crashed.</h1>
                        <p className="text-gray-600 mb-6 font-medium">Please provide this error message to the developer:</p>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-xl text-left overflow-auto max-h-96 font-mono text-sm leading-relaxed">
                            <p className="font-bold border-b border-gray-700 pb-2 mb-2">Error: {this.state.error?.message}</p>
                            <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
