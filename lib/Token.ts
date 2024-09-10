import { ethers } from 'ethers';
import { tokenABI } from '@/lib/TokenABI';

export const tickerContract = (tokenAddress?: string, signer?: ethers.Signer) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
        tokenAddress as string,
        tokenABI,
        signer || provider
    );
    return contract;
};

export const sendRoyalty = async (tokenAddress: string, signer: ethers.Signer) => {
    const contract = tickerContract(tokenAddress, signer);
    const tx = await contract.payRoyalty();
    await tx.wait();
    return tx;
};

export const addLiquidity = async (tokenAddress: string, tokenAmount: ethers.BigNumberish, ethAmount: ethers.BigNumberish, signer: ethers.Signer) => {
    const contract = tickerContract(tokenAddress, signer);
    const tx = await contract.initializeLiquidity(tokenAmount, { value: ethAmount });
    await tx.wait();
    return tx;
};

export const buy = async (tokenAddress: string, minAmountOut: ethers.BigNumberish, ethAmount: ethers.BigNumberish, signer: ethers.Signer) => {
    const contract = tickerContract(tokenAddress, signer);
    const tx = await contract.swapEthForTokens(minAmountOut, { value: ethAmount });
    await tx.wait();
    return tx;
};

export const sell = async (tokenAddress: string, tokenAmount: ethers.BigNumberish, minAmountOut: ethers.BigNumberish, signer: ethers.Signer) => {
    const contract = tickerContract(tokenAddress, signer);
    const tx = await contract.swapTokensForEth(tokenAmount, minAmountOut);
    await tx.wait();
    return tx;
};

export const approveSpender = async (tokenAddress: string, spender: string, amount: ethers.BigNumberish, signer: ethers.Signer) => {
    const contract = tickerContract(tokenAddress, signer);
    const tx = await contract.approve(spender, amount);
    await tx.wait();
    return tx;
};

export const tokenNames = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenName = await contract.name();
    return tokenName;
};

export const tokenSymbols = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenSymbol = await contract.symbol();
    return tokenSymbol;
};

export const tokenPriceInETH = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const priceInETH = await contract.getTokenPrice();
    return priceInETH;
};

export const ethPriceInToken = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const priceInToken = await contract.getEthPrice();
    return priceInToken;
};

export const ethReserveAmount = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const etherReserve = await contract.ethReserve();
    return etherReserve;
};

export const tokenReserveAmount = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tokensReserve = await contract.tokenReserve();
    return tokensReserve;
};

export const totalTokenSupply = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const supply = await contract.totalSupply();
    return supply;
};

export const tokenCreator = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenOwner = await contract.creator();
    return tokenOwner;
};

export const tokenBalance = async (tokenAddress: string, address: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenBalances = await contract.balanceOf(address);
    return tokenBalances;
};