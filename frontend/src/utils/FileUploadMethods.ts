export const openFileDialog = (inputRef: React.RefObject<HTMLInputElement>) => {
	inputRef.current?.click();
};

export const handleCrop = (
	setCroppedImage: React.Dispatch<React.SetStateAction<string | null>>,
	setIsCropperOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
	return (croppedImageData: string) => {
		setCroppedImage(croppedImageData);
		setIsCropperOpen(false);
	};
};

export const handleUpload = (
	setUploadedImage: React.Dispatch<React.SetStateAction<string | null>>,
	setIsCropperOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
	return (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Check file size (less than 2MB)
			if (file.size > 2 * 1024 * 1024) {
				alert("File size must be less than 2MB.");
				return;
			}
			// Check file type (jpg, jpeg, png)
			const validTypes = ["image/jpeg", "image/png"];
			if (!validTypes.includes(file.type)) {
				alert("Only JPG, JPEG, and PNG formats are allowed.");
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImage(reader.result as string);
				setIsCropperOpen(true);
			};
			reader.readAsDataURL(file);
		}
	};
};
