import { FC } from 'react';
import { useAccount } from 'wagmi';

const Dashboard: FC = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Welcome to LaborCoin DAO</h2>
          <p className="mt-2 text-gray-600">Please connect your wallet to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voting Power Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">My Voting Power</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-blue-600">1.0 LABRV</span>
            <p className="text-sm text-gray-500 mt-1">Your voting power in the DAO</p>
          </div>
        </div>

        {/* Active Proposals Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Active Proposals</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-blue-600">2</span>
            <p className="text-sm text-gray-500 mt-1">Proposals waiting for your vote</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">You voted on proposal #123</p>
            <p className="text-xs text-gray-400 mt-1">2 days ago</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">You received 1.0 LABRV token</p>
            <p className="text-xs text-gray-400 mt-1">5 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;