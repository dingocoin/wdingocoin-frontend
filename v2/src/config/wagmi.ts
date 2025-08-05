import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'wDingocoin Bridge',
  projectId: '08e2c4cd7b75a298196dd225a454e11c', // Replace with your actual WalletConnect project ID
  chains: [
    mainnet,
    polygon,
    bsc,
    bscTestnet,
  ],
  ssr: false, // Disable SSR for now to avoid hydration issues
}); 