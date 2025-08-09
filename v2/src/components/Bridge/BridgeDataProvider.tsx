import React from 'react';
import { useWarmBridgeQueries } from '../../hooks/bridgeQueries';
import { type NetworkKey, NETWORKS } from '../../config/networks';

type Props = {
  children: React.ReactNode;
  networks?: NetworkKey[];
};

export default function BridgeDataProvider({ children, networks }: Props) {
  const networkKeys = (networks ?? (Object.keys(NETWORKS) as NetworkKey[]));
  useWarmBridgeQueries(networkKeys);
  return <>{children}</>;
}

