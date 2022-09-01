import type { NextApiRequest, NextApiResponse } from "next";
import { getOrderRequest } from "utils/banxa/getOrderRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await getOrderRequest(res, req.body.orderID);
}
