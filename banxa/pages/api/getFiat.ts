function generateHmac(signature, nonce) {
  const crypto = require("crypto");
  const key = "rometerminal@2022test";
  const secret = "rvNBY1GoKYnqDCyEQmjKORYFK5XUt11b";

  const localSignature = crypto
    .createHmac("SHA256", secret)
    .update(signature)
    .digest("hex");
  return `${key}:${localSignature}:${nonce}`;
}

function sendGetRequest(query) {
  const hostname = "rometerminal.banxa-sandbox.com";
  const nonce = Date.now();
  const method = "GET";
  let data = method + "\n" + query + "\n" + nonce;

  const hmac = generateHmac(data, nonce);
  const https = require("https");
  const options = {
    hostname: hostname,
    path: query,
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hmac}`,
    },
  };

  const req = https.get(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on("end", () => {
      console.log("No more data in response.");
    });
  });

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });
}

sendGetRequest("/api/fiats/buy");
