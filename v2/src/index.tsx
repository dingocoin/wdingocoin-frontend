import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import BridgeDataProvider from './components/Bridge/BridgeDataProvider';
import './index.css';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

// Suppress development warnings for better UX
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out common development warnings that don't affect functionality
  const message = args.join(' ');
  if (
    message.includes('Warning: ReactDOM.render is no longer supported') ||
    message.includes('Warning: componentWillReceiveProps') ||
    message.includes('Warning: componentWillUpdate') ||
    message.includes('Warning: componentWillMount') ||
    message.includes('Warning: Failed to parse source map') ||
    message.includes('Warning: Module Warning')
  ) {
    return;
  }
  originalConsoleError(...args);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <BridgeDataProvider>
              <App />
            </BridgeDataProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>
); 