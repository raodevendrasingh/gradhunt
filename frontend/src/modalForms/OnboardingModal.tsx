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
import { HiMiniChevronRight } from "react-icons/hi2";
import { UsernameScreen } from "../components/layouts/UsernameScreen";
import { MetaDataScreen } from "../components/layouts/MetaDataScreen";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

import brandIcon from "@/assets/brand/brandIcon.png";
import clsx from "clsx";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { updateClerkProfileImage } from "@/lib/updateClerkImage";
import Spinner from "@/components/ui/Spinner";

interface FormField {
	username: string;
	usertype?: string;
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
	const [publicId, setPublicId] = useState("");
	const [loadingMsg, setLoadingMsg] = useState<string>("Creating your Profile");

	const [, , removePotentialUser] = useLocalStorage("potentialUser", "null");
	const croppedImage = useReadLocalStorage<string | ArrayBuffer | null>(
		"croppedImage"
	);
    const [, , removeCroppedValue] = useLocalStorage<string>("croppedImage", "null");


	const { getToken } = useAuth();
	const { isValidUsername, isCheckingUsername, usernameMsg, checkUsername } =
		useUsernameCheck();

	const {
		control,
		register,
		handleSubmit,
		trigger,
		watch,
		formState: { errors, isValid, isDirty },
	} = useForm<FormField>({
		defaultValues: {
			username: "",
			usertype: "candidate",
			firstname: "",
			lastname: "",
			bio: "",
			profilePicture: "",
		},
	});

	const handleNext = async (e: React.MouseEvent) => {
		e.preventDefault();
		const isValid = await trigger();
		if (isValid) {
			setSlideDirection(1);
			setCurrentScreen((prev) => prev + 1);
		}
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return (
					<UsernameScreen
						register={register}
						isCheckingUsername={isCheckingUsername}
						checkUsername={checkUsername}
						getDisplayMessage={getDisplayMessage}
					/>
				);
			case 1:
				return <MetaDataScreen register={register} errors={errors} />;
			default:
				return null;
		}
	};

	// dynamic loading messages
	useEffect(() => {
		const timers: NodeJS.Timeout[] = [];

		if (isSubmitting) {
			timers.push(
				setTimeout(() => {
					setLoadingMsg("Uploading Profile Picture...");
				}, 3000)
			);

			timers.push(
				setTimeout(() => {
					setLoadingMsg("Uploading your Data...");
				}, 5000)
			);

			timers.push(
				setTimeout(() => {
					setLoadingMsg("Please wait!");
				}, 6000)
			);
		}

		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, [isSubmitting]);

	useEffect(() => {
		if (user?.username) {
			setCurrentScreen(1);
		}
	}, [user]);

	const getDisplayMessage = () => {
		if (!isDirty || username.length < 4) {
			return (
				<p className="text-light font-normal text-sm">Grab your username!</p>
			);
		}
		if (errors.username) {
			return (
				<p className="text-red-500 text-sm" role="alert">
					{errors.username.message}
				</p>
			);
		}
		if (username && !isValidUsername(username)) {
			return (
				<p className="text-red-500 text-sm">
					Username can only contain lowercase letters and digits (max 16
					characters)
				</p>
			);
		}
		if (usernameMsg) {
			return <p className="text-sm">{usernameMsg}</p>;
		}
		return null;
	};

    const clearLocalStorage = () => {
        removePotentialUser();
        removeCroppedValue();
    };

	const onSubmit: SubmitHandler<FormField> = async (data) => {
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

			if (croppedImage) {
				const cloudinaryPublicId = await uploadToCloudinary(
					croppedImage as string
				);
				setPublicId(cloudinaryPublicId);
				await updateClerkProfileImage(user, croppedImage as string);
			}

			const metaData = {
				bio: data.bio,
				userType: "candidate",
			};

			await user.update({ username });
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
					profilePicture: user.imageUrl,
					email: email,
					bio: data.bio,
				};

				await axios.post(
					"/api/save-candidate-data/",
					userProfileData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
			}
			toast.success("Profile Successfully Created");
			setIsOnboardingModalOpen(false);
            clearLocalStorage();
		} catch (error: any) {
			console.error("Failed to update user details:", error);
			console.error("Response status:", error.response.status);
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
							className="bg-white p-4 rounded-xl sm:mx-auto w-full max-w-[400px] shadow-xl cursor-default relative overflow-hidden"
						>
							<div className="relative z-10 w-full">
								<div className="flex flex-col items-center justify-center rounded-t w-full pt-5">
									{currentScreen == 0 && (
										<>
											<img
												src={brandIcon}
												alt="brandLogo"
												className="size-24 aspect-auto mb-1"
											/>
										</>
									)}
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
										className={clsx({
											"h-[230px]": currentScreen === 0,
											"h-[400px] sm:h-[360px]": currentScreen === 1,
										})}
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
												disabled={
													!isValid ||
													!isFirstScreenValid ||
													isCheckingUsername ||
													!isValidUsername(username)
												}
												className="flex w-full items-center justify-center gap-2 text-sm px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors ml-auto"
											>
												Continue <HiMiniChevronRight className="size-5" />
											</button>
										) : (
											<button
												type="submit"
												disabled={!isValid || isSubmitting}
												className="flex w-full items-center justify-center gap-2 text-sm px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors ml-auto"
											>
												{isSubmitting ? (
													<>
														<span>{loadingMsg}</span>
														<Spinner />
													</>
												) : (
													<>
														Create Profile
														<HiOutlineArrowRight className="size-4" />
													</>
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
