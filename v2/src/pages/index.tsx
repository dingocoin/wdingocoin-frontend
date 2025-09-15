import React from 'react';
import { ArrowRight, TrendingUp, Copy, Check } from 'lucide-react';
import { BSC_CONFIG, POLYGON_CONFIG } from '../config/networks';

// Contract Address Card Component
interface ContractAddressCardProps {
  networkName: string;
  networkSymbol: string;
  contractAddress: string;
  explorerUrl: string;
  bgColor: string;
  iconBg: string;
  textColor: string;
}

function ContractAddressCard({
  networkName,
  networkSymbol,
  contractAddress,
  explorerUrl,
  bgColor,
  iconBg,
  textColor
}: ContractAddressCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`${bgColor} rounded-xl p-6 border hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mr-4`}>
          <span className="text-white font-bold text-lg">{networkSymbol}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-900">{networkName}</h3>
          <p className="text-sm text-dark-600">wDingocoin Contract</p>
        </div>
      </div>

      {/* Contract Address */}
      <div className="mb-4">
        <label className="text-sm font-medium text-dark-700 mb-2 block">Contract Address</label>
        <div className="bg-white rounded-lg p-3 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono text-dark-800 break-all flex-1 mr-2">
              {contractAddress}
            </code>
            <button
              onClick={copyToClipboard}
              className={`flex-shrink-0 p-2 rounded-md transition-colors duration-200 ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : `hover:${bgColor} ${textColor} hover:text-opacity-80`
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Explorer Link */}
      <a
        href={`${explorerUrl}/address/${contractAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center ${textColor} hover:text-opacity-80 transition-colors duration-200 text-sm font-medium`}
      >
        View on Explorer
        <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
}

export default function HomePage() {
  // Minimal landing: hero + ecosystem + CTA

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-slide-up leading-tight">
              <span className="text-gradient">wDingocoin</span>{' '}
              <span className="text-dark-900">Bridge</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-dark-600 mb-6 sm:mb-8 max-w-4xl mx-auto animate-slide-up leading-relaxed px-2">
              Seamlessly convert between <span className="font-semibold text-primary-600">Dingocoin</span> and{' '}
              <span className="font-semibold text-secondary-600">wDingocoin</span> across multiple blockchains
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-bounce-in max-w-md sm:max-w-none mx-auto">
              <a 
                href="/bridge"
                className="btn-primary group inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
              >
                <span>Start Bridging</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a 
                href="/status"
                className="btn-outline group inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Statistics</span>
              </a>
            </div>
          </div>

          {/* Floating Elements - Hidden on mobile, responsive positioning */}
          <div className="hidden md:block absolute top-20 left-4 lg:left-10 w-16 h-16 lg:w-20 lg:h-20 bg-primary-200 rounded-full opacity-20 animate-float"></div>
          <div className="hidden lg:block absolute top-40 right-12 xl:right-20 w-12 h-12 lg:w-16 lg:h-16 bg-secondary-200 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="hidden md:block absolute bottom-20 left-1/4 w-10 h-10 lg:w-12 lg:h-12 bg-green-200 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
      </div>


      {/* Network Support Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-slide-up px-2">
            <span className="text-gradient">Multi-Chain</span> Ecosystem
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto animate-slide-up px-4">
            Bridge your Dingocoin across the most popular blockchain networks
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-up">
            <div className="group p-4 sm:p-6 rounded-xl hover:bg-dark-800 transition-colors duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg sm:text-2xl font-bold text-black">BSC</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Binance Smart Chain</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Fast & low-cost transactions</p>
            </div>
            
            <div className="group p-4 sm:p-6 rounded-xl hover:bg-dark-800 transition-colors duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg sm:text-2xl font-bold text-white">POL</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Polygon</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Ethereum-compatible scaling</p>
            </div>
            
            <div className="group p-4 sm:p-6 rounded-xl hover:bg-dark-800 transition-colors duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 opacity-60">
                <span className="text-sm sm:text-lg font-bold text-white">More</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Coming Soon</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Additional networks in development</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Addresses Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
              <span className="text-gradient">Contract</span>{' '}
              <span className="text-dark-900">Addresses</span>
            </h2>
            <p className="text-lg sm:text-xl text-dark-600 mb-8 max-w-2xl mx-auto animate-slide-up">
              Verified smart contract addresses for wDingocoin on each supported network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* BSC Contract */}
            <ContractAddressCard
              networkName={BSC_CONFIG.name}
              networkSymbol="BSC"
              contractAddress="0x9b208b117B2C4F76C1534B6f006b033220a681A4"
              explorerUrl={BSC_CONFIG.explorerUrl}
              bgColor="bg-yellow-50"
              iconBg="bg-yellow-500"
              textColor="text-yellow-600"
            />

            {/* Polygon Contract */}
            <ContractAddressCard
              networkName={POLYGON_CONFIG.name}
              networkSymbol="POL"
              contractAddress="0x033babac01c4e3915cf71d24b6bfb58e606fdb80"
              explorerUrl={POLYGON_CONFIG.explorerUrl}
              bgColor="bg-purple-50"
              iconBg="bg-purple-600"
              textColor="text-purple-600"
            />
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm text-dark-500">
              Always verify contract addresses on the official blockchain explorers before interacting
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
            Ready to Bridge Your Dingocoin?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <a 
              href="/bridge"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
            >
              Launch Bridge App
            </a>
            <a 
              href="/status"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Check Network Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}