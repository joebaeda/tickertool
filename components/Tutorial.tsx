interface TutorialProps {
    currencySymbol: string;
    networkName: string;
}

const Tutorial: React.FC<TutorialProps> = ({currencySymbol, networkName}) => {
    return (
        <div className="overflow-y-auto max-h-80 p-4 shadow-lg max-w-lg w-full rounded-2xl border text-gray-500 bg-gray-100 border-gray-200 font-mono custom-scroll">
            <p className="my-6">Follow these steps to understand how to deploy and launch your own ERC20 token using Ticker Tool on {networkName} Network.</p>

            <ul className="mb-6 list-decimal pl-8">
                <li>
                    <h2 className="text-lg font-semibold mb-4">Token Name and Symbol</h2>
                    <p className="mb-6">Fill in the form with the token name and token symbol that you want to create.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Initializing Liquidity</h2>
                    <p className="mb-6">After deploying the contract, initialize the liquidity pool with {currencySymbol} and tokens. The minimum amount of {currencySymbol} that can be used as liquidity is 1 {currencySymbol} and the amount of tokens must be reasonable and the initialization of the liquidity pool can only be done once after which the tokens can be traded immediately.</p>
                </li>
                <li>
                    <h2 className="text-lg font-semibold mb-4">Add Token to Ticker Swap</h2>
                    <p className="mb-6">Once the token has been launched, we will provide a free browser-based interface that you can use to trade the token to the public and of course this uses your own domain.</p>
                </li>
            </ul>

            <p>Ticker Tool offers a powerful and user-friendly platform for creating and trading ERC-20 tokens with a built-in AMM. By integrating trading capabilities directly into the token contract, Ticker Tool provides a fully decentralized and self-sustaining environment for token management. With robust security features and a sustainable fee collection mechanism, Ticker Tool is positioned to play a significant role in the DeFi ecosystem.</p>

        </div>
    )
}

export default Tutorial;