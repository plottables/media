import { Network } from "alchemy-sdk";

export const getNetworkConfig = (chainId: string) => {
    switch (chainId) {
        case "1":
            return { network: Network.ETH_MAINNET, apiKey: process.env.ALCHEMY_API_KEY_MAINNET }
        case "5":
            return { network: Network.ETH_GOERLI, apiKey: process.env.ALCHEMY_API_KEY_GOERLI }
        case "11155111":
            return { network: Network.ETH_SEPOLIA, apiKey: process.env.ALCHEMY_API_KEY_SEPOLIA }
        default:
            return null
    }
}
