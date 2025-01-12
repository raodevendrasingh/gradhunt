// hooks
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

// external packages
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Player } from "@lottiefiles/react-lottie-player";
import {
	HiMiniChevronLeft,
	HiMiniChevronRight,
	HiOutlineXMark,
} from "react-icons/hi2";
import { useEmailCheck } from "@/hooks/useEmailCheck";
import { TextInput } from "@/components/ui/TextInput";
import Spinner from "@/components/ui/Spinner";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { apiUrl } from "./OnboardingModal";

interface VerifyFormField {
	orgEmail: string;
	orgWebsite: string;
	verificationCode?: string;
	verifiedAt: Date;
}

export const VerifyEmploymentModal = ({
	setShowVerifyModal,
}: {
	setShowVerifyModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
	const [isVerifying, setIsVerifying] = useState<boolean>(false);
	const [currentScreen, setCurrentScreen] = useState<number>(0);
	const [slideDirection, setSlideDirection] = useState<number>(0);

	const { getToken } = useAuth();
	const { isSignedIn, user } = useUser();
	if (!user) {
		throw new Error("User is not defined");
	}

	const { isValidEmail, isCheckingEmail, emailMsg, checkEmail } =
		useEmailCheck();

	const {
		register,
		trigger,
		watch,
		formState: { errors, isValid },
	} = useForm<VerifyFormField>({
		mode: "onChange",
		defaultValues: {
			orgEmail: "",
			orgWebsite: "",
			verificationCode: "",
		},
	});

	const screensDesc = ["Enter Email", "Verify Email", "Success"];

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return (
					<OrgEmailScreen
						register={register}
						checkEmail={checkEmail}
						isCheckingEmail={isCheckingEmail}
						getDisplayMessage={getDisplayMessage}
					/>
				);
			case 1:
				return <VerifyEmailScreen register={register} />;
			case 2:
				return <FinalMessagePage />;
			default:
				return null;
		}
	};

	const getDisplayMessage = () => {
		if (orgEmail.length < 4) return;

		if (errors.orgEmail) {
			return (
				<p className="text-red-500 text-xs" role="alert">
					{errors.orgEmail.message}
				</p>
			);
		}
		if (orgEmail && !isValidEmail(orgEmail)) {
			return (
				<p className="text-red-500 text-xs">
					Email can only contain lowercase letters and digits (max 20
					characters)
				</p>
			);
		}
		if (emailMsg) {
			return <p className="text-xs text-red-500">{emailMsg}</p>;
		}
		return null;
	};

	const handleSendEmail = async (e: React.MouseEvent) => {
		setIsSendingEmail(true);
		e.preventDefault();
		const isValid = await trigger();
		if (!isValid) return;
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const formData = {
				email: orgEmail,
				website: orgWebsite,
			};
			const url = `${apiUrl}/api/users/send-verification-email`;
			await axios.post(url, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			setSlideDirection(1);
			setCurrentScreen((prev) => prev + 1);
		} catch (error: any) {
			toast.error("Error", {
				description: "Error sending email!",
			});
		} finally {
			setIsSendingEmail(false);
		}
	};

	const handlePreviousScreen = () => {
		setSlideDirection(0);
		setCurrentScreen((prev) => prev - 1);
	};

	const handleVerifyEmail = async (e: React.MouseEvent) => {
		setIsVerifying(true);
		e.preventDefault();
		const isValid = await trigger();
		if (!isValid) return;
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const formData = {
				verificationCode: verificationCode,
			};
			console.log(formData);
			const url = `${apiUrl}/api/users/verify-email`;
			const response = await axios.post(url, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			console.log(response);
			if (response.status === 200) {
				setSlideDirection(1);
				setCurrentScreen((prev) => prev + 1);
			}
		} catch (error: any) {
			toast.error("Error", {
				description: error.response.data.error,
			});
		} finally {
			setIsVerifying(false);
		}
	};

	const orgEmail = watch("orgEmail");
	const orgWebsite = watch("orgWebsite");
	const verificationCode = watch("verificationCode");

	const isFirstScreenValid =
		orgEmail.length > 3 && isValidEmail(orgEmail) && !emailMsg;

	return (
		isSignedIn && (
			<AnimatePresence>
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
							<div className="flex items-start justify-between ml-1 rounded-t">
								<h3 className="text-xl font-semibold text-gray-800 mt-1">
									Verify Your Employment
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowVerifyModal(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>

							<form>
								<motion.div
									key={currentScreen}
									initial={{
										x: slideDirection * 50,
										opacity: 0,
									}}
									animate={{ x: 0, opacity: 1 }}
									exit={{
										x: -slideDirection * 50,
										opacity: 0,
									}}
									transition={{ duration: 0.3 }}
									className="h-[300px]"
								>
									<div className="p-3">
										<div className="flex flex-col gap-3">
											{renderScreen()}
										</div>
									</div>
								</motion.div>
								<div className="flex items-center justify-center mt-4">
									{currentScreen < screensDesc.length - 2 ? (
										<button
											type="button"
											onClick={handleSendEmail}
											disabled={
												!isValid ||
												!isFirstScreenValid ||
												isCheckingEmail
											}
											className="flex w-full items-center justify-center gap-2 text-sm px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors ml-auto"
										>
											{isSendingEmail ? (
												<Spinner />
											) : (
												<>
													Continue
													<HiMiniChevronRight className="size-5" />
												</>
											)}
										</button>
									) : currentScreen <
									  screensDesc.length - 1 ? (
										<div className="flex items-center justify-center w-full gap-2">
											<Button
												variant="secondary"
												onClick={handlePreviousScreen}
												className="w-1/2 rounded-lg py-2.5 gap-2"
											>
												<HiMiniChevronLeft className="size-5" />
												Back
											</Button>
											<Button
												variant="primary"
												onClick={handleVerifyEmail}
												disabled={
													!isValid || isVerifying
												}
												className="w-1/2 rounded-lg py-2.5 gap-2"
											>
												{isVerifying ? (
													<Spinner />
												) : (
													<>
														Verify
														<HiMiniChevronRight className="size-5" />
													</>
												)}
											</Button>
										</div>
									) : (
										<button
											type="submit"
											className="flex w-full items-center justify-center text-sm px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors ml-auto"
											onClick={() =>
												setShowVerifyModal(false)
											}
										>
											Close
										</button>
									)}
								</div>
							</form>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};

export const OrgEmailScreen: React.FC<{
	register: any;
	checkEmail: (email: string) => void;
	isCheckingEmail: boolean;
	getDisplayMessage: () => React.ReactNode;
}> = ({ register, checkEmail, isCheckingEmail, getDisplayMessage }) => {
	return (
		<div className="flex flex-col items-center w-full py-5 pb-8">
			<div className="flex flex-col w-full space-y-3">
				<div className="flex flex-col space-y-1 h-24">
					<TextInput
						name="orgEmail"
						register={register}
						label="Enter Your Organization Email"
						placeholder="Your Company Email"
						onChange={(e) => checkEmail(e.target.value)}
						validationRules={{
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Invalid email format",
							},
						}}
					/>

					<div className="flex flex-col justify-start overflow-hidden pt-1">
						{isCheckingEmail && (
							<span className="flex items-center gap-2">
								<Spinner color="black" />
								<span className="text-xs text-gray-500">
									Searching...
								</span>
							</span>
						)}
						{getDisplayMessage()}
					</div>
				</div>
				<TextInput
					name="orgWebsite"
					register={register}
					label="Enter Your Organization Website"
					placeholder="https://yourcompany.com"
					validationRules={{
						required: "Website is required",
						pattern: {
							value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w.-](?:\/[\w.-]*)?$/,
							message: "Invalid URL format",
						},
					}}
				/>
			</div>
		</div>
	);
};

