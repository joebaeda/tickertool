import { ethers } from 'ethers';
import { tokenABI } from '@/lib/TokenABI';
import { tokenCode } from '@/lib/TokenCode';

export const deployTickerContract = async (tokenName: string, tokenSymbol: string, logoUrl: string, tokenDesc: string, creatorFee: string, ethReserve: ethers.BigNumberish, tokenReserve: ethers.BigNumberish, signer: ethers.Signer,) => {
    const contractFactory = new ethers.ContractFactory(tokenABI, tokenCode, signer);
    const tx = await contractFactory.deploy(tokenName, tokenSymbol, logoUrl, tokenDesc, creatorFee, ethReserve, tokenReserve);
    await tx.waitForDeployment();
    return tx.getAddress();
};

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

export const tokenCreator = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenOwner = await contract.creator();
    return tokenOwner;
};

export const creatorFee = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const feePercentage = await contract.creatorFeePercentage();
    return feePercentage;
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

export const tokenDesc = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tDesc = await contract.tokenDescription();
    return tDesc;
};

export const tokenLogo = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tLogo = await contract.tokenImageUrl();
    return tLogo;
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

export const totalTokenBurn = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const totalBurn = await contract.tokenBurn();
    return totalBurn;
};

export const totalETHFee = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const ethFee = await contract.totalEthFeesCollected();
    return ethFee;
};

export const totalTokenFee = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenFee = await contract.totalTokenFeesCollected();
    return tokenFee;
};

export const totalTokenSupply = async (tokenAddress: string) => {
    const contract = tickerContract(tokenAddress);
    const supply = await contract.totalSupply();
    return supply;
};

export const tokenBalance = async (tokenAddress: string, address: string) => {
    const contract = tickerContract(tokenAddress);
    const tokenBalances = await contract.balanceOf(address);
    return tokenBalances;
};