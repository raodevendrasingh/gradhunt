// hooks
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

// external packages
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiOutlineArrowRight, HiExclamation } from "react-icons/hi";

interface FieldValues {
	firstname: string;
	lastname: string;
	bio: string;
}

export const UsernameModal = ({
	isUsernameModalOpen,
	setIsUsernameModalOpen,
}: {
	isUsernameModalOpen: boolean;
	setIsUsernameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { isSignedIn, user } = useUser();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [username, setUsername] = useState("");
	const handleInputChange = (e: any) => {
		setUsername(e.target.value);
	};

	const handleCreateProfile = async () => {
		try {
			await user?.update({ username });
			setIsUsernameModalOpen(false);
		} catch (error: any) {
			throw new Error("Failed to update username:", error);
		}
	};

	if (!isUsernameModalOpen) return null;
	return (
		isSignedIn && (
			<AnimatePresence>
				{isUsernameModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
					>
						<motion.div
							initial={{ scale: 0, rotate: "12.5deg" }}
							animate={{ scale: 1, rotate: "0deg" }}
							exit={{ scale: 0, rotate: "0deg" }}
							onClick={(e) => e.stopPropagation()}
							className="bg-gradient-to-br from-green-600 to-teal-500 text-white p-6 rounded-lg w-full max-w-sm shadow-xl cursor-default relative overflow-hidden"
						>
							<div className="relative z-10">
								<h3 className="text-2xl font-bold text-center mb-2">
									Welcome to GradHunt!
								</h3>
								<p className="text-center text-gray-50">
									Let's get you started by creating a unique username.
								</p>
								<form onClick={handleSubmit(handleCreateProfile)}>
									<div>
										<div className="flex flex-col py-10">
											<label htmlFor="uname" className="text-left">
												Username
											</label>
											<div className="flex items-center px-3 py-2 rounded-xl bg-gray-50">
												<span className="text-lg text-gray-700 font-medium">
													gradhunt.tech/
												</span>
												<div className="relative">
													<input
														{...register("username", {
															required: "Username is required",
															minLength: {
																value: 4,
																message: "Username must be atleast 4 character",
															},
															maxLength: {
																value: 12,
																message:
																	"Username must not be exceed 12 characters",
															},
															pattern: {
																value: /^[A-Za-z][A-Za-z0-9._]*$/i,
																message:
																	"Username can only contain alphanumeric characters, periods, and underscores, and cannot start with a symbol",
															},
															validate: async (value) => {
																try {
																	const response = await axios.get(
																		`http://localhost:8000/api/check-username?username=${value}`
																	);
																	return (
																		!response.data.exists ||
																		"Username already exists"
																	);
																} catch (error) {
																	console.error(error);
																	return "Error checking username";
																}
															},
														})}
														id="uname"
														name="username"
														aria-label="Claim your username"
														aria-invalid={errors.userName ? "true" : "false"}
														required
														value={username}
														placeholder="username"
														onChange={handleInputChange}
														className="p-0 w-full text-lg font-medium bg-gray-50 placeholder:text-gray-400 placeholder:font-normal text-gray-700 outline-none ring-0 border-none !important"
													/>
												</div>
											</div>
											{errors.username && errors.username.message && (
												<p
													className="flex pt-1 items-center gap-1 text-gray-50 text-xs"
													role="alert"
												>
													<HiExclamation className="size-4 text-gray-50" />
													{errors.username.message.toString()}
												</p>
											)}
										</div>
									</div>
									<div className="flex gap-2">
										<button className="flex items-center justify-center gap-2 bg-white hover:opacity-90 transition-opacity text-green-700 font-semibold w-full py-2 rounded-xl">
											Create Profile
											<span>
												<HiOutlineArrowRight className="size-5  " />
											</span>
										</button>
									</div>
								</form>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		)
	);
};

export const UserDetailModal = ({
	isUserDetailModalOpen,
	setIsUserDetailModalOpen,
}: {
	isUserDetailModalOpen: boolean;
	setIsUserDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { isSignedIn, user } = useUser();
	const { getToken } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>();

	const handleUpdateProfile: SubmitHandler<FieldValues> = async (data) => {
		try {
			if (!user) {
				throw new Error("User is not defined");
			}

			const userData = {
				firstName: data.firstname,
				lastName: data.lastname,
			};
			const metaData = {
				bio: data.bio,
				userType: "candidate",
			};

			await user.update(userData);
			user.update({
				unsafeMetadata: {
					metaData,
				},
			});

			if (user) {
				const email = user?.primaryEmailAddress?.toString();
				const userProfileData = {
					username: user.username,
					usertype: "candidate",
					firstname: user.firstName,
					lastname: user.lastName,
					email: email,
					bio: data.bio,
				};

				const url = "http://localhost:8000/api/save-candidate-data/";
				const token = await getToken();
				console.log(userProfileData);
				console.log(token);
				await axios.post(url, userProfileData, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
			}
			setIsUserDetailModalOpen(false);
		} catch (error: any) {
			console.error("Failed to update user details:", error);
			if (error.errors && Array.isArray(error.errors)) {
				error.errors.forEach((err: any) => {
					console.error("Error detail:", err);
				});
			}
			if (error.response) {
				console.error("Response status:", error.response.status);
			}
			console.error("Error message:", error.message);
		}
	};

	if (!isUserDetailModalOpen) return null;

	return (
		isSignedIn && (
			<AnimatePresence>
				{isUserDetailModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
					>
						<motion.div
							initial={{ scale: 0, rotate: "12.5deg" }}
							animate={{ scale: 1, rotate: "0deg" }}
							exit={{ scale: 0, rotate: "0deg" }}
							onClick={(e) => e.stopPropagation()}
							className="bg-gradient-to-br from-green-600 to-teal-500 text-white p-6 rounded-lg w-full max-w-md shadow-xl cursor-default relative overflow-hidden"
						>
							<div className="relative z-10 flex flex-col gap-4">
								<div>
									<h3 className="text-2xl font-semibold text-center mb-2">
										Welcome to GradHunt!
									</h3>
									<p className="text-center text-gray-50">
										Tell us a bit about yourself!
									</p>
								</div>
								<form
									onSubmit={handleSubmit(handleUpdateProfile)}
									className="flex flex-col gap-5"
								>
									{/* First Name and Last Name fields */}
									<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
										<div className="w-full sm:w-[48%]">
											<label htmlFor="fname" className="text-left block mb-1">
												First Name
											</label>
											<input
												{...register("firstname", {
													required: "Firstname is required",
													minLength: {
														value: 1,
														message: "Firstname must be at least 1 character",
													},
													maxLength: {
														value: 25,
														message: "Firstname must not exceed 25 characters",
													},
													pattern: {
														value: /^[A-Za-z][A-Za-z ]*$/,
														message: "Firstname can only contain alphabets",
													},
												})}
												id="fname"
												name="firstname"
												aria-invalid={errors.firstname ? "true" : "false"}
												required
												placeholder="First Name"
												className="w-full px-2 py-1 rounded-lg text-lg bg-gray-50 placeholder:text-gray-400 placeholder:text-base text-gray-700 outline-none ring-0 border-none !important"
											/>
											{errors.firstname && errors.firstname.message && (
												<p
													className="flex pt-1 items-center gap-1 text-gray-50 text-xs"
													role="alert"
												>
													<HiExclamation className="size-4 text-gray-50" />
													{errors.firstname.message.toString()}
												</p>
											)}
										</div>

										{/* Last Name field */}
										<div className="w-full sm:w-[48%]">
											<label htmlFor="lname" className="text-left block mb-1">
												Last Name
											</label>
											<input
												{...register("lastname", {
													required: "Lastname is required",
													minLength: {
														value: 1,
														message: "Lastname must be at least 1 character",
													},
													maxLength: {
														value: 25,
														message: "Lastname must not exceed 25 characters",
													},
													pattern: {
														value: /^[A-Za-z][A-Za-z ]*$/,
														message: "Lastname can only contain alphabets",
													},
												})}
												id="lname"
												name="lastname"
												aria-invalid={errors.lastname ? "true" : "false"}
												required
												placeholder="Last Name"
												className="w-full px-2 py-1 rounded-lg text-lg bg-gray-50 placeholder:text-gray-400 placeholder:text-base text-gray-700 outline-none ring-0 border-none !important"
											/>
											{errors.lastname && errors.lastname.message && (
												<p
													className="flex pt-1 items-center gap-1 text-gray-50 text-xs"
													role="alert"
												>
													<HiExclamation className="size-4 text-gray-50" />
													{errors.lastname.message.toString()}
												</p>
											)}
										</div>
									</div>

									{/* Bio field */}
									<div className="flex flex-col">
										<label htmlFor="bio">Give a brief Bio</label>
										<textarea
											id="bio"
											className="px-2 py-1 rounded-lg text-lg bg-gray-50 placeholder:text-gray-400 placeholder:text-base text-gray-700 outline-none ring-0 border-none !important"
											{...register("bio", {
												required: "Bio is required",
												minLength: {
													value: 12,
													message: "Bio must be at least 12 characters",
												},
												maxLength: {
													value: 125,
													message: "Bio cannot exceed 125 characters",
												},
											})}
										/>
										{errors.bio && errors.bio.message && (
											<p
												className="flex pt-1 items-center gap-1 text-gray-50 text-xs"
												role="alert"
											>
												<HiExclamation className="size-4 text-gray-50" />
												{errors.bio.message.toString()}
											</p>
										)}
									</div>

									{/* Submit and Cancel buttons */}
									<div className="flex gap-2">
										<button
											onClick={() => setIsUserDetailModalOpen(false)}
											className="bg-transparent hover:bg-white/10 transition-colors text-white font-medium w-full py-2 rounded-xl"
											type="button"
										>
											I'll Do it Later
										</button>
										<button
											type="submit"
											className="flex items-center justify-center gap-2 bg-white hover:opacity-90 transition-opacity text-green-700 font-semibold w-full py-2 rounded-xl"
										>
											Continue
											<span>
												<HiOutlineArrowRight className="size-5" />
											</span>
										</button>
									</div>
								</form>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		)
	);
};
