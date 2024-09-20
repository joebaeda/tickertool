import Image from "next/image";

interface SelectedNetworkProps {
    networkName: string;
    chainIdHex: string;
    networkLogo: string;
}

interface NetworkProps {
    networks: SelectedNetworkProps[];
}

const SelectedNetwork: React.FC<SelectedNetworkProps> = ({ networkName, chainIdHex, networkLogo }) => {
    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainIdHex }],
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to switch network:', error);
            // Optional: add more error handling here
        }
    };

    return (
        <div className="p-4 border flex flex-col justify-center items-center text-gray-500 bg-gray-200 rounded-lg shadow-md">
            <Image width={30} height={30} src={networkLogo} priority={true} alt={`${networkName} logo`} className="w-16 h-16 mb-4" />
            <h3 className="text-lg text-center font-semibold mb-2">{networkName}</h3>
            <button
                onClick={switchNetwork}
                className="w-full text-white md:text-clip bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-xl"
            >
                Switch
            </button>
        </div>
    );
};

const Network: React.FC<NetworkProps> = ({ networks }) => {
    return (
        <div className="fixed inset-0 top-[21%] overflow-y-auto custom-scroll bg-gray-50 rounded-t-2xl font-mono">
        <div className="m-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 z-10">
            {networks.map((network) => (
                <SelectedNetwork key={network.chainIdHex} {...network} />
            ))}
        </div>
        </div>
    );
};

export default Network;
