// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
import path from "path";
import { readFileSync } from "fs";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object[]>
) {
    const { contractAddress, projectId } = req.query;
    await NextCors(req, res, {
        methods: ['GET'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    const directory = path.join(process.cwd(), 'config/holderLists');
    const file = readFileSync(`${directory}/${contractAddress?.toString().toLowerCase()}-${projectId}.csv`, 'utf-8');
    const projects = file
      .split(",")
      .filter((address) => address !== "")
      .map((a) => a.trim())
      .map((a) => {
          const project = a.split("-");
          return {contractAddress: project[0], projectId: project[1]};
      });
    res.send(projects);
}
