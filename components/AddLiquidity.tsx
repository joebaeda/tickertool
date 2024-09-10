import React, { useState } from 'react';
import { ethers } from 'ethers';
import { addLiquidity } from '@/lib/Token';
import Toast from './Toast';

interface AddLiquidityProps {
    tokenAddress: string;
    signer?: ethers.Signer | null;
    currencySymbol: string;
    blockExplorer: string;
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ tokenAddress, signer, currencySymbol, blockExplorer }) => {
    const [tokenAmount, setTokenAmount] = useState<string>('');
    const [ethAmount, setEthAmount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleAddLiquidity = async () => {
        if (signer && tokenAddress && tokenAmount && ethAmount) {
            setLoading(true);

            try {
                const tx = await addLiquidity(
                    tokenAddress,
                    ethers.parseUnits(tokenAmount, 18),
                    ethers.parseEther(ethAmount),
                    signer
                );
                await tx.wait();

                // Show success toast
                setToast({ message: 'Liquidity added successfully!', type: 'success' });

                // Wait for 3 seconds before reloading
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (err) {
                console.error('Failed to add liquidity:', err);

                // Show error toast
                setToast({ message: 'Failed to add liquidity. Please try again.', type: 'error' });
            } finally {
                setLoading(false);
            }
        } else {
            // Handle case where input is missing or invalid
            setToast({ message: 'Please enter valid amounts.', type: 'error' });
        }
    };

    return (
        <div className="p-4 shadow-lg max-w-lg w-full rounded-2xl border bg-gray-100 border-gray-200 font-mono">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="mb-4">
                <label className="block mb-2 text-gray-500" htmlFor="tokenAmount">
                    Token Amount
                </label>
                <input
                    type="text"
                    id="tokenAmount"
                    name="tokenAmount"
                    value={tokenAmount}
                    disabled={loading}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full focus:outline-none text-gray-500 p-2 border border-gray-300 rounded-xl"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-500" htmlFor="ethAmount">
                    {currencySymbol} Amount
                </label>
                <input
                    type="text"
                    id="ethAmount"
                    name="ethAmount"
                    value={ethAmount}
                    disabled={loading}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full focus:outline-none text-gray-500 p-2 border border-gray-300 rounded-xl"
                />
            </div>
            <button
                onClick={handleAddLiquidity}
                disabled={loading || Number(ethAmount) < 1}
                className={`w-full py-2 rounded-xl ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold`}
            >
                {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
            </button>
            <p className="pt-2 text-center text-xs text-gray-500 font-semibold">Send at least 1 {currencySymbol} for fair liquidity to your own Token contract address: <a href={`${blockExplorer}/address/${tokenAddress.toLowerCase()}`} target="_blank" className="text-green-500">{tokenAddress.toLowerCase()}</a></p>
        </div>
    );
};

export default AddLiquidity;
