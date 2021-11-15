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

  try {
    const url = await createPR(JSON.parse(req.body));
    res.status(200).json({ url });
  } catch (e) {
    const err = e as any;
    if (err.status) {
      if (err.response?.data?.message === "Reference already exists") {
        res
          .status(err.status)
          .json({ error: "Pull Request already exists for this resource" });
        return;
      }
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
