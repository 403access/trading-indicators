/**
 * title: Spot REST Authentication
 * description: Excerpt from the Kraken API documentation.
 *
 * Authentication Parameters
 * For the REST API, the following parameters are used for authentication
 * to endpoints which contain private data:
 * - API-Key HTTP header parameter: the public key from your API key-pair.
 * - API-Sign HTTP header parameter: encrypted signature of message.
 * - nonce payload parameter: always increasing, unsigned 64-bit integer.
 * - otp payload parameter: one-time-password and is only required if additional 2FA is configured for API.
 *
 *
 * Setting the API-Key Parameter
 * The value for the API-Key HTTP header parameter is your public API key.
 * An API key-pair is required to access the authenticated endpoints, see How to Create an API Key.
 * https://support.kraken.com/hc/en-us/articles/360000919966-How-to-create-an-API-key
 *
 * caution
 * From your API key-pair, clearly identify which key is public and which key is private.
 * - The public key is sent in the API-Key header parameter.
 * - The private key is never sent, it is only used to encode the signature for API-Sign header parameter.
 *
 * Setting the API-Sign Parameter
 * The value for the API-Sign HTTP header parameter is a signature generated from encoding your private API key, nonce, encoded payload, and URI path.
 *      HMAC-SHA512 of (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key
 * Note: The URI path used for API-Sign should be the part starting with "/0/private" of the API URL.
 *
 * Examples
 * The following is a specific example of a signature generated with a particular private key, nonce, and payload corresponding to a new limit order (buy 1.25 XBTUSD at $37,500).If your code is generating a different signature (API-Sign) for this example, then there is likely an issue with your application of the above methodology. Code snippets for generating the signature in Python, Golang and Node.js follow below.
 * Field	        Value
 * Private Key	    kQH5HW/8p1uGOVjbgWA7FunAmGO8lsSUXNsu3eow76sz84Q18fWxnyRzBHCd3pd5nE9qa99HAZtuZuj6F1huXg==
 * Nonce	        1616492376594
 * Encoded Payload	nonce=1616492376594&ordertype=limit&pair=XBTUSD&price=37500&type=buy&volume=1.25
 * URI Path         /0/private/AddOrder
 * API-Sign         4/dpxb3iT4tp/ZCVEwSnEsLxx0bqyhLpdfOpc6fn7OR8+UClSV5n9E6aSS8MPtnRfp32bAb0nmbRn6H8ndwLUQ==
 *
 * documentation: https://docs.kraken.com/api/docs/guides/spot-rest-auth
 */
import crypto from "node:crypto";
import querystring from "node:querystring";

export function getKrakenSignature(urlPath: string, data: any, secret: string) {
	let encoded: any;
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

export function getKrakenSignature2(
	urlPath: string, // e.g. "/0/private/Balance"
	data: Record<string, string>, // must include { nonce: "..." }
	secretB64: string,
): string {
	// 1) Build form-encoded body with nonce first
	const params = new URLSearchParams();
	if (!("nonce" in data)) throw new Error("Missing nonce");

	params.append("nonce", data.nonce);
	for (const [k, v] of Object.entries(data)) {
		if (k === "nonce") continue;
		params.append(k, v);
	}
	const body = params.toString(); // POST body
	console.log("POST body:", body);

	// 2) SHA256(nonce + POST data)
	const sha256 = crypto
		.createHash("sha256")
		.update(data.nonce + body, "utf8")
		.digest(); // Buffer

	// 3) HMAC-SHA512( uriPath + sha256 )
	const key = Buffer.from(secretB64, "base64");
	const msg = Buffer.concat([Buffer.from(urlPath, "utf8"), sha256]);
	const signature = crypto
		.createHmac("sha512", key)
		.update(msg)
		.digest("base64");

	return signature;
}
