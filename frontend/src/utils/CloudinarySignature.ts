import CryptoJS from "crypto-js";

export const generateSignature = (
	params: Record<string, any>,
	apiSecret: string
): string => {
	const sortedParams = Object.keys(params)
		.sort()
		.reduce((acc, key) => {
			if (
				params[key] !== undefined &&
				params[key] !== null &&
				params[key] !== ""
			) {
				acc.push(`${key}=${params[key]}`);
			}
			return acc;
		}, [] as string[])
		.join("&");

	const signature = CryptoJS.SHA1(sortedParams + apiSecret).toString();

	return signature;
};
