import axios from "axios";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadToCloudinary = async (
	imageData: string,
	signature: string,
	apiKey: string,
	params: Record<string, any>
): Promise<string> => {
	const formData = new FormData();
	formData.append("file", imageData);
	formData.append("api_key", apiKey);
	formData.append("signature", signature);

	Object.keys(params).forEach((key) => {
		formData.append(key, params[key]);
	});

	try {
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			formData
		);
		return response.data.secure_url;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw error;
	}
};
