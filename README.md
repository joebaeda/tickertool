# Ticker Token Deployment Interface - Create ERC20 Tokens with built-in AMM

This repository contains a Next.js application that provides an interface for deploying and interacting with the `Ticker Token` smart contract, a custom ERC-20 token with a built-in Automated Market Maker (AMM).

## Features

- **Deploy the Ticker Token Contract**: Easily deploy your own instance of the `Ticker Token` contract.
- **Interact with the Contract**: Swap ETH for tokens and tokens for ETH, and add liquidity directly from the UI.
- **Next.js & Ethers.js Integration**: Leverage the power of Next.js for SSR and the simplicity of Ethers.js for interacting with Ethereum.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v20.x or later)
- **npm** or **yarn**
- **MetaMask** or any other Ethereum wallet extension installed in your browser.

## Getting Started

To get a local copy up and running, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/joebaeda/tickertool.git
cd tickertool
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```plaintext
GOOGLE_SHEET_ID=your-google-sheet-ID
GOOGLE_PRIVATE_KEY=your-google-cloud-console-private-key
GOOGLE_CLIENT_EMAIL=your-google-console-client-email
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NEXT_PUBLIC_TELEGRAM_CHAT_ID=your-telegram-chat-id
NEXT_PUBLIC_PINATA_GATEAWAY=your-pinata-gateway
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-key
PINATA_JWT=your-pinata-jwt
```

Replace all value with your own. If you've already deployed the `Ticker Token` contract using this interface, please create your own [Ticker Swap interface](https://github.com/joebaeda/tickerswap), so other user can buy/sell your token.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 5. Deploy the Contract (Optional)

If you haven't deployed the `Ticker Token` contract yet, you can do so directly from the app. Follow the instructions on the app, and once the contract is deployed, interact with it through the interface.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE.txt) file for details.

## Contact

[Joe bae](https://t.me/joebaeda) on Telegram

[Joe bae](https://x.com/joebaeda) on X Platform