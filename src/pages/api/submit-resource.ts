import { createPR } from "src/util/gh-bot";
import { NextApiRequest, NextApiResponse } from "next";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const url = await createPR(JSON.parse(req.body));
  res.status(200).json({ url });
}
