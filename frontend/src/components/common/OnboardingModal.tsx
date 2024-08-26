// hooks
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

// external packages
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiOutlineArrowRight } from "react-icons/hi";
import { toast } from "sonner";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { TbLoader } from "react-icons/tb";
import { HiMiniChevronRight } from "react-icons/hi2";

interface FormField {
	username: string;
	usertype: string;
	firstname: string;
	lastname: string;
	bio: string;
	profilePicture: string;
}

const screensDesc = [
	"Let's get you started by creating a unique username.",
	"Tell us a bit about yourself",
];

export const UserOnboardingModal = ({
	isOnboardingModalOpen,
	setIsOnboardingModalOpen,
}: {
	isOnboardingModalOpen: boolean;
	setIsOnboardingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { isSignedIn, user } = useUser();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [currentScreen, setCurrentScreen] = useState<number>(0);
	const [slideDirection, setSlideDirection] = useState<number>(0);

	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		trigger,
		watch,
		formState: { errors, isValid },
	} = useForm<FormField>({
		defaultValues: {
			username: "",
			usertype: "candidate",
			firstname: "",
			lastname: "",
			bio: "",
			profilePicture: undefined,
		},
	});

	const handleNext = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await user?.update({ username });
			console.log(user?.username);
			const isValid = await trigger();
			if (isValid) {
				setSlideDirection(1);
				setCurrentScreen((prev) => prev + 1);
			}
		} catch (error: any) {
			throw new Error("Failed to update username:", error);
		}
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return <UsernameScreen register={register} />;
			case 1:
				return <MetaDataScreen register={register} errors={errors} />;
			default:
				return null;
		}
	};

	useEffect(() => {
		if (user?.username) {
			setCurrentScreen(1);
		}
	}, [user]);

	const onSubmit: SubmitHandler<FormField> = async (data) => {
		console.log("Form data:", data);
		setIsSubmitting(true);

		try {
			if (!user) {
				throw new Error("User is not defined");
			}

			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
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

				console.log(userProfileData);

				const response = await axios.post(
					"/api/save-candidate-data/",
					userProfileData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log(response.data);
			}
			toast.success("Details Updated");
			setIsOnboardingModalOpen(false);
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
		} finally {
			setIsSubmitting(false);
		}
	};

	const username = watch("username");

	const isFirstScreenValid = username.length > 3;

	if (!isOnboardingModalOpen) return null;

	return (
		isSignedIn && (
			<AnimatePresence>
				{isOnboardingModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
					>
						<motion.div
							initial={{ scale: 0, rotate: "0deg" }}
							animate={{ scale: 1, rotate: "0deg" }}
							exit={{ scale: 0, rotate: "0deg" }}
							onClick={(e) => e.stopPropagation()}
							className="bg-white p-4 rounded-2xl sm:mx-auto w-full max-w-[400px] shadow-xl cursor-default relative overflow-hidden"
						>
							<div className="relative z-10 w-full">
								<div className="flex flex-col items-center justify-center rounded-t w-full py-5">
									<h3 className="text-2xl font-bold text-center mb-2">
										Welcome to GradHunt!
									</h3>
									<p className="text-center ">{screensDesc[currentScreen]}</p>
								</div>
								<form id="basicDetailForm" onSubmit={handleSubmit(onSubmit)}>
									<motion.div
										key={currentScreen}
										initial={{ x: slideDirection * 50, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: -slideDirection * 50, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="h-[250px]"
									>
										<div className="p-3">
											<div className="flex flex-col gap-3">
												{renderScreen()}
											</div>
										</div>
									</motion.div>
									<div className="flex items-center justify-center mt-4">
										{currentScreen < screensDesc.length - 1 ? (
											<button
												type="button"
												onClick={handleNext}
												disabled={!isValid || !isFirstScreenValid}
												className="flex w-full items-center justify-center gap-2 text-sm px-4 py-3 bg-zinc-800 text-white rounded-[10px] hover:bg-zinc-900 disabled:bg-zinc-900/60 disabled:cursor-not-allowed transition-colors ml-auto"
											>
												Continue <HiMiniChevronRight className="size-5" />
											</button>
										) : (
											<button
												type="submit"
												disabled={!isValid || isSubmitting}
												className="flex w-full items-center justify-center gap-2 text-sm px-4 py-3 bg-zinc-800 text-white rounded-[10px] hover:bg-zinc-900 disabled:bg-zinc-900/60 disabled:cursor-not-allowed transition-colors ml-auto"
											>
												Create Profile
												{isSubmitting ? (
													<TbLoader className="size-4 animate-spin" />
												) : (
													<HiOutlineArrowRight className="size-4" />
												)}
											</button>
										)}
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

const UsernameScreen: React.FC<{ register: any }> = ({ register }) => {
	const { isCheckingUsername, usernameMsg, checkUsername } =
		useUsernameCheck();

	return (
		<div className="flex flex-col py-10">
			<div className="flex items-center">
				<div className="flex flex-col items-center w-full">
					<div className="flex items-center justify-center w-full">
						<span className="px-3 py-2 border-l border-y rounded-l-lg text-base bg-gray-50 text-gray-700">
							gradhunt.tech/
						</span>
						<div className="relative">
							<input
								{...register("username", {
									required: true,
									maxLength: 12,
									onChange: (e: { target: { value: string } }) =>
										checkUsername(e.target.value),
								})}
								aria-label="Claim your username"
								placeholder="username"
								className="font-normal px-3 py-2 border-y rounded-r-lg w-full text-base bg-white placeholder:text-gray-400 placeholder:font-normal text-gray-800 focus:border-green-600 hover:ring-2 ring-green-500 transition-colors !important"
								title="Claim your username!"
							/>
						</div>
					</div>
					<div className="relative left-40 bottom-7">
						{isCheckingUsername && <TbLoader className="animate-spin" />}
					</div>
					<div className="text-xs w-full flex items-start py-2 px-1">
						{usernameMsg}
					</div>
				</div>
			</div>
		</div>
	);
};

const MetaDataScreen: React.FC<{
	register: any;
	errors: any;
}> = ({ register, errors }) => {
	const [bio, setBio] = useState("");
	const maxChars = 100;

	return (
		<div className="flex flex-col gap-5 w-full">
			{/* First Name and Last Name fields */}
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
