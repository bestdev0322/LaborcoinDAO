import { FC, useState, useCallback, useEffect, ReactElement } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';

type StepStatus = 'incomplete' | 'complete';

interface Step {
  icon: ReactElement;
  title: string;
  status: StepStatus;
}

const WalletIcons = {
  metaMaskSDK:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" id="Metamask-Icon--Streamline-Svg-Logos" height="32" width="32"><desc>Metamask Icon Streamline Icon: https://streamlinehq.com</desc><path fill="#e17726" d="M30.940299999999997 1.31657 17.49543333333333 11.264833333333332l2.5002 -5.862833333333333 10.944666666666667 -4.08543Z" strokeWidth="0.3333"></path><path fill="#e27625" d="M1.09082 1.3282066666666665 12.0062 5.402666666666666l2.374033333333333 5.939699999999999L1.09082 1.3282066666666665Z" strokeWidth="0.3333"></path><path fill="#e27625" d="m25.52963333333333 22.473633333333332 5.9424 0.11309999999999999 -2.0768 7.055166666666667 -7.251033333333333 -1.9964666666666666 3.3854333333333333 -5.171799999999999Z" strokeWidth="0.3333"></path><path fill="#e27625" d="m6.470033333333333 22.473633333333332 3.3729 5.171833333333333 -7.238899999999999 1.9965666666666666 -2.0641566666666664 -7.0553 5.930156666666666 -0.11309999999999999Z" strokeWidth="0.3333"></path><path fill="#e27625" d="m14.057699999999999 9.829333333333333 0.24293333333333333 7.843566666666666 -7.266766666666666 -0.33063333333333333 2.0669666666666666 -3.118333333333333 0.026166666666666664 -0.030066666666666665L14.057699999999999 9.829333333333333Z" strokeWidth="0.3333"></path><path fill="#e27625" d="m17.867066666666666 9.741933333333332 5.005933333333333 4.452333333333333 0.0259 0.02983333333333333 2.0670333333333333 3.118333333333333 -7.2651 0.3305666666666667 0.16623333333333332 -7.931066666666666Z" strokeWidth="0.3333"></path><path fill="#e27625" d="m10.0557 22.496333333333332 3.9678666666666667 3.091566666666666 -4.609166666666667 2.2253666666666665 0.6413 -5.316933333333333Z" strokeWidth="0.3333"></path><path fill="#e27625" d="m21.944966666666666 22.49583333333333 0.6279999999999999 5.317433333333333 -4.596233333333333 -2.2255666666666665 3.968233333333333 -3.0918666666666668Z" strokeWidth="0.3333"></path><path fill="#d5bfb2" d="m18.077966666666665 25.296533333333333 4.664133333333333 2.2584666666666666 -4.338566666666667 2.0619666666666667 0.04503333333333333 -1.3628333333333331 -0.37059999999999993 -2.9576Z" strokeWidth="0.3333"></path><path fill="#d5bfb2" d="m13.920733333333333 25.297533333333334 -0.35606666666666664 2.9342666666666664 0.029199999999999997 1.3835 -4.348733333333334 -2.0603333333333333 4.675599999999999 -2.257433333333333Z" strokeWidth="0.3333"></path><path fill="#233447" d="m12.573899999999998 18.696599999999997 1.2188333333333332 2.5614999999999997 -4.149666666666667 -1.2155666666666667 2.930833333333333 -1.3459333333333332Z" strokeWidth="0.3333"></path><path fill="#233447" d="m19.426199999999998 18.696866666666665 2.9446 1.3455666666666666 -4.163133333333333 1.2152666666666665 1.2185333333333332 -2.560833333333333Z" strokeWidth="0.3333"></path><path fill="#cc6228" d="m10.373166666666666 22.470299999999998 -0.6708 5.512666666666666 -3.5950999999999995 -5.392166666666666 4.2659 -0.1205Z" strokeWidth="0.3333"></path><path fill="#cc6228" d="m21.627266666666664 22.470366666666667 4.266033333333333 0.12053333333333333L22.284666666666666 27.9832l-0.6574 -5.512833333333333Z" strokeWidth="0.3333"></path><path fill="#cc6228" d="m25.070899999999998 17.030666666666665 -3.104633333333333 3.164066666666667 -2.3936333333333333 -1.0938333333333332 -1.1460666666666666 2.4092 -0.7512666666666666 -4.142933333333334 7.3956 -0.3365Z" strokeWidth="0.3333"></path><path fill="#cc6228" d="m6.9274 17.0306 7.3969 0.33653333333333335 -0.7512999999999999 4.142966666666666 -1.1462666666666665 -2.408933333333333 -2.381033333333333 1.0936 -3.1183 -3.1641666666666666Z" strokeWidth="0.3333"></path><path fill="#e27525" d="m6.7184333333333335 16.381433333333334 3.512533333333333 3.5642666666666667 0.12173333333333333 3.5187333333333335 -3.634266666666666 -7.082999999999999Z" strokeWidth="0.3333"></path><path fill="#e27525" d="M25.2853 16.375 21.64453333333333 23.470666666666666l0.13706666666666667 -3.5250333333333335L25.2853 16.375Z" strokeWidth="0.3333"></path><path fill="#e27525" d="m14.1528 16.5983 0.14136666666666664 0.8898333333333334 0.34933333333333333 2.216666666666667 -0.22456666666666664 6.808333333333334 -1.0617999999999999 -5.469199999999999 -0.00036666666666666667 -0.05653333333333333 0.7960333333333334 -4.389099999999999Z" strokeWidth="0.3333"></path><path fill="#e27525" d="m17.845333333333333 16.5861 0.7981333333333334 4.401366666666666 -0.0003333333333333333 0.05653333333333333 -1.0644666666666667 5.482866666666666 -0.042133333333333335 -1.3713666666666664 -0.1661 -5.4909333333333326 0.4749 -3.0784666666666665Z" strokeWidth="0.3333"></path><path fill="#f5841f" d="m22.093999999999998 19.803866666666664 -0.11886666666666665 3.0572 -3.7053999999999996 2.8869999999999996 -0.7490666666666665 -0.5292666666666667 0.8396666666666667 -4.3248999999999995 3.7336666666666667 -1.0900333333333332Z" strokeWidth="0.3333"></path><path fill="#f5841f" d="m9.918766666666667 19.803966666666668 3.720833333333333 1.0900333333333332 0.8396333333333332 4.324833333333333 -0.7491 0.5292333333333332 -3.7055999999999996 -2.887233333333333 -0.10576666666666668 -3.0568666666666666Z" strokeWidth="0.3333"></path><path fill="#c0ac9d" d="m8.536133333333332 26.879799999999996 4.740633333333333 2.2462 -0.020066666666666663 -0.9591666666666666L13.653333333333332 27.818666666666665h4.691933333333333l0.41100000000000003 0.347 -0.030266666666666667 0.9585 4.710566666666667 -2.2386999999999997 -2.2921666666666667 1.8941666666666666L18.372666666666667 30.68333333333333H13.615366666666667l-2.769933333333333 -1.9114999999999998 -2.3093 -1.8920333333333332Z" strokeWidth="0.3333"></path><path fill="#161616" d="m17.738366666666664 24.997633333333333 0.6702666666666667 0.4734666666666667 0.3927999999999999 3.1339333333333332 -0.5684333333333333 -0.48H13.768566666666667l-0.5576333333333333 0.4896666666666667 0.37989999999999996 -3.143366666666666 0.6704999999999999 -0.4737h3.4770333333333334Z" strokeWidth="0.3333"></path><path fill="#763e1a" d="m30.052833333333332 1.5919599999999998 1.6138666666666666 4.841673333333333 -1.0078666666666667 4.8953999999999995 0.7176999999999999 0.5536666666666666 -0.9711666666666666 0.7409666666666667 0.7298333333333332 0.5636666666666666 -0.9664666666666666 0.8802333333333332 0.5933666666666666 0.42969999999999997 -1.5747 1.8390999999999997 -6.458833333333333 -1.8805333333333334 -0.055966666666666665 -0.03 -4.654366666666666 -3.926266666666667L30.052833333333332 1.5919599999999998Z" strokeWidth="0.3333"></path><path fill="#763e1a" d="M1.9472466666666666 1.5919599999999998 13.981866666666665 10.499566666666666l-4.654333333333333 3.926266666666667 -0.056 0.03 -6.45886 1.8805333333333334 -1.5746866666666666 -1.8390999999999997 0.5928933333333333 -0.4293666666666667 -0.96604 -0.8805333333333333 0.7285033333333333 -0.5630999999999999 -0.98568 -0.7430666666666667 0.7447733333333333 -0.5539999999999999L0.3333333333333333 6.4338 1.9472466666666666 1.5919599999999998Z" strokeWidth="0.3333"></path><path fill="#f5841f" d="m22.412633333333332 14.0445 6.843566666666666 1.9924666666666666 2.2233666666666663 6.8524 -5.865666666666667 0 -4.041633333333333 0.051 2.939233333333333 -5.7291 -2.0988666666666664 -3.1667666666666663Z" strokeWidth="0.3333"></path><path fill="#f5841f" d="m9.587399999999999 14.0445 -2.0992333333333333 3.1667666666666663 2.939633333333333 5.7291 -4.039633333333333 -0.051H0.5328766666666667l2.21088 -6.852333333333332 6.8436433333333335 -1.9925333333333333Z" strokeWidth="0.3333"></path><path fill="#f5841f" d="m20.330766666666666 5.3693 -1.9142000000000001 5.169866666666667 -0.40619999999999995 6.984 -0.1554333333333333 2.189 -0.012333333333333332 5.591966666666666H14.1571l-0.011966666666666667 -5.581466666666666 -0.1559333333333333 -2.201433333333333 -0.4064 -6.982066666666666 -1.9138666666666666 -5.169866666666667h8.661833333333332Z" strokeWidth="0.3333"></path></svg>,
  coinbaseWalletSDK: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#2C5FF6" />
      <path d="M16 6C10.4767 6 6 10.4767 6 16C6 21.5233 10.4767 26 16 26C21.5233 26 26 21.5233 26 16C26 10.4767 21.5233 6 16 6ZM16 23.0733C12.0867 23.0733 8.92667 19.9133 8.92667 16C8.92667 12.0867 12.0867 8.92667 16 8.92667C19.9133 8.92667 23.0733 12.0867 23.0733 16C23.0733 19.9133 19.9133 23.0733 16 23.0733Z" fill="white" />
      <path d="M19.1333 14.4333H12.8667V17.5667H19.1333V14.4333Z" fill="white" />
    </svg>
  ),
  walletConnect: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.58818 11.8556C13.1755 8.26825 19.0285 8.26825 22.6159 11.8556L23.1273 12.367C23.3592 12.599 23.3592 12.9792 23.1273 13.2111L21.8018 14.5366C21.6859 14.6526 21.4958 14.6526 21.3798 14.5366L20.6816 13.8384C18.2152 11.372 14.0847 11.372 11.6183 13.8384L10.8722 14.5845C10.7563 14.7004 10.5661 14.7004 10.4502 14.5845L9.12469 13.259C8.89277 13.027 8.89277 12.6468 9.12469 12.4149L9.58818 11.8556ZM25.9433 15.1829L27.1249 16.3645C27.3568 16.5964 27.3568 16.9766 27.1249 17.2085L20.8961 23.4373C20.6642 23.6692 20.284 23.6692 20.0521 23.4373L15.8245 19.2097C15.7665 19.1517 15.6725 19.1517 15.6145 19.2097L11.387 23.4373C11.155 23.6692 10.7749 23.6692 10.5429 23.4373L4.3101 17.2085C4.07818 16.9766 4.07818 16.5964 4.3101 16.3645L5.49167 15.1829C5.72359 14.951 6.10375 14.951 6.33567 15.1829L10.5632 19.4105C10.6212 19.4685 10.7152 19.4685 10.7732 19.4105L15.0007 15.1829C15.2327 14.951 15.6128 14.951 15.8447 15.1829L20.0723 19.4105C20.1303 19.4685 20.2243 19.4685 20.2823 19.4105L24.5098 15.1829C24.7417 14.951 25.1219 14.951 25.3538 15.1829Z" fill="#3B99FC" />
    </svg>
  ),
  injected: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#1A1A1A" />
      <path d="M9 11C9 9.89543 9.89543 9 11 9H21C22.1046 9 23 9.89543 23 11V21C23 22.1046 22.1046 23 21 23H11C9.89543 23 9 22.1046 9 21V11Z" stroke="white" strokeWidth="2" />
      <path d="M13 16H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 13L16 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
};

