import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gradient">
                wDingocoin Bridge
              </h1>
              <p className="text-xs text-dark-500">v2.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="https://dingocoin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-dark-600 hover:text-primary-600 transition-colors duration-200"
            >
              <span>Visit Dingocoin</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://pancakeswap.finance/swap?outputCurrency=0x9b208b117B2C4F76C1534B6f006b033220a681A4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-dark-600 hover:text-primary-600 transition-colors duration-200"
            >
              <span>Buy wDingocoin</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://poocoin.app/tokens/0x9b208b117b2c4f76c1534b6f006b033220a681a4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-dark-600 hover:text-primary-600 transition-colors duration-200"
            >
              <span>Price Chart</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 