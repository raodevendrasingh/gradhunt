import { EditImageModal } from "@/modal-forms/ImageEditModal";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRef, useState } from "react";
import { ImageCropper } from "../common/ImageCropper";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";

export const MetaDataScreen: React.FC<{
	register: any;
	errors: any;
}> = ({ register, errors }) => {
	const { user } = useUser();
	const [value, setValue, removeValue] = useLocalStorage<
		string | ArrayBuffer | null
	>("croppedImage", "");

	const maxChars = 100;
	const [bio, setBio] = useState("");
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [isCropperOpen, setIsCropperOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleCrop = (croppedImageData: string) => {
		setCroppedImage(croppedImageData);
		setValue(croppedImageData);
		setIsCropperOpen(false);
	};

	const openFileDialog = () => {
		inputRef.current?.click();
		setUploadedImage(null);
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setCroppedImage(null);
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImage(reader.result as string);

				setValue(reader.result);
			};
			reader.readAsDataURL(file);
		}
		setIsCropperOpen(true);
	};

	return (
		<div
			className="flex flex-col gap-3 w-full "
		>
			<div className="flex flex-col items-center justify-center gap-2 w-full">
				<input
					{...register("profilePicture")}
					aria-invalid={errors.profilePicture ? "true" : "false"}
					type="file"
					name="profilePicture"
					className="hidden"
					ref={(e) => (inputRef.current = e)}
					onChange={handleFileUpload}
				/>
				{croppedImage ? (
					<img
						src={croppedImage}
						alt="Cropped"
						className="size-16 object-cover rounded-full bg-gray-400"
					/>
				) : uploadedImage ? (
					<>
						<ImageCropper
							imageSrc={uploadedImage}
							onCropComplete={handleCrop}
						/>
						<img
							src={user?.imageUrl}
							alt="User profile"
							className="size-[70px] object-cover rounded-full bg-gray-400"
						/>
					</>
				) : (
					<img
						src={user?.imageUrl}
						alt="User profile"
						className="size-[70px] object-cover rounded-full bg-gray-400"
					/>
				)}
				<button
					type="button"
					onClick={openFileDialog}
					className="text-slate-700 bg-white text-xs p-1 rounded-md"
				>
					Upload Picture
				</button>
			</div>
			<div className="w-full flex flex-col gap-3 justify-between sm:flex-row">
				<div className="w-full flex flex-col sm:w-1/2">
					<label
						htmlFor="firstname"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						First Name
					</label>
					<input
						{...register("firstname", {
							required: "First Name is required",
							minLength: {
								value: 2,
								message: "First Name should be at least 2 characters",
							},
							maxLength: 15,
						})}
						aria-invalid={errors.firstname ? "true" : "false"}
						type="text"
						name="firstname"
						id="firstname"
						placeholder="First Name"
						className="border py-1.5 rounded-md border-gray-200 w-full"
					/>
					{errors.firstname && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.firstname.message as string}
						</span>
					)}
				</div>
				<div className="w-full flex flex-col sm:w-1/2">
					<label
						htmlFor="lastname"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						Last Name
					</label>
					<input
						{...register("lastname", {
							required: "Last Name is required",
							minLength: {
								value: 2,
								message: "Last Name should be at least 2 characters",
							},
							maxLength: 15,
						})}
						aria-invalid={errors.lastname ? "true" : "false"}
						type="text"
						name="lastname"
						id="lastname"
						placeholder="Last Name"
						className="border py-1.5 rounded-md border-gray-200 w-full"
					/>
					{errors.lastname && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.lastname.message as string}
						</span>
					)}
				</div>
			</div>
			{/* Bio field */}
			<div className="w-full flex flex-col">
				<label
					htmlFor="bio"
					className="text-sm font-semibold text-gray-700 pb-1"
				>
					Bio
				</label>
				<textarea
					{...register("bio", {
						minLength: {
							value: 10,
							message: "Minimum 10 characters are required",
						},
						maxLength: {
							value: 100,
							message: "Bio length should not exceed 100 characters",
						},
					})}
					name="bio"
					id="bio"
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					maxLength={maxChars}
					placeholder="Give yourself a cool bio"
					rows={3}
					className="border py-1.5 rounded-md border-gray-200 w-full"
				></textarea>
				<div className="flex relative">
					{errors.bio && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.bio.message as string}
						</span>
					)}
					<span className="absolute right-0 text-xs text-gray-600">
						({maxChars - bio.length}/{maxChars})
					</span>
				</div>
			</div>
		</div>
	);
};
