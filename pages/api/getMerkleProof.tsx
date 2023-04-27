// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generateMerkleTree, hashAddress } from "../../utils/allowListHelper";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<String[]>
) {
    const { contractAddress, projectId, walletAddress } = req.query;
    const merkleTree = generateMerkleTree(contractAddress as string, projectId as string);
    res.setHeader("Access-Control-Allow-Origin", "https://artblocks-engine-react-rho.vercel.app");
    res.send(merkleTree.getHexProof(hashAddress(walletAddress as string)));
}
