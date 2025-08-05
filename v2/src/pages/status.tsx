import React, { useState } from 'react';
import NetworkSelector from "../components/Bridge/NetworkSelector";
import BridgeStatus from "../components/Status/BridgeStatus";
import { NetworkKey } from "../config/networks";

export default function StatusPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey>('bsc');

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-dark-900 text-center">
        Bridge & Custodian Status
      </h2>
      
      <NetworkSelector
        selectedNetwork={selectedNetwork}
        onNetworkChange={setSelectedNetwork}
      />
      
      <BridgeStatus network={selectedNetwork} />
      
      <div className="mt-8 card">
        <h3 className="text-xl font-bold mb-4 text-dark-900">About the Bridge</h3>
        <div className="space-y-4 text-dark-600">
          <p>
            The wDingocoin Bridge operates using a decentralized network of 5 authority nodes per blockchain. 
            These nodes coordinate bridge operations and require a 3 out of 5 consensus threshold for all transactions.
          </p>
          <p>
            <strong>Mint Process:</strong> When you wrap Dingocoin, the authority nodes create a deposit address 
            and coordinate the minting of wDingocoin tokens on the target blockchain.
          </p>
          <p>
            <strong>Burn Process:</strong> When you unwrap wDingocoin, the tokens are burned on the blockchain 
            and the authority nodes coordinate the withdrawal of native Dingocoin to your specified address.
          </p>
          <p>
            <strong>Security:</strong> The bridge uses a 3/5 consensus mechanism, meaning at least 3 authority 
            nodes must be online and agree for transactions to be processed.
          </p>
        </div>
      </div>
    </div>
  );
}