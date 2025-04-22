# Laborcoin DAO

A decentralized autonomous organization (DAO) built on the Polygon network with token-based governance.

## Overview

Laborcoin DAO is a decentralized governance system that allows token holders to participate in decision-making processes. The system includes:

- LABR Token: The main governance token
- LABRV Token: A voting token used for DAO proposals
- Group-based membership system
- Token-based voting mechanisms

## Features

- **Token-based Governance**: Holders of LABR tokens can participate in DAO governance
- **Group Management**: Create and manage different groups within the DAO
- **Voting System**: Propose and vote on changes to the DAO
- **Token Distribution**: Mint and distribute LABRV tokens for voting power

## Technical Architecture

The project consists of:

- Smart contracts deployed on the Polygon network
- Backend API server (Node.js)
- Web3 integration for blockchain interactions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Web3 wallet (MetaMask recommended)
- Access to a Polygon RPC endpoint

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/laborcoin-dao.git
   cd laborcoin-dao
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   WEB3_PROVIDER_URL=https://polygon-rpc.com
   LABR_TOKEN_ADDRESS=0x...
   DAO_ADDRESS=0x...
   ADMIN_PRIVATE_KEY=your_private_key
   LABRV_TOKEN_ADDRESS=0x...
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the server:
   ```
   npm start
   ```

## Smart Contracts

The project includes the following smart contracts:

- **LABR Token**: The main governance token
- **DAO Contract**: Manages group membership and voting
- **LABRV Token**: Used for voting on proposals

## API Endpoints

The backend provides various endpoints for interacting with the DAO:

- User authentication and token balance checking
- Group management (adding/removing members)
- Proposal creation and voting
- Token distribution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or support, please open an issue in the GitHub repository.
