import React from 'react';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Coins, Layers } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Trustless',
      description: 'Multi-signature custody with transparent operations',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Cross-chain transfers in minutes, not hours',
      color: 'text-primary-600', 
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      icon: Globe,
      title: 'Multi-Chain Support',
      description: 'BSC, Polygon, and more networks supported',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50', 
      borderColor: 'border-secondary-200'
    }
  ];

  const stats = [
    { label: 'Networks Supported', value: '3+', icon: Layers },
    { label: 'Total Value Bridged', value: '$2.1M+', icon: TrendingUp },
    { label: 'Successful Transactions', value: '15,000+', icon: Coins }
  ];

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

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-pointer animate-slide-up p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-dark-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-4 px-2">
              Why Choose <span className="text-gradient">wDingocoin Bridge</span>?
            </h2>
            <p className="text-lg sm:text-xl text-dark-600 max-w-2xl mx-auto px-4">
              Built with security, speed, and user experience as our top priorities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`card-interactive p-6 sm:p-8 text-center border-2 ${feature.borderColor} animate-slide-up group`}
                style={{animationDelay: `${index * 0.3}s`}}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-dark-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
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

      {/* Call to Action */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
            Ready to Bridge Your Dingocoin?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">
            Join thousands of users who trust wDingocoin Bridge for secure cross-chain transfers
          </p>
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