import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from "../components/Wallet/ConnectButton";
import NetworkSelector from "../components/Bridge/NetworkSelector";
import MintForm from "../components/Bridge/MintForm";
import BurnForm from "../components/Bridge/BurnForm";
import { useBridge } from "../hooks/useBridge";
import { NetworkKey } from "../config/networks";
import { formatAmount } from "../utils/bridge";

export default function BridgePage() {
  const { address } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey>('bsc');
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const {
    mintTokens,
    burnTokens,
    createDepositAddress,
    submitWithdrawal,
    aliveNodes,
    mintDepositAddresses,
    burnHistory,
    stats: bridgeStats,
    isLoading: bridgeLoading,
  } = useBridge(selectedNetwork);

  const handleMint = async (depositAddress: string) => {
    setIsMinting(true);
    try {
      await mintTokens(depositAddress);
    } finally {
      setIsMinting(false);
    }
  };

  const handleCreateDepositAddress = async () => {
    setIsMinting(true);
    try {
      await createDepositAddress();
    } finally {
      setIsMinting(false);
    }
  };

  const handleBurn = async (amount: string, destinationAddress: string) => {
    setIsBurning(true);
    try {
      await burnTokens(amount, destinationAddress);
    } finally {
      setIsBurning(false);
    }
  };

  const handleSubmitWithdrawal = async (burnIndex: number) => {
    setIsBurning(true);
    try {
      await submitWithdrawal(burnIndex);
    } finally {
      setIsBurning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 flex justify-center">
        <ConnectButton />
      </div>

      {address && (
        <NetworkSelector
          selectedNetwork={selectedNetwork}
          onNetworkChange={setSelectedNetwork}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mint Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-dark-900">
            Wrap Dingocoin (Mint wDingocoin)
          </h2>
          <p className="text-sm text-dark-600 mb-6">
            Convert your native Dingocoin to wrapped wDingocoin on {selectedNetwork.toUpperCase()}.
          </p>
          <MintForm
            onMint={handleMint}
            onCreateDepositAddress={handleCreateDepositAddress}
            isLoading={isMinting || bridgeLoading}
            isCreatingDeposit={isMinting}
            network={selectedNetwork}
            mintDepositAddresses={mintDepositAddresses}
            aliveNodes={aliveNodes}
          />
        </div>

        {/* Burn Form */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-dark-900">
            Unwrap wDingocoin (Burn to Dingocoin)
          </h2>
          <p className="text-sm text-dark-600 mb-6">
            Convert your wrapped wDingocoin back to native Dingocoin.
          </p>
          <BurnForm
            onBurn={handleBurn}
            onSubmitWithdrawal={handleSubmitWithdrawal}
            burnHistory={burnHistory || []}
            isLoading={isBurning}
            network={selectedNetwork}
          />
        </div>
      </div>

      {/* Bridge Status */}
      {address && (
        <div className="mt-12 card">
          <h3 className="text-xl font-bold mb-4 text-dark-900">Bridge Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-dark-600">Alive Nodes</div>
              <div className="text-2xl font-bold text-dark-900">
                {aliveNodes.length}/5
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-dark-600">Total wDingocoin Supply</div>
              <div className="text-2xl font-bold text-dark-900">
                {bridgeStats?.totalSupply ? formatAmount(bridgeStats.totalSupply) : '0'} DINGO
              </div>
            </div>
          </div>
        </div>
      )}

      {!address && (
        <div className="mt-8 text-center">
          <p className="text-dark-600">
            Connect your wallet to start using the bridge
          </p>
        </div>
      )}
    </div>
  );
}