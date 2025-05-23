import 'dotenv/config';
import { Web3 } from 'web3';

interface Web3Config {
    providerUrl: string;
    labrTokenAddress?: string;
    daoAddress?: string;
    adminPrivateKey?: string;
    minimumLabrBalance: string;
    labrvTokenAddress?: string;
}

interface CorsConfig {
    origin: string;
    credentials: boolean;
}

interface Config {
    port: number;
    web3: Web3Config;
    cors: CorsConfig;
}

interface ContractABI {
    constant: boolean;
    inputs: Array<{
        name: string;
        type: string;
    }>;
    name: string;
    outputs: Array<{
        name: string;
        type: string;
    }>;
    type: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 5000,
    web3: {
        providerUrl: process.env.WEB3_PROVIDER_URL || 'https://polygon-rpc.com',
        labrTokenAddress: process.env.LABR_TOKEN_ADDRESS,
        daoAddress: process.env.DAO_ADDRESS,
        adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
        minimumLabrBalance: '1',
        labrvTokenAddress: process.env.LABRV_TOKEN_ADDRESS,
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
    }
};

// LABR Token ABI
const LABR_TOKEN_ABI: ContractABI[] = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    }
];

// DAO Contract ABI
const DAO_ABI: ContractABI[] = [
    {
        "constant": false,
        "inputs": [
            {"name": "groupName", "type": "string"},
            {"name": "member", "type": "address"}
        ],
        "name": "addMemberToGroup",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {"name": "groupName", "type": "string"},
            {"name": "member", "type": "address"}
        ],
        "name": "isMemberOfGroup",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    }
];

// LABRV Token ABI
const LABRV_TOKEN_ABI: ContractABI[] = [
    {
        "constant": false,
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "mint",
        "outputs": [],
        "type": "function"
    }
];

// Initialize Web3
const web3 = new Web3(config.web3.providerUrl);

export {
    config,
    web3,
    LABR_TOKEN_ABI,
    DAO_ABI,
    LABRV_TOKEN_ABI
}; 