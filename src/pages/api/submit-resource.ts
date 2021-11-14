import { createPR } from "src/lib/gh-bot";
import { NextApiRequest, NextApiResponse } from "next";
import data from "src/data.json";
import { removeUrlProtocol } from "src/lib/util";

export default async function submitResource(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  // verify url isn't already in data.json
  for (const key in data) {
    if (removeUrlProtocol(data[key].url) === removeUrlProtocol(body.url)) {
      res.status(400).json({
        error: `Oops, a resource already exists with that link!`,
      });
      return;
    }
  }

  const url = await createPR(JSON.parse(req.body));
  res.status(200).json({ url });
}
