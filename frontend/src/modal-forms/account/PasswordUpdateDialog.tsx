// hooks
import { useAuth, useUser } from "@clerk/clerk-react";

// Third-party libraries
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiOutlineXMark } from "react-icons/hi2";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";

type PasswordForm = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export const PasswordUpdateDialog: React.FC<{
	setShowPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowPasswordDialog }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { getToken } = useAuth();
	const { user, isSignedIn } = useUser();

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<PasswordForm>({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const newPassword = watch("newPassword");
	const confirmPassword = watch("confirmPassword");

	const isFieldsValid =
		newPassword.length > 0 &&
		confirmPassword.length > 0 &&
		newPassword === confirmPassword;

	const onSubmit: SubmitHandler<PasswordForm> = async (data) => {
		setIsSubmitting(true);
		try {
			if (!user) {
				throw new Error("User is not defined");
			}

			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const params = {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			};

			await user.updatePassword(params);

			toast.success("Password updated successfully");
			setShowPasswordDialog(false);
		} catch (error: any) {
			toast.error("Passwords do not match. Try again!");
			console.log(error.response);
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
						<div className="relative z-10 ">
							<div className="flex items-start justify-between ml-1 rounded-t">
								<h3 className="text-xl font-semibold text-gray-800 mt-1">
									{user?.passwordEnabled ? "Update" : "Create"}
									<span className="pl-1">Password</span>
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowPasswordDialog(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<div className=" overflow-y-auto">
								<div className="flex flex-col gap-3">
									<form onSubmit={handleSubmit(onSubmit)}>
										<div className="flex flex-col items-center w-full pb-8">
											<div className="flex flex-col w-full space-y-5 p-3">
												<div>
													{user?.passwordEnabled && (
														<TextInput
															label="Current Password"
															name="currentPassword"
															type="password"
															register={register}
															error={errors.currentPassword?.message}
														/>
													)}
												</div>

												<TextInput
													label="New Password"
													name="newPassword"
													type="password"
													register={register}
													error={errors.newPassword?.message}
													validationRules={{
														pattern: {
															value: /^(?:[a-zA-Z0-9@$!%*?&]+)$/,
															message:
																"Must contain at least one of the following: small letter, capital letter, number, special character",
														},
													}}
												/>
												<TextInput
													label="Confirm Password"
													name="confirmPassword"
													type="password"
													register={register}
													error={errors.confirmPassword?.message}
													validationRules={{
														pattern: {
															value: /^(?:[a-zA-Z0-9@$!%*?&]+)$/,
															message: "Passwords do not match!",
														},
													}}
												/>
											</div>
										</div>
										<Button
											variant="primary"
											type="submit"
											disabled={isSubmitting || !isFieldsValid}
											className="flex w-full items-center justify-center gap-2 text-sm px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-900/70 disabled:cursor-not-allowed transition-colors ml-auto"
										>
											{isSubmitting ? <Spinner /> : <>Update</>}
										</Button>
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
