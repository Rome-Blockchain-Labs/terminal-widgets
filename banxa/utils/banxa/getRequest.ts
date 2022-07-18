import axios, { AxiosRequestConfig, AxiosError } from "axios";
import generateHmac from "./generateHmac";
import type { NextApiResponse } from "next";
import { PATH } from "./types";

export async function getRequest(
  query: PATH,
  res: NextApiResponse,
  params?: Record<string, string>
) {
  const nonce = Date.now();
  const method = "GET";
  let data: string;
  let queryWithParams: string | undefined;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    queryWithParams = query + "?" + queryString;
    data = method + "\n" + queryWithParams + "\n" + nonce;
  } else {
    data = method + "\n" + query + "\n" + nonce;
  }

  const hmac = generateHmac(data, nonce);
  const options: AxiosRequestConfig = {
    baseURL: process.env.BANXA_DOMAIN,
    url: queryWithParams ? queryWithParams : query,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + hmac,
    },
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
