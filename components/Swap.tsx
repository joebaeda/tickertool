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
    tokenReserveAmount,
    ethReserveAmount,
    tokenBalance
} from '@/lib/Token';
import Toast from './Toast';

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
    const [totalSupply, setTotalSupply] = useState<string>('');
    const [ethPrice, setEthPrice] = useState<string | null>(null);
    const [tokenPrice, setTokenPrice] = useState<string | null>(null);
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
                    const tokenFixedOwn = Number(tokenOwned) * 99 / 100;
                    setTokenName(name);
                    setTokenSymbol(symbol);
                    setTotalSupply(supply);
                    setTokenBalance(String(tokenFixedOwn));

                    const reserveToken = await tokenReserveAmount(tokenAddress);
                    const reserveETH = await ethReserveAmount(tokenAddress);

                    if (reserveToken === BigInt(0) && reserveETH === BigInt(0)) {
                        setEthPrice("0");
                        setTokenPrice("0");
                    } else {
                        const priceInETH = await tokenPriceInETH(tokenAddress);
                        const priceInToken = await ethPriceInToken(tokenAddress);
                        setEthPrice(ethers.formatEther(priceInETH));
                        setTokenPrice(ethers.formatEther(priceInToken));
                    }
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

                if (swapType === 'buy') {
                    // Calculate tokens out for the given ETH amount
                    const tokensOut = ethAmount / priceInEth;
                    const tokensMinOut = tokensOut * 95 / 100; // Apply slippage
                    const feeEth = ethAmount * 0.3 / 100; // Aplly fee for development

                    // Convert to readable format
                    setTokenMinAmountOut(String(tokensMinOut));
                    setFeeOnEth(String(feeEth));
                } else if (swapType === 'sell') {
                    // Calculate ETH out for the given token amount
                    const ethOut = tokenAmount / priceInToken;
                    const ethMinOut = ethOut * 85 / 100; // Apply slippage
                    const feeToken = tokenAmount * 0.3 / 100 // Apply fee for development

                    // Convert to readable format
                    setETHMinAmountOut(String(ethMinOut));
                    setFeeOnToken(String(feeToken));
                }
            } catch (err) {
                console.error('Failed to estimate amount out:', err);
            }
        };

        estimateAmountOut();
    }, [amount, swapType, ethPrice, tokenPrice]);

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

        <div className="p-4 shadow-lg max-w-lg w-full rounded-2xl border bg-gray-100 border-gray-200 font-mono">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Swap Form */}
            <div className="text-gray-700">
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium mb-2">
                        {swapType === 'buy' ? `${currencySymbol} Amount` : `${tokenSymbol} Amount`}
                    </label>
                    <input
                        type="text"
                        value={amount}
                        id="amount"
                        name="amount"
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        disabled={loading}
                        className="w-full focus:outline-none p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-5 flex justify-between items-center text-sm">
                    <span>Price {swapType === 'buy' ? `1 ${currencySymbol} = ${parseFloat(tokenPrice as string).toFixed(0) || '0'} ${tokenSymbol}` : `1 ${tokenSymbol} = ${parseFloat(ethPrice as string).toFixed(7) || '0'} ${currencySymbol}`}</span>
                    <button
                        onClick={() => setSwapType(swapType === 'buy' ? 'sell' : 'buy')}
                        className="text-blue-500 hover:text-blue-700"
                        disabled={loading}
                    >
                        {swapType === 'buy' ? 'Switch to Sell' : 'Switch to Buy'}
                    </button>
                </div>

                <button
                    onClick={handleSwap}
                    className={`w-full p-3 rounded-lg ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold mb-3`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : swapType === 'buy' ? `Buy ${tokenName}` : `Sell ${tokenName}`}
                </button>

                {swapType === 'buy' ? (
                    <>
                        <p className="py-2">Your Balance: <span className="float-right">{parseFloat(addressBalances).toFixed(5)} {currencySymbol}</span></p>
                        <p className="pb-2">Fee (0.3%): <span className="float-right">{feeOnEth ? parseFloat(feeOnEth).toFixed(5) : '0'} {currencySymbol}</span></p>
                        <p>{tokenSymbol} Received (Est): <span className="float-right">{tokenMinAmountOut ? parseFloat(tokenMinAmountOut).toFixed(0) : '0'} {tokenSymbol}</span></p>
                    </>
                ) : (
                    <>
                        <p className="py-2">Your Balance: <span className="float-right">{parseFloat(tokenBalances).toFixed(0)} {tokenSymbol}</span></p>
                        <p className="pb-2">Fee (0.3%): <span className="float-right">{feeOnToken ? parseFloat(feeOnToken).toFixed(0) : '0'} {tokenSymbol}</span></p>
                        <p>{currencySymbol} Received (Est): <span className="float-right">{ethMinAmountOut ? parseFloat(ethMinAmountOut).toFixed(5) : '0'} {currencySymbol}</span></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Swap;
