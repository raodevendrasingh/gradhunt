export const updateClerkProfileImage = async (
	user: any,
	imageData: string
) => {
	if (!user) {
		throw new Error("User is not available");
	}

	try {
		// Convert base64 string to Blob
		const byteString = atob(imageData.split(",")[1]);
		const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		const blob = new Blob([ab], { type: mimeString });

		const result = await user.setProfileImage({ file: blob });
		// console.log("Clerk profile image update result:", result);
	} catch (error) {
		console.error("Error updating clerk profile image:", error);
		throw error;
	}
};
