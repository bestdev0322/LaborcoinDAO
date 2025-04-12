import { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

// LABR Token ABI - we only need balanceOf function
const LABR_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

// You'll need to replace this with your actual LABR token address
const LABR_TOKEN_ADDRESS = "YOUR_LABR_TOKEN_ADDRESS";

type StepStatus = 'pending' | 'complete';

interface Step {
  icon: JSX.Element;
  title: string;
  status: StepStatus;
}

export default function Register() {
  const [account, setAccount] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
        </svg>
      ),
      title: 'Connect Wallet',
      status: 'pending',
    },
    {
      icon: (
        <div className="font-bold">
          LABR
        </div>
      ),
      title: 'Verify LABR Balance',
      status: 'pending',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </svg>
      ),
      title: 'Verify Identity',
      status: 'pending',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
        </svg>
      ),
      title: 'Complete Registration',
      status: 'pending',
    },
  ]);

  const getStatusStyles = (status: StepStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      default:
        return 'bg-[#F5F5F5] text-[#424242]';
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('window.ethereum', window.ethereum);
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        console.log('accounts', accounts);
        setAccount(accounts[0]);

        // Update step status
        updateStepStatus(0, 'complete');

        // Check LABR balance after connecting
        await checkLABRBalance(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        updateStepStatus(0, 'error');
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet!');
    }
  };

  const checkLABRBalance = async (address: string) => {
    try {
      const provider = new Web3Provider(window.ethereum);
      const labrContract = new ethers.Contract(
        LABR_TOKEN_ADDRESS,
        LABR_ABI,
        provider
      );
      
      const balance = await labrContract.balanceOf(address);
      const formattedBalance = ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals
      
      if (parseFloat(formattedBalance) >= 1.0) {
        updateStepStatus(1, 'complete');
      } else {
        updateStepStatus(1, 'error');
        alert('You need at least 1.0 LABR tokens to register');
      }
    } catch (error) {
      console.error('Error checking LABR balance:', error);
      updateStepStatus(1, 'error');
    }
  };

  const updateStepStatus = (index: number, status: StepStatus) => {
    setSteps(steps => 
      steps.map((step, i) => 
        i === index ? { ...step, status } : step
      )
    );
  };

  return (
    <div className="max-w-[600px] mx-auto p-8 bg-white rounded-[20px]">
      <h1 className="text-[32px] font-bold mb-4">Register</h1>
      <p className="text-[#4A5568] text-lg mb-8">
        Follow the steps below to register as a member of the DAO voting group.
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.title}
            className="flex items-center justify-between p-4 border rounded-[12px]"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center">
                {step.icon}
              </div>
              <span className="font-medium text-[16px]">
                {step.title}
              </span>
            </div>
            
            {index === 0 && step.status !== 'complete' ? (
              <button
                onClick={connectWallet}
                className="px-6 py-2 bg-[#2563EB] text-white font-medium rounded-[8px] hover:bg-[#1E40AF] transition-colors"
              >
                Connect
              </button>
            ) : (
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyles(step.status)}`}>
                {step.status === 'complete' ? 'Complete' : 'Pending'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 