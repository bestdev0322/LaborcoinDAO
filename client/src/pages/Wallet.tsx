import { FC } from 'react';
import { useAccount, useBalance } from 'wagmi';

const Wallet: FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: '0x...', // LABR token address
  });

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Connect Your Wallet</h2>
          <p className="mt-2 text-gray-600">Please connect your wallet to view your balance and transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LABR Balance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">LABR Balance</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-blue-600">
              {balance?.formatted || '0.0'} LABR
            </span>
            <p className="text-sm text-gray-500 mt-1">Governance Token</p>
          </div>
        </div>

        {/* LABRV Balance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Voting Power</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-blue-600">1.0 LABRV</span>
            <p className="text-sm text-gray-500 mt-1">Voting Token</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Received LABRV</p>
              <p className="text-xs text-gray-500 mt-1">From: DAO Treasury</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">+1.0 LABRV</p>
              <p className="text-xs text-gray-500 mt-1">5 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
