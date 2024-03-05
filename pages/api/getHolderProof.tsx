// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
import path from "path";
import { readFileSync } from "fs";
import { Alchemy, Network } from "alchemy-sdk";
import {getNetworkConfig} from "../../utils/getNetworkConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object>) {
  const { contractAddress, projectId, walletAddress, chainId } = req.query
  await NextCors(req, res, { methods: ['GET'], origin: '*', optionsSuccessStatus: 200 })
  const directory = path.join(process.cwd(), 'config/holderLists')
  const filename = `${contractAddress?.toString().toLowerCase()}-${projectId}.csv`
  const file = readFileSync(`${directory}/${filename}`, 'utf-8')
  const projects = file.split(",").filter((address) => address !== "")
    .map((a) => a.toLowerCase().trim())
  const networkConfig = getNetworkConfig(chainId as string)
  if (networkConfig) {
    const alchemy = new Alchemy(networkConfig)
    const uniqueContractAddresses = projects
      .map((project) => project.split("-")[0])
      .filter((value, index, array) => array.indexOf(value) === index)
    const contractAddressesLimit = 20;
    let response: { tokenId: string; contractAddress: string } | boolean = false
    for (let i = 0; i < uniqueContractAddresses.length; i += contractAddressesLimit) {
      const contractAddresses = uniqueContractAddresses.slice(i, i + contractAddressesLimit)
      for await (const nft of alchemy.nft.getNftsForOwnerIterator(walletAddress as string, { contractAddresses })) {
        if (projects.includes(`${nft.contract.address}-${Math.floor(Number(nft.tokenId) / 1000000)}`)) {
          response = {contractAddress: nft.contract.address, tokenId: nft.tokenId}
          break
        }
      }
      if (response) break
    }
    res.send(response)
  } else {
    res.send(false)
  }

}
