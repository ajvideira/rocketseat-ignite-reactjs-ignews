import { NextApiRequest, NextApiResponse } from "next";

export default async function webhooks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Evento recebido.");
  return res.status(200).json({ ok: true });
}
