"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ethers, Signer } from 'ethers';
import { supportedNetwork } from '@/lib/SupportedNetwork';

interface NetworkProps {
    name: string;
    chainIdHex: string;
    chainIdNumber: number;
    explorer: string;
    logo: string;
    ticker: string;
}

interface WalletContextProps {
    signer: Signer | null;
    address: string;
    balances: string;
    network: NetworkProps | null;
    isWrongNetwork: boolean;
    isNoWallet: boolean;
    isConnected: boolean;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

interface WalletProviderProps {
    children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [signer, setSigner] = useState<Signer | null>(null);
    const [address, setAddress] = useState<string>('');
    const [balances, setBalances] = useState<string>('');
    const [network, setNetwork] = useState<NetworkProps | null>(null);
    const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
    const [isNoWallet, setIsNoWallet] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const connectWallet = useCallback(async () => {
        if (!window?.ethereum) {
            setIsNoWallet(true);
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();

            // Find the matching network
            const networkInfo = supportedNetwork.find((net) => BigInt(net.chainIdNumber) === network.chainId);

            if (!networkInfo) {
                setIsWrongNetwork(true);
            } else {
                setNetwork(networkInfo);
                setIsWrongNetwork(false);
            }


            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            const userBalances = await provider.getBalance(userAddress);
            setSigner(signer);
            setAddress(userAddress);
            setIsNoWallet(false);
            setBalances(ethers.formatEther(userBalances));
            setIsConnected(true);
            console.log(`Connected with address: ${userAddress}`);

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setIsNoWallet(true);
            setIsConnected(false);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setSigner(null);
        setAddress('');
        setBalances('');
        setNetwork(null);
        setIsWrongNetwork(false);
        setIsNoWallet(false);
        setIsConnected(false);
    }, []);

    useEffect(() => {
        connectWallet(); // Attempt to connect wallet on mount

        if (window?.ethereum) {
            const handleChainChanged = () => {
                console.log('Network changed');
                window.location.reload(); // Reload the page on network change
            };

            const handleAccountsChanged = (accounts: string[]) => {
                console.log('Accounts changed');
                if (accounts.length === 0) {
                    disconnectWallet(); // Handle wallet disconnect
                } else {
                    window.location.reload(); // Reload the page on account change
                }
            };

            const handleDisconnect = () => {
                console.log('Wallet disconnected');
                disconnectWallet(); // Handle wallet disconnect
            };

            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('disconnect', handleDisconnect);

            // Cleanup event listeners on unmount
            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('disconnect', handleDisconnect);
            };
        }
    }, [connectWallet, disconnectWallet]);

    return (
        <WalletContext.Provider value={{ signer, address, balances, network, isWrongNetwork, isNoWallet, isConnected, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const WalletButton = () => {
    const { isConnected, connectWallet } = useWallet();

    return (
        <div>
            {!isConnected ? (
                <button
                    className="z-10 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded shadow-md transform hover:scale-105 transition duration-300"
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            ) : (
                <p className="text-center text-green-600">Wallet Connected</p>
            )}
        </div>
    );
};
