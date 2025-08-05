import { NetworkConfig } from '../types/bridge';

export const BSC_CONFIG: NetworkConfig = {
  name: 'Binance Smart Chain',
  chainId: 56,
  contractAddress: '0x9b208b117B2C4F76C1534B6f006b033220a681A4',
  authorityNodes: [
    {
      location: 'n0.dingocoin.com',
      port: 8443,
      walletAddress: '0xD456eB296F8448Df66745f9bd0e759a1b58a6D9d',
    },
    {
      location: 'n1.dingocoin.com',
      port: 8443,
      walletAddress: '0xD14Bc59472b8f1fA5baA99a17855d06aD327dCae',
    },
    {
      location: 'n2.dingocoin.com',
      port: 8443,
      walletAddress: '0x3279f7B244F0194fd359D5AC29359ca676193aDb',
    },
    {
      location: 'n3.dingocoin.com',
      port: 8443,
      walletAddress: '0x9d046eDc2C80727259355E4CFBb8B72750348Ad9',
    },
    {
      location: 'n4.dingocoin.com',
      port: 8443,
      walletAddress: '0xfe7141385E848274bba58E710C8c5D1c673Ef2Fe',
    },
  ],
  authorityThreshold: 3,
  decimals: 8,
  rpcUrl: 'https://bsc-dataseed.binance.org',
  explorerUrl: 'https://bscscan.com',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

export const POLYGON_CONFIG: NetworkConfig = {
  name: 'Polygon',
  chainId: 137,
  contractAddress: '0x033babac01c4e3915cf71d24b6bfb58e606fdb80',
  authorityNodes: [
    {
      location: 'mn1.dingocoin.com',
      port: 8443,
      walletAddress: '0x72321c492EAA102C331C0EB64c9E4a72036f2f1d',
    },
    {
      location: 'mn5.dingocoin.com',
      port: 8443,
      walletAddress: '0x90c5951c839de0CC80138D7A47a3F1F0eE5828Ba',
    },
    {
      location: 'wdingomatic.mysterious-beard-tackles.com',
      port: 8443,
      walletAddress: '0xcceA32dDbd0b8c56904ED5Cf6Bed0260a753b90a',
    },
    {
      location: 'mn2.dingocoin.com',
      port: 8443,
      walletAddress: '0xfA3ba79a0266Fd0354547E4807b19bC8Cef0696C',
    },
    {
      location: 'mn4.dingocoin.com',
      port: 8443,
      walletAddress: '0xDD67CeAA42224808eEC2eb8A0f4D57DD3fe9fa4C',
    },
  ],
  authorityThreshold: 3,
  decimals: 8,
  rpcUrl: 'https://polygon-rpc.com',
  explorerUrl: 'https://polygonscan.com',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
};

export const TBNB_CONFIG: NetworkConfig = {
  name: 'BSC Testnet',
  chainId: 97,
  contractAddress: '0x0000000000000000000000000000000000000000', // Placeholder - needs real testnet contract
  authorityNodes: [
    {
      location: 'testnet-n0.dingocoin.com',
      port: 8443,
      walletAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      location: 'testnet-n1.dingocoin.com',
      port: 8443,
      walletAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      location: 'testnet-n2.dingocoin.com',
      port: 8443,
      walletAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      location: 'testnet-n3.dingocoin.com',
      port: 8443,
      walletAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      location: 'testnet-n4.dingocoin.com',
      port: 8443,
      walletAddress: '0x0000000000000000000000000000000000000000',
    },
  ],
  authorityThreshold: 3,
  decimals: 8,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  explorerUrl: 'https://testnet.bscscan.com',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
};

export const NETWORKS = {
  bsc: BSC_CONFIG,
  polygon: POLYGON_CONFIG,
  tbnb: TBNB_CONFIG,
} as const;

export type NetworkKey = keyof typeof NETWORKS; 