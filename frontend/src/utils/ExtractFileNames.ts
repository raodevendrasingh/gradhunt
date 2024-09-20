export const extractFileName = (fileUrl: string): string => {
	const parts = fileUrl.split("/");
	let lastPart = parts[parts.length - 1];
	lastPart = lastPart.split("?")[0];
	const filenameParts = lastPart.split("/");
	let fileName = filenameParts[filenameParts.length - 1];
	fileName = decodeURIComponent(fileName);

	return fileName;
};
