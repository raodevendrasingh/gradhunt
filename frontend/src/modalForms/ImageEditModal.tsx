import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { HiOutlineXMark } from "react-icons/hi2";
import { TbLoader } from "react-icons/tb";
import { FaImage } from "react-icons/fa6";
import { ImageCropper } from "@/components/common/ImageCropper";

interface ImageUpload {
	profilePicture: string;
}

export const EditImageModal: React.FC<{
	onSave: () => void;
	setShowImageEditModal: React.Dispatch<React.SetStateAction<boolean>>;
	apiUrl: string;
}> = ({ setShowImageEditModal, onSave, apiUrl }) => {
	const { isSignedIn, user } = useUser();
	const { getToken } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);

	const [publicId, setPublicId] = useState("");
	const [cloudName] = useState("dniezlcfy");
	const [uploadPreset] = useState("rfkhtvsd");

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setUploadedImage(e.target?.result as string);
				setCroppedImage(null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCrop = (croppedImageData: string) => {
		setCroppedImage(croppedImageData);
	};

	const uploadToCloudinary = async (imageData: string): Promise<string> => {
		const formData = new FormData();
		formData.append("file", imageData);
		formData.append("upload_preset", uploadPreset);

		try {
			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
				formData
			);
			// console.log("Cloudinary upload response:", response.data);
			return response.data.public_id;
		} catch (error) {
			console.error("Error uploading to Cloudinary:", error);
			throw error;
		}
	};

	const updateClerkProfileImage = async (imageData: string): Promise<void> => {
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
			console.error("Error updating Clerk profile image:", error);
			throw error;
		}
	};

	const handleSave = async () => {
		if (!croppedImage) {
			toast.error("Please crop the image before saving.");
			return;
		}

		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			// Step 1: Upload to Cloudinary
			const cloudinaryPublicId = await uploadToCloudinary(croppedImage);
			setPublicId(cloudinaryPublicId);

			// Step 2: Update Clerk profile image
			await updateClerkProfileImage(croppedImage);

			const formData = { profilePicture: cloudinaryPublicId };

            // Step 3: Send to backend
			const response = await axios.post(apiUrl, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// console.log(response.data);
			toast.success("Profile Picture Updated");
			onSave();
			setShowImageEditModal(false);
		} catch (error: any) {
			toast.error("Error", {
				description: "Error updating profile picture. Try again!",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		isSignedIn && (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
				>
					<motion.div
						initial={{ scale: 0.9, rotate: "0deg" }}
						animate={{ scale: 1, rotate: "0deg" }}
						exit={{ scale: 0, rotate: "0deg" }}
						onClick={(e) => e.stopPropagation()}
						className="bg-white p-4 rounded-2xl sm:mx-auto w-full max-w-[350px] xs:max-w-md sm:max-w-lg shadow-xl cursor-default relative overflow-hidden"
					>
						<div className="relative z-10">
							<div className="flex items-start justify-between ml-1 rounded-t">
								<h3 className="text-xl font-semibold text-gray-800 mt-1">
									Change Profile Picture
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowImageEditModal(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<div className="mb-4">
								<input
									type="file"
									accept="image/*"
									onChange={handleFileUpload}
									className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
								/>
							</div>
							<div className="h-[400px] w-full border-2 border-dashed rounded-lg border-gray-400 hover:border-blue-500 flex justify-center items-center p-2">
								{croppedImage ? (
									<img
										src={croppedImage}
										alt="Cropped"
										className="max-h-full max-w-full object-contain rounded"
									/>
								) : uploadedImage ? (
									<ImageCropper
										imageSrc={uploadedImage}
										onCropComplete={handleCrop}
									/>
								) : (
									<div className="flex flex-col items-center justify-center gap-4">
										<div className="flex items-center justify-center bg-gray-100 rounded-full size-32">
											<FaImage className="size-20 text-gray-200" />
										</div>
										<span className="text-lg text-gray-500">
											Upload an Image
										</span>
									</div>
								)}
							</div>
							<div className="flex items-center justify-end mt-3 rounded-b">
								<button
									className="flex items-center justify-center gap-3 bg-zinc-800 w-28 text-white font-semibold border rounded-[10px] text-sm px-4 py-2 shadow hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150"
									onClick={handleSave}
									disabled={isLoading || !croppedImage}
								>
									{isLoading ? (
										<>
											<span>Saving</span>
											<TbLoader className="size-4 animate-spin" />
										</>
									) : (
										"Save"
									)}
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};
