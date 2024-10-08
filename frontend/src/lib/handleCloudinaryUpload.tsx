import { generateSignature } from "@/utils/CloudinarySignature";
import { uploadToCloudinary } from "./uploadToCloudinary";

const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

export const handleCloudinaryUpload = async (
	imageData: string,
	folder: string
) => {
	const timestamp = Math.floor(Date.now() / 1000);

	const params = {
		timestamp: timestamp,
		folder: folder,
	};

	const signature = generateSignature(params, apiSecret);

	try {
		const cloudinaryUrl = await uploadToCloudinary(
			imageData,
			signature,
			apiKey,
			params
		);
		return cloudinaryUrl;
	} catch (error) {
		console.error("Error uploading to Cloudinary:", error);
		throw error;
	}
};
