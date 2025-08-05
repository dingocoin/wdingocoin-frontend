# wDingocoin Bridge v2

A modern, decentralized bridge for wrapping and unwrapping Dingocoin across multiple blockchains.

## Features

- **Modern Web3 Integration**: Built with Wagmi v2 and RainbowKit for seamless wallet connections
- **Multi-Chain Support**: Support for Binance Smart Chain (BSC) and Polygon networks
- **Real-time Updates**: Live bridge statistics and transaction status
- **Consensus-based Security**: Multi-authority node system for secure operations
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Bridge Flow

### Wrap Process (Dingocoin → wDingocoin)
1. User connects wallet and selects network
2. Creates a deposit address on the Dingocoin network
3. Sends Dingocoins to the generated deposit address
4. Authority nodes monitor deposits and create mint transactions
5. User approves mint transaction to receive wDingocoins
6. Fees: 10 Dingocoins + 1% of deposited amount

### Unwrap Process (wDingocoin → Dingocoin)
1. User burns wDingocoins via smart contract
2. Specifies Dingocoin destination address
3. Authority nodes process withdrawal requests
4. Dingocoins are sent to the specified address
5. Fees: 10 Dingocoins + 1% of burned amount

## Technology Stack

- **React 18** with TypeScript
- **Wagmi v2** for Ethereum interactions
- **RainbowKit** for wallet connections
- **Tailwind CSS** for styling
- **Viem** for blockchain interactions
- **React Query** for data fetching
- **Framer Motion** for animations

## Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn or npm

### Installation

1. Install dependencies:
```bash
cd v2
yarn install
```

2. Configure environment variables:
Create a `.env` file in the v2 directory:
```env
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

3. Start the development server:
```bash
yarn start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
yarn build
```

## Project Structure

```
v2/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx      # Navigation and wallet connection
│   │   ├── NetworkSelector.tsx
│   │   ├── BridgeCard.tsx  # Wrap/unwrap interface
│   │   └── StatsCard.tsx   # Bridge statistics
│   ├── config/             # Configuration files
│   │   ├── networks.ts     # Network configurations
│   │   └── wagmi.ts        # Wagmi configuration
│   ├── hooks/              # Custom React hooks
│   │   └── useBridge.ts    # Bridge logic and state management
│   ├── types/              # TypeScript type definitions
│   │   └── bridge.ts       # Bridge-related types
│   ├── utils/              # Utility functions
│   │   └── bridge.ts       # Bridge utility functions
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Network Configuration

The bridge supports multiple networks with different configurations:

### Binance Smart Chain (BSC)
- Chain ID: 56
- Contract: `0x9b208b117B2C4F76C1534B6f006b033220a681A4`
- Authority Nodes: 5 nodes with consensus threshold of 3

### Polygon
- Chain ID: 137
- Contract: `0x033babac01c4e3915cf71d24b6bfb58e606fdb80`
- Authority Nodes: 5 nodes with consensus threshold of 3

## Security Features

- **Multi-Authority Consensus**: Requires 3 out of 5 authority nodes to agree
- **Address Validation**: Validates Dingocoin addresses using checksum verification
- **Transaction Verification**: All transactions are verified before execution
- **Error Handling**: Comprehensive error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please visit the [Dingocoin website](https://dingocoin.com) or contact the development team. 