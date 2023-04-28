// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generateMerkleTree } from "../../utils/allowListHelper";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<String>
) {
    const { contractAddress, projectId } = req.query;
    const merkleTree = generateMerkleTree(contractAddress as string, projectId as string);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(merkleTree.getHexRoot());
}
