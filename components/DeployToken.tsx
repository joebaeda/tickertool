import { useState, useEffect } from 'react';
import { ethers, Signer } from 'ethers';
import { tokenABI } from '@/lib/TokenABI';
import { tokenCode } from '@/lib/TokenCode';
import AddLiquidity from './AddLiquidity';
import { ethReserveAmount, tokenReserveAmount } from '@/lib/Token';
import Swap from './Swap';
import Toast from './Toast';

interface DeployTokenProps {
    signer: Signer | null;
    address: string;
    balance: string;
    networkChainId: number;
    currencySymbol: string;
    blockExplorer: string;
}

const DeployToken: React.FC<DeployTokenProps> = ({ signer, address, balance, networkChainId, currencySymbol, blockExplorer }) => {
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [deploying, setDeploying] = useState<boolean>(false);
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [showAddLiquidityForm, setShowAddLiquidityForm] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem(`deployed_To_${networkChainId}`);

            if (storedData) { // Check if storedData is not null
                try {
                    const { contract } = JSON.parse(storedData);
                    setContractAddress(contract);
                    setToast({ message: 'You have one active Token on this Network', type: 'success' });
                } catch (error) {
                    console.error('Error parsing stored data:', error);
                    // Handle parsing error if necessary
                }
            } else {
                // Handle case when storedData is null
                setToast({ message: 'No deployed contract found for this network.', type: 'error' });
            }
        }
    }, [networkChainId]);

    useEffect(() => {
        const checkReserves = async () => {
            if (contractAddress) {
                const tokenReserve = await tokenReserveAmount(contractAddress);
                const ethReserve = await ethReserveAmount(contractAddress);
                if (tokenReserve === BigInt(0) && ethReserve === BigInt(0)) {
                    setShowAddLiquidityForm(true);
                }
            }
        };

        checkReserves();
    }, [contractAddress]);

    const deployContract = async () => {
        setDeploying(true);

        try {
            const contractFactory = new ethers.ContractFactory(tokenABI, tokenCode, signer);

            const contract = await contractFactory.deploy(tokenName, tokenSymbol);
            await contract.waitForDeployment();

            const deployedAddress = await contract.getAddress();

            const deploymentData = {
                deployer: address,
                contract: deployedAddress,
                network: networkChainId,
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem(`deployed_To_${networkChainId}`, JSON.stringify(deploymentData));
            }

            // Save details to Google Sheets via API route
            await fetch('/api/safeToGoogleSheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deploymentData),
            });

            // Send details via Telegram via API route
            await fetch('/api/sendToTelegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deploymentData),
            });

            // Refresh the page after the transaction is confirmed
            window.location.reload();
        } catch (error) {
            console.error('Contract deployment failed:', error);
        } finally {
            setDeploying(false);
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {contractAddress ? (
                showAddLiquidityForm ? (
                    <AddLiquidity tokenAddress={contractAddress} signer={signer} currencySymbol={currencySymbol} blockExplorer={blockExplorer} />
                ) : (
                    <Swap tokenAddress={contractAddress} signer={signer} addressConnected={address} addressBalances={balance} currencySymbol={currencySymbol} />
                )
            ) : (
                <div className="p-4 shadow-lg max-w-lg w-full rounded-2xl border bg-gray-100 border-gray-200 font-mono">
                    <div className="mt-4">
                        <label className="block mb-2 text-gray-500" htmlFor="tokenName">Token Name:</label>
                        <input
                            type="text"
                            id="tokenName"
                            name="tokenName"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            className="border focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block mb-2 text-gray-500" htmlFor="tokenSymbol">Token Symbol:</label>
                        <input
                            type="text"
                            id="tokenSymbol"
                            name="tokenSymbol"
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value)}
                            className="border focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                        />
                    </div>

                    <button
                        onClick={deployContract}
                        disabled={deploying}
                        className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-xl"
                    >
                        {deploying ? 'Deploying...' : 'Deploy Contract'}
                    </button>
                </div>
            )}
        </>
    );
};

export default DeployToken;
