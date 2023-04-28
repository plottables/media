// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generateMerkleTree } from "../../utils/allowListHelper";
import NextCors from 'nextjs-cors';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<String>
) {
    const { contractAddress, projectId } = req.query;
    await NextCors(req, res, {
        methods: ['GET'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    const merkleTree = generateMerkleTree(contractAddress as string, projectId as string);
    res.send(merkleTree.getHexRoot());
}
