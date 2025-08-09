import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, bscTestnet } from 'wagmi/chains';
import { ENABLE_TESTNET } from './env';

export const config = getDefaultConfig({
  appName: 'wDingocoin Bridge',
  projectId: '08e2c4cd7b75a298196dd225a454e11c', // Replace with your actual WalletConnect project ID
  chains: ENABLE_TESTNET ? [mainnet, polygon, bsc, bscTestnet] : [mainnet, polygon, bsc],
  ssr: false, // Disable SSR for now to avoid hydration issues
}); 