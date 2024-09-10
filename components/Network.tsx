import Image from "next/image";

interface SelectedNetworkProps {
    name: string;
    chainIdHex: string;
    logo: string;
}

interface NetworkProps {
    networks: SelectedNetworkProps[];
}

const SelectedNetwork: React.FC<SelectedNetworkProps> = ({ name, chainIdHex, logo }) => {
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
            <Image width={30} height={30} src={logo} priority={true} alt={`${name} logo`} className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{name}</h3>
            <button
                onClick={switchNetwork}
                className="text-white md:text-clip bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
            >
                Switch
            </button>
        </div>
    );
};

const Network: React.FC<NetworkProps> = ({ networks }) => {
    return (
        <div className="m-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 z-10">
            {networks.map((network) => (
                <SelectedNetwork key={network.chainIdHex} {...network} />
            ))}
        </div>
    );
};

export default Network;
