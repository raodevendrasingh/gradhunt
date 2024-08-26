import { useState } from "react";

export const MetaDataScreen: React.FC<{
	register: any;
	errors: any;
}> = ({ register, errors }) => {
	const [bio, setBio] = useState("");
	const maxChars = 100;

	return (
		<div className="flex flex-col gap-5 w-full">
			<div className="w-full flex flex-col justify-between sm:flex-row">
				<div className="w-full flex flex-col sm:w-[49%]">
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
						className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-green-700"
					/>
					{errors.firstname && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.firstname.message as string}
						</span>
					)}
				</div>
				<div className="w-full flex flex-col sm:w-[49%]">
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
						className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-green-700"
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
					placeholder=""
					rows={3}
					className="w-full px-2 py-2 text-sm border rounded-lg border-gray-400 focus:border-green-700"
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
