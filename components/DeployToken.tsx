import { useState, useEffect, ChangeEvent, DragEvent } from 'react';
import { ethers } from 'ethers';
import Swap from './Swap';
import Toast from './Toast';
import { deployTickerContract } from '@/lib/Token';
import { Signer } from 'ethers';
import Image from 'next/image';

interface DeployTokenProps {
    signer: ethers.Signer | null;
    address: string;
    balance: string;
    networkChainId: number;
    networkChainHex: string;
    networkChainName: string;
    networkChainLogoUrls: string;
    networkChainRPCUrls: string;
    networkChainExplorerUrls: string;
    networkChainCurrencySymbol: string;
}

const DeployToken: React.FC<DeployTokenProps> = ({ signer, address, balance, networkChainId, networkChainHex, networkChainName, networkChainLogoUrls, networkChainRPCUrls, networkChainExplorerUrls, networkChainCurrencySymbol }) => {
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [tokenDesc, setTokenDesc] = useState<string>('');
    const [creatorFee, setCreatorFee] = useState<string>('');
    const [tokenSupply, setTokenSupply] = useState<string>('');
    const [tokenPrice, setTokenPrice] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [ipfsHash, setIpfsHash] = useState<string>('');
    const [deploying, setDeploying] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile); // Set the file in state
            await uploadFile(selectedFile); // Automatically trigger file upload
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile); // Set the file in state
            await uploadFile(droppedFile); // Automatically trigger file upload
        }
    };

    const handleClick = () => {
        // Trigger the hidden file input when the area is clicked
        document.getElementById('fileInput')?.click();
    };

    // Upload function to handle the file upload logic
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true); // Set uploading state to true

        try {
            const response = await fetch('/api/uploadToIPFS', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setIpfsHash(data.ipfsHash); // Set the IPFS hash on success
                setToast({ message: 'File uploaded successfully', type: 'success' });
            } else {
                setToast({ message: 'Something went wrong', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error uploading file', type: 'error' });
        } finally {
            setUploading(false); // Set uploading state to false
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem(`deployed_To_${networkChainId}`);

            if (storedData) { // Check if storedData is not null
                try {
                    const { tokenAddress } = JSON.parse(storedData);
                    setContractAddress(tokenAddress);
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

    const deployContract = async () => {
        setDeploying(true);

        try {
            const ethReserve = Number(tokenPrice) * Number(tokenSupply);

            const deployedAddress = await deployTickerContract(tokenName, tokenSymbol, `ipfs://${ipfsHash}`, tokenDesc, creatorFee, ethers.parseEther(String(ethReserve)), ethers.parseUnits(tokenSupply, 18), signer as Signer);

            const deploymentSheetData = {
                tokenAddress: deployedAddress,
                tokenName: tokenName,
                tokenSymbol: tokenSymbol,
                tokenDescription: tokenDesc,
                tokenLogoUrls: `ipfs://${ipfsHash}`,
                tokenChainName: networkChainName,
                tokenChainId: networkChainId,
                tokenChainHex: networkChainHex,
                tokenChainLogoUrls: networkChainLogoUrls,
                tokenChainCurrency: networkChainCurrencySymbol,
                tokenChainRPCUrls: networkChainRPCUrls,
                tokenChainExplorerUrls: networkChainExplorerUrls,
                deployer: address,
            };

            const deploymentTGData = {
                tokenAddress: deployedAddress,
                tokenChainId: networkChainId,
                deployer: address,
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem(`deployed_To_${networkChainId}`, JSON.stringify(deploymentSheetData));
            }

            // Save details to Google Sheets via API route
            await fetch('/api/safeToGoogleSheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deploymentSheetData),
            });

            // Send details via Telegram via API route
            await fetch('/api/sendToTelegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deploymentTGData),
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
        <div className="w-full">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {contractAddress ? (
                <Swap tokenAddress={contractAddress} signer={signer} addressConnected={address} addressBalances={balance} currencySymbol={networkChainCurrencySymbol} />
            ) : (
                <div className="flex p-4 flex-col gap-5 sm:flex-row bg-gray-100 rounded-2xl items-center justify-center font-mono">

                    {/* Upload token Logo */}
                    <div className="w-full p-4 flex flex-col text-gray-500">
                        {ipfsHash ? (
                            <div className="w-full overflow-hidden rounded-2xl">
                                <Image
                                    src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                                    alt={tokenName}
                                    width={500}
                                    height={500}
                                    priority={true}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <form className="w-full">
                                {/* Drag and Drop area */}
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${dragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleClick}
                                >
                                    {file ? (
                                        <p className="text-center">{file.name}</p>
                                    ) : (
                                        <p className="text-center">
                                            Drag & drop your your token logo here, or <span className="text-blue-500 underline">click to select</span>
                                        </p>
                                    )}
                                </div>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                {/* Upload logo */}
                                {uploading && (
                                    <p className="text-center mt-4 text-gray-500">Uploading logo...</p>
                                )}
                            </form>
                        )}
                    </div>

                    {/* Initialize Token */}
                    <div className="w-full p-4 bg-gray-50 rounded-2xl">
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <label className="block mb-2 text-gray-500" htmlFor="tokenName">Token Name:</label>
                                <input
                                    type="text"
                                    id="tokenName"
                                    name="tokenName"
                                    placeholder="E.g, Pepe Token"
                                    value={tokenName}
                                    onChange={(e) => setTokenName(e.target.value)}
                                    className="border placeholder:opacity-25 focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                                />
                            </div>
                            <div className="w-full">
                                <label className="block mb-2 text-gray-500" htmlFor="tokenSymbol">Token Symbol:</label>
                                <input
                                    type="text"
                                    id="tokenSymbol"
                                    name="tokenSymbol"
                                    placeholder="E.g, PEPE"
                                    value={tokenSymbol}
                                    onChange={(e) => setTokenSymbol(e.target.value)}
                                    className="border placeholder:opacity-25 focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="w-full mt-2">
                            <label className="block mb-2 text-gray-500" htmlFor="tokenDesc">Description:</label>
                            <textarea
                                id="tokenDesc"
                                name="tokenDesc"
                                placeholder="E.g, Pepe token is awesome token with great team and tokenomic..."
                                value={tokenDesc}
                                onChange={(e) => setTokenDesc(e.target.value)}
                                className="border placeholder:opacity-25 focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                            />
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <label className="block mb-2 text-gray-500" htmlFor="creatorFee">Creator Fee:</label>
                                <input
                                    type="text"
                                    id="creatorFee"
                                    name="creatorFee"
                                    placeholder="E.g, 5 (for 5%)"
                                    value={creatorFee}
                                    onChange={(e) => setCreatorFee(e.target.value)}
                                    className="border placeholder:opacity-25 focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                                />
                            </div>
                            <div className="w-full">
                                <label className="block mb-2 text-gray-500" htmlFor="tokenSupply">Total Supply:</label>
                                <input
                                    type="text"
                                    id="tokenSupply"
                                    name="tokenSupply"
                                    placeholder="E.g, 1000000"
                                    value={tokenSupply}
                                    onChange={(e) => setTokenSupply(e.target.value)}
                                    className="border placeholder:opacity-25 focus:outline-none p-2 w-full text-gray-500 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="block mb-2 text-gray-500" htmlFor="tokenPrice">Token Price:</label>
                            <input
                                type="text"
                                id="tokenPrice"
                                name="tokenPrice"
                                placeholder={`E.g, 0.0001 (price in ${networkChainCurrencySymbol})`}
                                value={tokenPrice}
                                onChange={(e) => setTokenPrice(e.target.value)}
                                className="border placeholder:opacity-25 focus:outline-none p-2 w-full text-gray-500 rounded-xl"
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

                </div>
            )}
        </div>
    );
};

export default DeployToken;