const Register: FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // State
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="currentColor" />
          <path d="M7 14h10v2H7v-2zm0-6h4v2H7V8z" fill="white" />
        </svg>
      ),
      title: 'Connect Wallet',
      status: 'incomplete',
    },
    {
      icon: (
        <div className="font-bold">
          LABR
        </div>
      ),
      title: 'Verify LABR Balance',
      status: 'incomplete',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
        </svg>
      ),
      title: 'Verify Identity',
      status: 'incomplete',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
        </svg>
      ),
      title: 'Complete Registration',
      status: 'incomplete',
    },
  ]);

  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Handlers
  const updateStepStatus = useCallback((index: number, status: StepStatus): void => {
    setSteps(prevSteps =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, status } : step
      )
    );
  }, []);

  const handleConnect = async (connector: any) => {
    try {
      setConnectionError(null);
      if (!connector.ready) {
        if (connector.id === 'metaMask') {
          window.open('https://metamask.io/download/', '_blank');
          return;
        }
      }

      await connect({ connector });
      setShowWalletModal(false);
    } catch (error: any) {
      if (error.code === 4001) {
        setConnectionError('Please approve the connection request in MetaMask to continue.');
      } else if (error.code === -32002) {
        setConnectionError('Please check MetaMask popup and approve the connection request.');
      } else {
        console.error('Error connecting wallet:', error);
        setConnectionError('Failed to connect wallet. Please try again.');
      }
    }
  };

  const checkAndSwitchNetwork = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      // Polygon Mainnet chainId is 137
      if (network.chainId !== 137) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // 137 in hex
        });
      }
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, let's add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com']
            }]
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
          setBalanceError('Please add the Polygon network to your wallet and try again.');
        }
      }
      console.error('Error switching to Polygon network:', error);
      setBalanceError('Please switch to the Polygon network to check your LABR balance.');
    }
  };

  const checkLABRBalance = async (walletAddress: string): Promise<void> => {
    try {
      // Get the Polygon provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // The minimal ABI for ERC20 balanceOf
      const minABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];

      // Create contract instance
      const labrContract = new ethers.Contract(
        import.meta.env.VITE_LABR_TOKEN_ADDRESS || '', // Make sure this is set in your .env
        minABI,
        provider
      );

      // Get token decimals
      const decimals = await labrContract.decimals();

      // Get balance
      const balance = await labrContract.balanceOf(walletAddress);
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);

      console.log('LABR Balance:', formattedBalance);

      if (parseFloat(formattedBalance) >= 1.0) {
        updateStepStatus(1, 'complete');
      } else {
        // Show user-friendly message for insufficient balance
        setBalanceError(`Insufficient LABR tokens. You have ${formattedBalance} LABR, but need at least 1.0 LABR to register.`);
      }
    } catch (error) {
      console.error('Error checking LABR balance:', error);
      setBalanceError('Failed to check LABR balance. Please make sure you are connected to Polygon network.');
    }
  };

  // Update the useEffect to include network check
  useEffect(() => {
    if (isConnected && address) {
      updateStepStatus(0, 'complete');
      checkAndSwitchNetwork().then(() => {
        checkLABRBalance(address);
      });
    }
    console.log('connectors', connectors);
  }, [isConnected, address, updateStepStatus]);

  // Wallet Modal Component
  const WalletModal: FC = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowWalletModal(false)}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-[380px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Connect Wallet</h3>
          <button
            onClick={() => setShowWalletModal(false)}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet Options */}
        <div className="p-6 space-y-4">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => void handleConnect(connector)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
            >
              <span className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white transition-colors">
                  {WalletIcons[connector.id as keyof typeof WalletIcons]}
                </span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{connector.name}</p>
                  <p className="text-sm text-gray-500">
                    {connector.id === 'metaMask' && 'Connect to your MetaMask Wallet'}
                    {connector.id === 'coinbaseWallet' && 'Connect to your Coinbase Wallet'}
                    {connector.id === 'walletConnect' && 'Connect with WalletConnect'}
                    {connector.id === 'injected' && 'Connect to your browser wallet'}
                  </p>
                </div>
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {connectionError && (
          <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {connectionError}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 text-center text-sm text-gray-500">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[600px] mx-auto px-8 pt-16 pb-24">
      <h1 className="text-[32px] font-bold mb-3">Register</h1>
      <p className="text-[#6B7280] text-lg mb-10">
        Follow the steps below to register as a member of the DAO voting group.
      </p>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex items-center justify-between p-5 border border-[#E5E7EB] rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-black">
                {step.icon}
              </div>
              <span className="text-[15px] text-[#111827] font-medium">
                {step.title}
              </span>
            </div>

            {index === 0 ? (
              isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#059669] bg-[#ECFDF5] px-4 py-1.5 rounded-full font-medium">
                    Complete
                  </span>
                  <button
                    onClick={() => disconnect()}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="px-6 py-3 bg-[#2563EB] text-white text-base font-medium rounded-xl hover:bg-[#1D4ED8] transition-colors"
                >
                  Connect
                </button>
              )
            ) : (
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${step.status === 'complete'
                  ? 'bg-[#ECFDF5] text-[#059669]'
                  : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}>
                {step.status === 'complete' ? 'Complete' : 'Incomplete'}
              </span>
            )}

            {index === 1 && balanceError && (
              <div className="mt-2 text-sm text-red-600">
                {balanceError}
              </div>
            )}
          </div>
        ))}
      </div>

      {showWalletModal && <WalletModal />}
    </div>
  );
};

export default Register;