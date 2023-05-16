// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
import path from "path";
import { readFileSync } from "fs";
import { Alchemy, Network } from "alchemy-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  const { contractAddress, projectId, walletAddress, isMainnet } = req.query;
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
    .map((a) => a.toLowerCase().trim());

  const config = {
    apiKey: isMainnet === "1" ? process.env.ALCHEMY_API_KEY_MAINNET : process.env.ALCHEMY_API_KEY_TESTNET,
    network: isMainnet === "1" ? Network.ETH_MAINNET : Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(config);
  await alchemy.nft.getNftsForOwner(
    walletAddress as string,
    { contractAddresses: projects.map((project) => project.split("-")[0]) }
  )
    .then((data) => {
      res.send(data.ownedNfts
        .filter((ownedNft) => {
          return projects.includes(`${ownedNft.contract.address}-${Math.floor(Number(ownedNft.tokenId) / 1000000)}`)
        })
        .map((ownedNft) => {
          return {
            contractAddress: ownedNft.contract.address,
            tokenId: ownedNft.tokenId
          }
        })[0]
      )
    });

}
