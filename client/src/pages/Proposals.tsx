
import { FC } from 'react';
import { useAccount } from 'wagmi';

const Proposals: FC = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Connect to Vote</h2>
          <p className="mt-2 text-gray-600">Please connect your wallet to view and participate in proposals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Proposals</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
            Active
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
            Closed
          </button>
        </div>
      </div>

      {/* Proposal List */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Proposal #123</h3>
              <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                Active
              </span>
            </div>
            <p className="mt-2 text-gray-600">Proposal to update community guidelines</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Vote For
                </button>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                  Vote Against
                </button>
              </div>
              <span className="text-sm text-gray-500">Ends in 2 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposals;
