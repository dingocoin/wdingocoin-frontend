import { useQuery, useQueries, QueryKey } from '@tanstack/react-query';
import { NETWORKS, type NetworkKey } from '../config/networks';
import type { NetworkConfig } from '../types/bridge';
import { post, getAliveNodes, getStableAuthorityLink } from '../utils/bridge';
import type { BridgeStats } from '../types/bridge';

const DEFAULTS = {
  refetchInterval: 15000,
  staleTime: 10000,
  gcTime: 5 * 60 * 1000,
  retry: 1,
};

export function useAliveNodesQuery(networkKey: NetworkKey) {
  const network = NETWORKS[networkKey] as NetworkConfig;
  return useQuery<number[]>({
    queryKey: ['aliveNodes', networkKey] as QueryKey,
    queryFn: () => getAliveNodes(network),
    ...DEFAULTS,
  });
}

export function useBridgeStatsQuery(networkKey: NetworkKey) {
  const network = NETWORKS[networkKey] as NetworkConfig;
  return useQuery<BridgeStats | null>({
    queryKey: ['bridgeStats', networkKey] as QueryKey,
    queryFn: async () => {
      try {
        const link = getStableAuthorityLink(network);
        const res = await post(`${link}/stats`, {});
        return res.data ?? null;
      } catch {
        return null;
      }
    },
    ...DEFAULTS,
  });
}

export function useWarmBridgeQueries(networkKeys: NetworkKey[]) {
  useQueries({
    queries: networkKeys.flatMap((key) => [
      {
        queryKey: ['aliveNodes', key] as QueryKey,
        queryFn: () => getAliveNodes(NETWORKS[key] as NetworkConfig),
        ...DEFAULTS,
      },
      {
        queryKey: ['bridgeStats', key] as QueryKey,
        queryFn: async () => {
          try {
            const link = getStableAuthorityLink(NETWORKS[key] as NetworkConfig);
            const res = await post(`${link}/stats`, {});
            return res.data ?? null;
          } catch {
            return null;
          }
        },
        ...DEFAULTS,
      },
    ]),
  });
}

