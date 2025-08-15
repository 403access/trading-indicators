import { Environment } from "@/packages/kraken/config";
import type { NoKey } from "@/packages/type-system/keys";

export type ErrorResponse = {
	error: string[];
};

export type SingleSuccessResponse<T> = {
	result: T;
};

export type MultipleSuccessResponse<T> = {
	result: NoKey<"error", T>;
};

export type KrakenResponse<T> = ErrorResponse & MultipleSuccessResponse<T>;

export type AllowedParamType = string | number | boolean | null | undefined;
export type Parameters<T> = {
	[key in keyof T]: AllowedParamType;
};

export const paramsToUrlSearchParams = <T>(params?: Parameters<T>) => {
	const urlParams = new URLSearchParams();
	if (!params) return urlParams;

	// TODO: AST Project: using OR empty object is only there so that
	//       the code shouldn't be refactored to first check whether
	//       params is defined else we would have more boilerplate code.
	//
	//       I guess the JavaScript engine creates an object here which
	//       is then garbage collected again. Instead this code block
	//       should be skipped entirely without initializing any placeholder.
	for (const [key, value] of Object.entries(params || {})) {
		if (value !== undefined) {
			urlParams.append(key, String(value));
		}
	}
	return urlParams;
};

export const buildUrl = <T>(baseUrl: string, params?: Parameters<T>) => {
	if (params === undefined) return baseUrl;

	const urlParams = paramsToUrlSearchParams(params);
	return `${Environment.Production}${baseUrl}?${urlParams}`;
};
