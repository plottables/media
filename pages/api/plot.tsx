// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import parseHtml from "../../utils/parseHtml";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const { contractAddress, tokenId, uri } = req.query;
  if (
    typeof contractAddress === "string" &&
    typeof tokenId === "string" &&
    typeof uri === "string"
  ) {
    res.send(await parseHtml("plot", contractAddress, tokenId, uri));
  }
}
