import { MerkleTree } from "merkletreejs";
import { keccak256, solidityPackedKeccak256 } from "ethers";
import { readFileSync } from "fs";

export const hashAddress = (address: string) => {
    return Buffer.from(solidityPackedKeccak256(["address"], [address]).slice(2), "hex");
};

export const generateMerkleTree = (contractAddress: string, projectId: string) => {
    const file = readFileSync(`allowLists/${contractAddress?.toString().toLowerCase()}-${projectId}.csv`, 'utf-8');
    const addresses = file
        .split(",")
        .filter((address) => address !== "")
        .map((a) => a.trim());
    return new MerkleTree(
        addresses.map((addr: string) => hashAddress(addr)),
        keccak256,
        { sortPairs: true }
    );
};
