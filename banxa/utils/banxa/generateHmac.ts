import crypto from "crypto";

const generateHmac = (signature: string, nonce: number): string => {
  const key = process.env.BANXA_API_KEY;
  const secret = process.env.BANXA_API_SECRET;
  if (!key || !secret) throw new Error("API key and/or secret not provided");

  const localSignature = crypto
    .createHmac("SHA256", secret)
    .update(signature)
    .digest("hex");
  return `${key}:${localSignature}:${nonce}`;
};

export default generateHmac;
