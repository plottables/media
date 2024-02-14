import { Network } from "alchemy-sdk";

export const getNetworkConfig = (networkName: string) => {
    switch (networkName) {
        case "mainnet":
            return { network: Network.ETH_MAINNET, apiKey: process.env.ALCHEMY_API_KEY_MAINNET }
        case "goerli":
            return { network: Network.ETH_GOERLI, apiKey: process.env.ALCHEMY_API_KEY_GOERLI }
        case "sepolia":
            return { network: Network.ETH_SEPOLIA, apiKey: process.env.ALCHEMY_API_KEY_SEPOLIA }
        default:
            return null
    }
}
