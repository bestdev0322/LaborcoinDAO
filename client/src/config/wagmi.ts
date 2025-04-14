import { Config, createConfig, http } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';

if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('Missing WALLET_CONNECT_PROJECT_ID');
}

// Set up wagmi config
export const config: Config = createConfig({
  chains: [polygon, polygonMumbai],
  transports: {
    [polygon.id]: http(),  // Will use the default Polygon RPC
    [polygonMumbai.id]: http(), // Will use the default Mumbai RPC
  },
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'Laborcoin DAO',
      chainId: polygon.id,
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    })
  ],
});