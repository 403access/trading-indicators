import type { TLSOptions } from "bun";

// SSL certificate files
const sslBaseDirectory = "./data/ssl/";
const getSslRelatedFile = (fileName: string) =>
	Bun.file(`${sslBaseDirectory}${fileName}`);

const certFile = getSslRelatedFile("cert.pem");
const keyFile = getSslRelatedFile("key.pem");

export const tlsOptions: TLSOptions = {
	cert: certFile,
	key: keyFile,
};
