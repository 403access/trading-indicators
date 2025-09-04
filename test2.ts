const crypto = require("crypto");
const querystring = require("querystring");

// Function to get Kraken signature
function getKrakenSignature(urlPath, data, secret) {
	let encoded;
	if (typeof data === "string") {
		console.log("Data is a string, parsing JSON...");

		const jsonData = JSON.parse(data);
		console.log("Data stringified:", jsonData);

		encoded = jsonData.nonce + data;
		console.log("encoded:", encoded);
	} else if (typeof data === "object") {
		console.log("Data is an object, converting to query string...");
		const dataStr = querystring.stringify(data);
		console.log("Data stringified:", dataStr);

		encoded = data.nonce + dataStr;
		console.log("Encoded data:", encoded);
	} else {
		throw new Error("Invalid data type");
	}

	const sha256Hash = crypto.createHash("sha256").update(encoded).digest();
	const message = urlPath + sha256Hash.toString("binary");
	const secretBuffer = Buffer.from(secret, "base64");
	const hmac = crypto.createHmac("sha512", secretBuffer);
	hmac.update(message, "binary");
	const signature = hmac.digest("base64");
	return signature;
}

const apiKey = "zKHeEvsQIABrag/aLc1TxgK2qiMdxl83tjYTeF9FUiLwb0wvfKnGCHSe";
console.log("API Key:", apiKey);

const apiSec =
	"bM+TT4eIbmtCLy8AIcb9kiMcg5DY+7cIIoafa4EEpRAJMQOaW8mbhbYfco97OFHrINk4dUo7UDijhQAUBHy81A==";
console.log("API Secret:", apiSec);

const payload = { nonce: Date.now().toString() };

const signature = getKrakenSignature(
	"/0/private/TradesHistory",
	payload,
	apiSec,
);
console.log(`API-Sign: ${signature}`);

const response = await fetch("https://api.kraken.com/0/private/TradesHistory", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"API-Key": apiKey,
		"API-Sign": signature,
	},
	body: payload,
});
console.log("Response status:", response.status);

const responseBody = await response.json();
console.log("Response body:", responseBody);
