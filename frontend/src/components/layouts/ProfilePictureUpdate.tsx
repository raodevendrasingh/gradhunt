import {
	handleCrop,
	handleUpload,
	openFileDialog,
} from "@/utils/FileUploadMethods";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { LogoCropper } from "../common/LogoCropper";
import { updateClerkProfileImage } from "@/lib/updateClerkImage";
import Spinner from "../ui/Spinner";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { generateSignature } from "@/utils/CloudinarySignature";
import { apiKey, apiSecret, timestamp } from "@/modal-forms/OnboardingModal";

type ProfileImageUpload = {
	profilePicture: string;
};
export const HandleProfilePictureUpdate = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
	const [isCropperOpen, setIsCropperOpen] = useState(false);
	const ImageUploadRef = useRef<HTMLInputElement | null>(null);

	const openLogoFileDialog = () => openFileDialog(ImageUploadRef);

	const handleImageCrop = handleCrop(setCroppedImage, setIsCropperOpen);
	const handleImageUpload = handleUpload(setUploadedImage, setIsCropperOpen);

	const { getToken } = useAuth();
	const { user, isLoaded } = useUser();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileImageUpload>();

	const onSubmit = async (data: ProfileImageUpload) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User not authorized!");
			}

			const params = {
				timestamp: timestamp,
				folder: "gradhunt/profile",
			};

			let cloudinaryImageUrl = "";
			const signature = generateSignature(params, apiSecret);

			if (croppedImage) {
				cloudinaryImageUrl = await uploadToCloudinary(
					croppedImage,
					signature,
					apiKey,
					params
				);
				await updateClerkProfileImage(user, croppedImage as string);
			}

			const formData = {
				profilePicture: cloudinaryImageUrl,
			};

			const url = "/api/users/profile-image";
			await axios.post(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Profile picture updated successfully");
			// setShowUpdateButton(false);
			setCroppedImage(null);
		} catch (error) {
			console.error(error);
			toast.error("Failed to update profile pitcure");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col items-start gap-5 justify-start sm:items-center sm:flex-row sm:justify-between pb-6 mb-6 border-b ">
					<div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">
						<input
							{...register("profilePicture")}
							aria-invalid={errors.profilePicture ? "true" : "false"}
							type="file"
							name="profilePicture"
							className="hidden"
							ref={ImageUploadRef}
							onChange={handleImageUpload}
						/>
						{croppedImage ? (
							<img
								src={croppedImage}
								alt="Cropped"
								className="w-24 h-24 object-cover rounded-full bg-gray-400"
							/>
						) : (
							<>
								{isLoaded ? (
									<img
										src={user?.imageUrl}
										alt="User profile"
										className="w-24 h-24 object-cover rounded-full"
									/>
								) : (
									<div className="h-24 w-24 skeleton rounded-full" />
								)}
							</>
						)}
						<div className="">
							<h3 className="font-medium text-gray-800">
								Change Profile Picture
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								JPG, GIF or PNG. Max size of 800K
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="secondary"
							className="rounded-lg w-24 py-2"
							onClick={openLogoFileDialog}
						>
							Upload
						</Button>
						{croppedImage && (
							<Button
								type="submit"
								variant="primary"
								className="rounded-lg w-24 py-2"
							>
								{isLoading ? <Spinner /> : "Update"}
							</Button>
						)}
					</div>
				</div>
			</form>
			{isCropperOpen && uploadedImage && (
				<LogoCropper
					imageSrc={uploadedImage}
					onCropComplete={handleImageCrop}
					onClose={() => setIsCropperOpen(false)}
				/>
			)}
		</>
	);
};
