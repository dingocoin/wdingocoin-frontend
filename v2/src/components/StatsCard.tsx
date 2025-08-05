import React from 'react';
import { TrendingUp, Coins, ArrowUpDown, Clock } from 'lucide-react';
import { BridgeStats } from '../types/bridge';
import { formatAmount } from '../utils/bridge';

interface StatsCardProps {
  stats: BridgeStats;
  networkName: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, networkName }) => {
  const statItems = [
    {
      icon: Coins,
      label: 'Dingocoin Holdings',
      value: formatAmount((BigInt(stats.unconfirmedUtxos.totalChangeBalance) + BigInt(stats.unconfirmedUtxos.totalDepositsBalance)).toString()),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: TrendingUp,
      label: 'wDingocoin in Circulation',
      value: formatAmount(stats.totalSupply),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: ArrowUpDown,
      label: 'Dingocoin Deposited',
      value: formatAmount(BigInt(stats.unconfirmedDeposits.totalDepositedAmount).toString()),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Clock,
      label: 'Pending Withdrawals',
      value: formatAmount((BigInt(stats.withdrawals.totalApprovableAmount) - BigInt(stats.withdrawals.totalApprovedAmount)).toString()),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark-900 mb-2">
          {networkName} Bridge Statistics
        </h3>
        <p className="text-sm text-dark-500">
          Real-time bridge activity and token circulation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-dark-50">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-dark-500 font-medium">{item.label}</p>
              <p className="text-lg font-semibold text-dark-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-dark-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-dark-600">Exchange Rate:</span>
          <span className="font-semibold text-dark-900">1 wDingocoin = 1 Dingocoin</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 