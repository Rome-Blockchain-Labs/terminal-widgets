import axios, { AxiosRequestConfig, AxiosError } from "axios";
import generateHmac from "./generateHmac";
import type { NextApiResponse } from "next";
import { PATH } from "./types";

export async function postRequest(
  query: PATH,
  res: NextApiResponse,
  payload: Record<string, string>
) {
  const nonce = Date.now();
  const method = "POST";
  const stringifiedPayload = JSON.stringify(payload);
  const data = method + "\n" + query + "\n" + nonce + "\n" + stringifiedPayload;

  const hmac = generateHmac(data, nonce);
  const options: AxiosRequestConfig = {
    baseURL: process.env.BANXA_DOMAIN,
    url: query,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + hmac,
    },
    data: payload,
  };
  try {
    const response = await axios(options);
    return res.status(200).json({ data: response.data.data });
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.data);

      return res.status(err.response.status).json({ data: err.response.data });
    }
    return res.status(400);
  }
}
