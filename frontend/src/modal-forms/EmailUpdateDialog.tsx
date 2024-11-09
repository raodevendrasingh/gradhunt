// hooks
import { useAuth, useUser } from "@clerk/clerk-react";

// Third-party libraries
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiMiniChevronRight, HiOutlineXMark } from "react-icons/hi2";
import { useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useEmailCheck } from "@/hooks/useEmailCheck";

type EmailForm = {
	email: string;
};

export const EmailUpdateDialog: React.FC<{
	setShowEmailDialog: React.Dispatch<React.SetStateAction<boolean>>;
	onSave: () => void;
}> = ({ setShowEmailDialog, onSave }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { getToken } = useAuth();
	const { user, isSignedIn } = useUser();
	const [currentScreen, setCurrentScreen] = useState<number>(0);
	const [slideDirection, setSlideDirection] = useState<number>(0);
	const [emailObj, setEmailObj] = useState<any>();

	const { isValidEmail, isCheckingEmail, emailMsg, checkEmail } =
		useEmailCheck();

	const {
		register,
		watch,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm<EmailForm>({
		defaultValues: {
			email: user?.emailAddresses[0].emailAddress!,
		},
	});

	const email = watch("email");

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return (
					<EmailScreen
						register={register}
						isCheckingEmail={isCheckingEmail}
						checkEmail={checkEmail}
						getDisplayMessage={getDisplayMessage}
					/>
				);
			case 1:
				return (
					<VerifyEmailScreen
						email={email}
						setCurrentScreen={setCurrentScreen}
						onVerify={verifyCodeAndUpdate}
						isSubmitting={isSubmitting}
					/>
				);
			default:
				return null;
		}
	};

	const getDisplayMessage = () => {
		if (email.length < 4) {
			return (
				<p className="text-light font-normal text-sm text-gray-600">
					Update your email!
				</p>
			);
		}
		if (errors.email) {
			return (
				<p className="text-red-500 text-sm" role="alert">
					{errors.email.message}
				</p>
			);
		}
		if (email && !isValidEmail(email)) {
			return (
				<p className="text-red-500 text-sm">
					Email can only contain lowercase letters and digits (max 16
					characters)
				</p>
			);
		}
		if (emailMsg) {
			return <p className="text-sm text-red-500">{emailMsg}</p>;
		}
		return null;
	};

	const handleNext = async (e: React.MouseEvent) => {
		e.preventDefault();
		const isValid = await trigger();
		if (isValid && user) {
			try {
				setIsSubmitting(true);
				
				// Check if email already exists for user
				const existingEmail = user.emailAddresses.find(
					(e) => e.emailAddress === email
				);
				
				if (existingEmail) {
					toast.error("This email is already associated with your account");
					return;
				}

				// Create new email address
				const emailRes = await user.createEmailAddress({
					email: email,
				});

				// Store email object reference
				const emailAddress = user.emailAddresses.find(
					(a) => a.id === emailRes.id
				);
				setEmailObj(emailAddress);

				// Prepare verification (this sends the code)
				await emailAddress?.prepareVerification({
					strategy: "email_code",
				});

				setSlideDirection(1);
				setCurrentScreen((prev) => prev + 1);
				
				toast.success("Verification code sent to your email");
			} catch (error: any) {
				if (error.errors?.[0]?.message) {
					toast.error(error.errors[0].message);
				} else {
					toast.error(error.message || "Failed to send verification code");
				}
				console.error(error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const verifyCodeAndUpdate = async (code: string) => {
		if (!emailObj) {
			toast.error("Email verification not initialized");
			return;
		}

		try {
			setIsSubmitting(true);
			const verificationResult = await emailObj.attemptVerification({
				code,
			});

			if (verificationResult.verification.status === "verified") {
				const token = await getToken();
				const url = `/api/users/email`;
				await axios.patch(
					url,
					{ email },
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				toast.success("Email updated successfully");
				setShowEmailDialog(false);
				onSave();
			} else {
				toast.error("Invalid verification code");
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to verify email");
			console.error(error);
		} finally {
			setIsSubmitting(false);
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
						className="bg-white p-4 rounded-2xl mx-auto w-full min-w-72 max-w-96 shadow-xl cursor-default relative overflow-hidden"
					>
						<div className="relative z-10">
							<div className="flex items-start justify-between ml-1 rounded-t">
								<h3 className="text-xl font-semibold text-gray-800 mt-1">
									Update Email
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowEmailDialog(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<div className="max-h-[30vh] overflow-y-auto">
								<div className="flex flex-col gap-3">
									<form onSubmit={handleSubmit(() => {})}>
										<motion.div
											key={currentScreen}
											initial={{ x: slideDirection * 50, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: -slideDirection * 50, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="h-[140px]"
										>
											<div className="p-3">{renderScreen()}</div>
										</motion.div>
										<div className="flex items-center justify-center mt-4">
											{currentScreen === 0 ? (
												<Button
													type="button"
													onClick={handleNext}
													disabled={
														isCheckingEmail ||
														!isValidEmail(email)
													}
													className="flex w-full items-center justify-center gap-2 text-sm px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors ml-auto"
												>
													Verify Email <HiMiniChevronRight className="size-5" />
												</Button>
											) : null}
										</div>
									</form>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};

export const EmailScreen: React.FC<{
	register: any;
	isCheckingEmail: boolean;
	checkEmail: (value: string) => void;
	getDisplayMessage: () => React.ReactNode;
}> = ({ register, isCheckingEmail, checkEmail, getDisplayMessage }) => {
	return (
		<div className="flex flex-col items-center w-full py-5 pb-8">
			<div className="flex flex-col w-full">
				<label
					htmlFor="email"
					className="text-sm font-medium text-gray-700 pb-1"
				>
					Email
				</label>
				<input
					{...register("email", {
						required: true,
						maxLength: 16,
						onChange: (e: { target: { value: string } }) =>
							checkEmail(e.target.value),
					})}
					aria-label="Update your email"
					placeholder="email"
					className="w-full py-2.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200"
					title="Update your email!"
				/>
			</div>

			<div className="py-3 w-full px-1">
				<div className="flex flex-col justify-start overflow-hidden">
					{isCheckingEmail && (
						<span className="flex items-center gap-2">
							<Spinner color="black" />
							<span className="text-xs text-gray-500">Searching...</span>
						</span>
					)}
					{getDisplayMessage()}
				</div>
			</div>
		</div>
	);
};

export const VerifyEmailScreen: React.FC<{
	email: string;
	setCurrentScreen: React.Dispatch<React.SetStateAction<number>>;
	onVerify: (code: string) => void;
	isSubmitting: boolean;
}> = ({ email, setCurrentScreen, onVerify, isSubmitting }) => {
	const [verificationCode, setVerificationCode] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onVerify(verificationCode);
	};

	return (
		<div className="flex flex-col items-center w-full py-5 pb-8">
			<div className="flex flex-col w-full">
				<label
					htmlFor="verificationCode"
					className="text-sm font-medium text-gray-700 pb-1"
				>
					Enter the verification code sent to {email}
				</label>
				<input
					type="text"
					id="verificationCode"
					value={verificationCode}
					onChange={(e) => setVerificationCode(e.target.value)}
					maxLength={6}
					placeholder="Enter 6-digit code"
					className="w-full py-2.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200"
				/>
			</div>

			<div className="py-3 w-full px-1">
				<div className="flex items-center justify-between w-full gap-2">
					<Button
						type="button"
						variant="secondary"
						onClick={() => setCurrentScreen(0)}
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						Change Email
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={verificationCode.length !== 6 || isSubmitting}
						className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? <Spinner /> : "Verify"}
					</Button>
				</div>
			</div>
		</div>
	);
};