export const VerifyEmailScreen: React.FC<{
	register: any;
}> = ({ register }) => {
	const otpInputs = Array(6).fill("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const value = e.target.value;

		if (/^[0-9]$/.test(value)) {
			otpInputs[index] = value;
			if (index < 5) {
				document.getElementById(`otp-input-${index + 1}`)?.focus();
			}
		} else if (value === "") {
			if (index > 0) {
				document.getElementById(`otp-input-${index - 1}`)?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		if (
			e.key === "Backspace" &&
			index > 0 &&
			e.currentTarget.value === ""
		) {
			document.getElementById(`otp-input-${index - 1}`)?.focus();
		}
	};

	return (
		<div className="flex flex-col items-center w-full py-5 pb-8">
			<div className="flex flex-col w-full">
				<label
					htmlFor="verificationCode"
					className="text-sm font-medium text-gray-700 pb-8"
				>
					Enter the code sent to your work email
				</label>
				<div className="flex items-center justify-center gap-2">
					{otpInputs.map((_, index) => (
						<input
							key={index}
							id={`otp-input-${index}`}
							type="text"
							maxLength={1}
							className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 transition duration-200"
							onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleChange(e, index)
							}
							onKeyDown={(
								e: React.KeyboardEvent<HTMLInputElement>
							) => handleKeyDown(e, index)}
							{...register(`verificationCode[${index}]`, {
								required: "Verification code is required",
								pattern: {
									value: /^[0-9]$/,
									message: "Invalid digit",
								},
							})}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export const FinalMessagePage: React.FC = () => {
	return (
		<div className="flex items-center justify-center w-full p-4">
			<div className="flex flex-col items-center">
				<div className="w-32 h-32 mb-4">
					<Player
						loop
						autoplay
						src="https://lottie.host/dc928af9-e277-4cf5-aab8-f3cf6c4f59f6/41Wgp78Fzd.json"
						style={{ width: "100%", height: "100%" }}
					/>
				</div>
				<h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
					Email Verified!
				</h2>
				<p className="text-sm font-medium text-center text-gray-700">
					You have successfully verified your employment.
				</p>
			</div>
		</div>
	);
};
