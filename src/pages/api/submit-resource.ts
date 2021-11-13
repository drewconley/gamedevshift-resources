import { createPR } from "src/util/gh-bot";
import { NextApiRequest, NextApiResponse } from "next";
import data from "src/data.json";

export default async function submitResource(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  // verify url isn't already in data.json
  for (const key in data) {
    if (removeProtocol(data[key].url) === removeProtocol(body.url)) {
      res.status(400).json({
        error: `Oops, a resource already exists with that link!`,
      });
      return;
    }
  }

  const url = await createPR(JSON.parse(req.body));
  res.status(200).json({ url });
}

function removeProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}
