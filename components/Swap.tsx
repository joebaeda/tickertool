import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    buy,
    sell,
    tokenNames,
    tokenSymbols,
    totalTokenSupply,
    tokenPriceInETH,
    ethPriceInToken,
    tokenBalance,
    creatorFee,
    tokenLogo
} from '@/lib/Token';
import Toast from './Toast';
import Image from 'next/image';

interface SwapProps {
    tokenAddress: string;
    signer?: ethers.Signer | null;
    addressConnected: string;
    addressBalances: string;
    currencySymbol: string;
}

const Swap: React.FC<SwapProps> = ({ tokenAddress, signer, addressConnected, addressBalances, currencySymbol }) => {
    const [amount, setAmount] = useState<string>('');
    const [swapType, setSwapType] = useState<'buy' | 'sell'>('buy');
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [tokenImage, setTokenImage] = useState<string>('');
    const [totalSupply, setTotalSupply] = useState<string>('');
    const [ethPrice, setEthPrice] = useState<string | null>(null);
    const [tokenPrice, setTokenPrice] = useState<string | null>(null);
    const [creatorGotFee, setCreatorGotFee] = useState<string>('');
    const [feeOnEth, setFeeOnEth] = useState<string | null>(null);
    const [feeOnToken, setFeeOnToken] = useState<string | null>(null);
    const [ethMinAmountOut, setETHMinAmountOut] = useState<string | null>(null);
    const [tokenMinAmountOut, setTokenMinAmountOut] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [tokenBalances, setTokenBalance] = useState<string>('');

    useEffect(() => {
        const fetchTokenData = async () => {
            if (tokenAddress) {
                try {
                    const name = await tokenNames(tokenAddress);
                    const symbol = await tokenSymbols(tokenAddress);
                    const supplyInWei = await totalTokenSupply(tokenAddress);
                    const supply = ethers.formatEther(supplyInWei);
                    const tokenOwnedWei = await tokenBalance(tokenAddress, addressConnected);
                    const tokenOwned = ethers.formatEther(tokenOwnedWei);
                    setTokenName(name);
                    setTokenSymbol(symbol);
                    setTotalSupply(supply);
                    setTokenBalance(tokenOwned);

                    const priceInETH = await tokenPriceInETH(tokenAddress);
                    const priceInToken = await ethPriceInToken(tokenAddress);
                    const feeForCreator = await creatorFee(tokenAddress);
                    const ipfsUrl = await tokenLogo(tokenAddress);
                    const gatewayUrl = ipfsUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
                    setTokenImage(gatewayUrl)
                    setCreatorGotFee(String(feeForCreator));

                    setEthPrice(ethers.formatEther(priceInETH));
                    setTokenPrice(ethers.formatEther(priceInToken));

                } catch (err) {
                    console.error('Failed to fetch token data:', err);
                }
            }
        };

        fetchTokenData();
    }, [tokenAddress, addressConnected]);

    useEffect(() => {
        const estimateAmountOut = async () => {
            if (!amount || !ethPrice || !tokenPrice) return;

            try {
                // Convert amounts to Number for precise calculations
                const ethAmount = Number(amount);
                const tokenAmount = Number(amount);
                const priceInEth = Number(ethPrice);
                const priceInToken = Number(tokenPrice);

                const feeForCreator = await creatorFee(tokenAddress);

                if (swapType === 'buy') {
                    // Calculate tokens out for the given ETH amount
                    const tokensOut = ethAmount / priceInEth;
                    const tokensMinOut = tokensOut * 85 / 100; // Apply slippage
                    const feeEth = ethAmount * Number(feeForCreator) / 100; // Aplly fee for creator

                    // Convert to readable format
                    setTokenMinAmountOut(String(tokensMinOut));
                    setFeeOnEth(String(feeEth));
                } else if (swapType === 'sell') {
                    // Calculate ETH out for the given token amount
                    const ethOut = tokenAmount / priceInToken;
                    const ethMinOut = ethOut * 85 / 100; // Apply slippage
                    const feeToken = tokenAmount * Number(feeForCreator) / 100 // Apply fee for creator

                    // Convert to readable format
                    setETHMinAmountOut(String(ethMinOut));
                    setFeeOnToken(String(feeToken));
                }
            } catch (err) {
                console.error('Failed to estimate amount out:', err);
            }
        };

        estimateAmountOut();
    }, [amount, swapType, ethPrice, tokenPrice, tokenAddress]);

    const handleSwap = async () => {
        if (!signer || !tokenAddress) return;

        const ethAmount = ethers.parseEther(amount);
        const tokenAmount = ethers.parseUnits(amount, 18);
        setLoading(true);

        try {
            if (swapType === 'buy') {
                // Calculate 5% of the total supply
                const tenPercentOfSupply = Number(totalSupply) * 5 / 100;

                // Calculate price in ETH for 5% token supply
                const maxETHAmount = tenPercentOfSupply / Number(tokenPrice as string);
                const ethMaxBuy = maxETHAmount * 75 / 100;

                // Check if the purchase exceeds 5% of the total supply
                if (ethAmount > ethers.parseEther(String(ethMaxBuy))) {
                    setToast({
                        message: `The purchase amount exceeds 5% of the total supply. You can buy up to ${parseFloat(ethMaxBuy.toString()).toFixed(5)} ${currencySymbol}.`,
                        type: 'error',
                    });
                    setLoading(false);
                    return;
                }

                await buy(tokenAddress, ethers.parseUnits(tokenMinAmountOut as string, 18), ethAmount, signer);
            } else if (swapType === 'sell') {
                await sell(tokenAddress, tokenAmount, ethers.parseEther(String(parseFloat(ethMinAmountOut as string).toFixed(4))), signer);
            }

            // Show success toast
            setToast({ message: 'Swap successful!', type: 'success' });

            // Wait for 3 seconds before reloading
            setTimeout(() => {
                setLoading(false);
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error('Swap failed:', error);

            // Show error toast
            setToast({ message: 'Swap failed. Please try again.', type: 'error' });

            // Stop loading after showing the error
            setLoading(false);

            // Optionally wait before removing the toast
            setTimeout(() => {
                setToast(null);
            }, 3000);
        }
    };


    return (

        <div className="flex p-4 text-gray-500 flex-col gap-5 sm:flex-row bg-gray-100 rounded-2xl items-center justify-center font-mono">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}


            {/* Token logo */}
            <div className="w-full sm:p-4">
                {tokenImage ? (
                    <div className="w-full overflow-hidden rounded-2xl">
                        <Image
                            src={tokenImage}
                            alt={tokenName}
                            width={450}
                            height={450}
                            priority={true}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full overflow-hidden rounded-2xl">
                        <Image
                            src="/poop.webp"
                            alt={tokenName}
                            width={450}
                            height={450}
                            priority={true}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Swap Form */}
            <div className="w-full sm:p-4 text-gray-500">
                <div className="space-y-4">
                    {/* Input 1: Swap from */}
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <label htmlFor="fromAmount" className="text-sm font-medium">
                                {swapType === 'buy' ? `${currencySymbol}` : `${tokenSymbol}`}
                            </label>
                            {/* Make the balance clickable to set the max amount */}
                            <span
                                className="text-sm font-medium text-right cursor-pointer"
                                onClick={() => setAmount(swapType === 'buy' ? addressBalances : tokenBalances)}
                            >
                                Balance: {swapType === 'buy' ? `${addressBalances.slice(0, 8)}` : `${tokenBalances.slice(0, 8)}`}
                            </span>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                type="text"
                                value={amount}
                                id="fromAmount"
                                name="fromAmount"
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                disabled={loading}
                                className="w-full p-3 bg-transparent text-lg focus:outline-none"
                            />
                            <button onClick={() => setAmount(swapType === 'buy' ? addressBalances : tokenBalances)} className="ml-2 px-3 py-1 bg-gray-100 rounded-lg font-semibold">
                                MAX
                            </button>
                        </div>
                    </div>
                </div>


                {/* Switch Button */}
                <div className="flex justify-center items-center -my-4">
                    <button
                        onClick={() => setSwapType(swapType === 'buy' ? 'sell' : 'buy')}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-300 transition"
                        disabled={loading}
                    >
                        <svg width="32" height="32" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M0 0h16v16H0z" />
                            <path d="M5 16V4.8L2.4 7.4 1 6l6-6v16zm6-4.8 2.6-2.6L15 10l-6 6V0h2z" />
                        </svg>
                    </button>
                </div>

                {/* Input 2: Swap to */}
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                        <label htmlFor="toAmount" className="text-sm font-medium">
                            {swapType === 'buy' ? `${tokenSymbol}` : `${currencySymbol}`}
                        </label>
                        <span className="text-sm font-medium text-right">Balance: {swapType === 'buy' ? `${tokenBalances.slice(0, 8)}` : `${addressBalances.slice(0, 8)}`}</span>
                    </div>
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            value={swapType === 'buy' ? `${tokenMinAmountOut || '0'}` : `${ethMinAmountOut || '0'}`}
                            id="toAmount"
                            name="toAmount"
                            placeholder="0"
                            disabled
                            className="w-full p-3 bg-transparent text-lg focus:outline-none"
                        />
                        <button onClick={() => setAmount(swapType === 'buy' ? addressBalances : tokenBalances)} className="ml-2 px-3 py-1 bg-gray-100 rounded-lg font-semibold">
                            MAX
                        </button>
                    </div>
                </div>

                {/* Price Information */}
                <div className="text-center text-sm text-gray-500 my-4">
                    <span>
                        Price: {swapType === 'buy'
                            ? `1 ${currencySymbol} = ${tokenPrice?.slice(0, 8)} ${tokenSymbol}`
                            : `1 ${tokenSymbol} = ${ethPrice?.slice(0, 8)} ${currencySymbol}`}
                    </span>
                </div>

                {/* Swap Button */}
                <button
                    onClick={handleSwap}
                    className={`w-full p-3 rounded-lg ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : swapType === 'buy' ? `Buy ${tokenName}` : `Sell ${tokenName}`}
                </button>

                {swapType === 'buy' ? (
                    <>
                        <p className="py-3">Fee &#40;{creatorGotFee}%&#41;: <span className="float-right">{feeOnEth ? feeOnEth.slice(0, 8) : '0'} {currencySymbol}</span></p>
                        <p>{tokenSymbol} Received &#40;Est&#41;: <span className="float-right">{tokenMinAmountOut ? tokenMinAmountOut.slice(0, 8) : '0'} {tokenSymbol}</span></p>
                    </>
                ) : (
                    <>
                        <p className="py-3">Fee &#40;{creatorGotFee}%&#41;: <span className="float-right">{feeOnToken ? feeOnToken.slice(0, 8) : '0'} {tokenSymbol}</span></p>
                        <p>{currencySymbol} Received &#40;Est&#41;: <span className="float-right">{ethMinAmountOut ? ethMinAmountOut.slice(0, 8) : '0'} {currencySymbol}</span></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Swap;
