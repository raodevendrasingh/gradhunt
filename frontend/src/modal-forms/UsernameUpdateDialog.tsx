// hooks
import { useAuth, useUser } from "@clerk/clerk-react";

// Third-party libraries
import { SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiOutlineXMark } from "react-icons/hi2";
import { useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";

type UsernameForm = {
	username: string;
};

export const UsernameUpdateDialog: React.FC<{
	setShowUsernameDialog: React.Dispatch<React.SetStateAction<boolean>>;
	currentUsername: string;
}> = ({ setShowUsernameDialog, currentUsername }) => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { getToken } = useAuth();
	const { user, isSignedIn } = useUser();

	const { isValidUsername, isCheckingUsername, usernameMsg, checkUsername } =
		useUsernameCheck();

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<UsernameForm>({
		defaultValues: {
			username: currentUsername,
		},
	});

	const username = watch("username");

	const getDisplayMessage = () => {
		if (username.length < 4) {
			return (
				<p className="text-light font-normal text-sm text-gray-600">
					Update your username!
				</p>
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

	const onSubmit: SubmitHandler<UsernameForm> = async (data) => {
		setIsSubmitting(true);
		try {
			if (!user) {
				throw new Error("User is not defined");
			}

			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			await user.update({ username });
			const url = `/api/users/username`;
			await axios.patch(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Username updated successfully");
			setShowUsernameDialog(false);
		} catch (error: any) {
			toast.error("Error occured while updating username. Try again!");
			if (error.response) {
				console.log("Error Status: ", error.response.status);
				console.log("Error Message: ", error.message);
				console.log("Error Response: ", error.response);
			} else if (error.request) {
				console.log("Error Request: ", error.request);
			} else {
				console.log("Error Message: ", error.message);
			}
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
									Update Username
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowUsernameDialog(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<div className="max-h-[30vh] overflow-y-auto">
								<div className="flex flex-col gap-3">
									<form onSubmit={handleSubmit(onSubmit)}>
										<div className="flex flex-col items-center w-full py-5 pb-8">
											<div className="flex flex-col w-full">
												<label
													htmlFor="username"
													className="text-sm font-medium text-gray-700 pb-1"
												>
													Username
												</label>
												<input
													{...register("username", {
														required: true,
														maxLength: 16,
														onChange: (e: { target: { value: string } }) =>
															checkUsername(e.target.value),
													})}
													aria-label="Grab your username"
													placeholder="username"
													className="w-full py-2.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200"
													title="Update your username!"
												/>
											</div>

											<div className="py-3 w-full px-1  -teal-600">
												<div className="flex flex-col justify-start overflow-hidden">
													{isCheckingUsername && (
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
										</div>
										<Button
											variant="primary"
											type="submit"
											disabled={isSubmitting}
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
