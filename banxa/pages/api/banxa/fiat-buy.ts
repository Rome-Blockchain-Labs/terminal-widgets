import type { NextApiRequest, NextApiResponse } from "next";
import { getRequest } from "utils/banxa/getRequest";
import { PATH } from "utils/banxa/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await getRequest(PATH.GET_FIAT_BUY, res);
}
