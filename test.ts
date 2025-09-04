// Top 50 most recent account trades.

const { createHash, createHmac } = require("crypto");

function main() {
	request({
		method: "POST",
		path: "/0/private/TradesHistory",
		publicKey: "<API_KEY>",
		privateKey: "<API_PRIVATE_KEY>",
		environment: "https://api.kraken.com",
	})
		.then((resp) => resp.text())
		.then(console.log);
}

function request({
	method = "GET",
	path = "",
	query = {},
	body = {},
	publicKey = "",
	privateKey = "",
	environment = "",
}) {
	let url = environment + path;
	let queryString = "";
	if (Object.keys(query).length > 0) {
		queryString = mapToURLValues(query).toString();
		url += "?" + queryString;
	}
	let nonce = "";
	if (publicKey.length > 0) {
		nonce = body["nonce"];
		if (!nonce) {
			nonce = getNonce();
			body["nonce"] = nonce;
		}
	}
	const headers = {};
	let bodyString = null;
	if (Object.keys(body).length > 0) {
		bodyString = JSON.stringify(body);
		headers["Content-Type"] = "application/json";
	}
	if (publicKey.length > 0) {
		headers["API-Key"] = publicKey;
		headers["API-Sign"] = getSignature(
			privateKey,
			queryString + (bodyString || ""),
			nonce,
			path,
		);
	}
	return fetch(url, { method: method, headers: headers, body: bodyString });
}

function getNonce() {
	return Date.now().toString();
}

function getSignature(privateKey = "", data = "", nonce = "", path = "") {
	return sign({
		privateKey: privateKey,
		message:
			path +
			createHash("sha256")
				.update(nonce + data)
				.digest("binary"),
	});
}

function sign({ privateKey = "", message = "" }) {
	return createHmac("sha512", Buffer.from(privateKey, "base64"))
		.update(message, "binary")
		.digest("base64");
}

function mapToURLValues(object) {
	return new URLSearchParams(
		Object.entries(object).map(([k, v]) => {
			if (typeof v == "object") {
				v = JSON.stringify(v);
			}
			return [k, v];
		}),
	);
}

main();
