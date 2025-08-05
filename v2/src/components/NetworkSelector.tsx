import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { NetworkKey, NETWORKS } from '../config/networks';
import { getNetworkDisplayName } from '../utils/bridge';

interface NetworkSelectorProps {
  selectedNetwork: NetworkKey;
  onNetworkChange: (network: NetworkKey) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onNetworkChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const networkOptions = Object.keys(NETWORKS) as NetworkKey[];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-dark-300 rounded-lg shadow-sm hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
      >
        <span className="text-dark-900 font-medium">
          {getNetworkDisplayName(selectedNetwork)}
        </span>
        <ChevronDown className={`w-5 h-5 text-dark-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-dark-300 rounded-lg shadow-lg">
          <div className="py-1">
            {networkOptions.map((network) => (
              <button
                key={network}
                onClick={() => {
                  onNetworkChange(network);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-dark-50 transition-colors duration-200"
              >
                <span className="text-dark-900">
                  {getNetworkDisplayName(network)}
                </span>
                {selectedNetwork === network && (
                  <Check className="w-5 h-5 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector; 