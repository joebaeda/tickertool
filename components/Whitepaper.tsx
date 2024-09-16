export default function Whitepaper() {
    return (

        <div className="p-4 w-full rounded-2xl text-gray-500 bg-gray-100 font-mono">
            <p className="my-6">Ticker Tool is an ERC-20 token creation platform that empowers users to mint their own tokens and trade them using a built-in Automated Market Maker &#40;AMM&#41;. This system bypasses the need for external decentralized exchanges &#40;DEXs&#41; like Uniswap, providing a fully decentralized, self-contained solution for token management and trading. The platform integrates directly with any EVM based chain, offering customizable token creation, seamless liquidity management, and a robust fee collection mechanism.</p>

            <h1 className="text-xl font-semibold mb-4">Introduction</h1>
            <p className="mb-6">Decentralized finance &#40;DeFi&#41; has revolutionized the financial landscape by enabling trustless and permissionless interactions. Ticker Tool builds on this ethos by offering a platform where anyone can create, manage, and trade ERC-20 tokens with a built-in AMM. This approach eliminates reliance on external DEXs and ensures that liquidity and trading are intrinsic to the token itself.</p>

            <h1 className="text-xl font-bold my-8">Key Features</h1>
            <ul className="mb-6 list-decimal pl-8">
                <li>
                    <h2 className="text-lg font-semibold mb-4">Customizable Token Creation</h2>
                    <p className="mb-6">Users can create ERC-20 tokens with customizable names and symbols directly through a user-friendly browser-based interface. This simplifies the process of launching a new token on the any EVM based chain.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Built-In Automated Market Maker &#40;AMM&#41;</h2>
                    <p className="mb-6">Ticker Tool includes a built-in AMM that automatically determines the price of tokens based on the reserves of ETH and the token itself.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Self-Contained Trading Environment</h2>
                    <p className="mb-6">Unlike old erc20 tokens that require listing on external DEXs, tokens created with Ticker Tool are instantly tradable within the contract itself. Users can swap ETH for tokens or vice versa directly through the application, without the need for third-party platforms.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Automatic Fee Collection</h2>
                    <p className="mb-6">As Token creator, you can collects a small fee on each trade. These fees can be converted into ETH and then send 25% to creator address and 75% to Ticker tool for further development or other purposes.</p>
                </li>
            </ul>

            <h1 className="text-xl font-bold my-8">How It Works</h1>
            <ul className="mb-6 list-decimal pl-8">
                <li>
                    <h2 className="text-lg font-semibold mb-4">Token Initialization</h2>
                    <p className="mb-6">Users begin by creating a new token, specifying the token logo, token name, token symbol, token description, creator fee, token supply and token price. This step initializes the token contract and assigns the user as the creator, giving them control over key aspects of the token&#39;s lifecycle.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Trading Mechanism</h2>
                    <p className="mb-6">Ticker Tool AMM uses a constant product formula to determine the exchange rate between ETH and the token. This dynamic pricing model adjusts based on the reserves, ensuring fair and transparent trading.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Fee Collection</h2>
                    <p className="mb-6">A Creator fee is automatically collected on every trade. These fees accumulate within the contract and can be converted into ETH, providing a sustainable revenue stream for ongoing development or other needs and give royalty to creator.</p>
                </li>
            </ul>
            <h1 className="text-xl font-bold my-8">Technical Architecture</h1>
            <ul className="mb-6 list-decimal pl-8">
                <li>
                    <h2 className="text-lg font-semibold mb-4">Smart Contract Design</h2>
                    <ul className="mb-6 list-decimal pl-8">
                        <li><strong>ERC-20 Token:</strong> The contract is built on OpenZeppelin&#39;s standard ERC-20 implementation, ensuring compatibility and security.</li>
                        <li className="my-4"><strong>Automated Market Maker &#40;AMM&#41;:</strong> The built-in AMM simplifies liquidity provision and trading by automating price determination based on reserves.</li>
                        <li><strong>ReentrancyGuard:</strong> Security is enhanced by incorporating OpenZeppelin&#39;s <code>ReentrancyGuard</code> to protect against reentrancy attacks.</li>
                    </ul>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Liquidity Management</h2>
                    <p className="mb-6">The contract tracks ETH and token reserves, providing functions for performing swaps.</p>
                </li>
            </ul>
            <h1 className="text-xl font-bold my-8">Use Cases and Applications</h1>
            <ul className="mb-6 list-decimal pl-8">
                <li>
                    <h2 className="text-lg font-semibold mb-4">Token Launch Platform</h2>
                    <p className="mb-6">Ticker Tool serves as a comprehensive platform for launching new ERC-20 tokens, complete with built-in trading capabilities.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Decentralized Trading</h2>
                    <p className="mb-6">The platform enables decentralized trading without reliance on external DEXs, offering a self-contained environment for token swaps.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Development Funding</h2>
                    <p className="mb-6">The fee collection mechanism provides a built-in funding source for ongoing development, ensuring the project&#39;s long-term viability.</p>
                </li>
            </ul>

            <h1 className="text-xl font-bold mb-4">Security Considerations</h1>
            <p>Ticker Tool prioritizes security through the use of OpenZeppelin&#39;s <code>ReentrancyGuard</code> and careful implementation of smart contract logic. The platform&#39;s design minimizes potential vulnerabilities and provides a secure environment for token creation, liquidity management, and trading.</p>

            <h1 className="text-xl font-bold my-4">Conclusion</h1>
            <p>Ticker Tool offers a powerful and user-friendly platform for creating and trading ERC-20 tokens with a built-in AMM. By integrating trading capabilities directly into the token contract, Ticker Tool provides a fully decentralized and self-sustaining environment for token management. With robust security features and a sustainable fee collection mechanism, Ticker Tool is positioned to play a significant role in the DeFi ecosystem.</p>

        </div>
    )
}