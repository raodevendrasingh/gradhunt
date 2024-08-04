// hooks
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useCitySearch } from "@/hooks/useCitySearch";

// Third-party libraries
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import Select from "react-select";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiOutlineXMark } from "react-icons/hi2";
import { HiOutlineInformationCircle } from "react-icons/hi2";

interface FormData {
	description: string;
}

export const UserAboutModal: React.FC<{
	onSave: () => void;
	setAboutModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setAboutModal, onSave }) => {
	const [description, setDescription] = useState("");
	const maxChars = 2000;
	const { isSignedIn, user } = useUser();
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const description: FormData = {
            description: data.description.replace(/\n/g, '\\n').replace(/\s/g, ' ')
        };

		console.log(description);

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `api/add-user-about-data`;
			const response = await axios.post(url, description, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("About Updated");
			onSave();
			setAboutModal(false);
		} catch (error: any) {
			toast.error("Error occured while aupdating about. Try again!");
			if (error.response) {
				console.log("Error Status: ", error.response.status);
				console.log("Error Message: ", error.message);
				console.log("Error Response: ", error.response);
			} else if (error.request) {
				console.log("Error Request: ", error.request);
			} else {
				console.log("Error Message: ", error.message);
			}
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};

	return (
		isSignedIn && (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setAboutModal(false)}
					className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer "
				>
					<motion.div
						initial={{ scale: 0.9, rotate: "0deg" }}
						animate={{ scale: 1, rotate: "0deg" }}
						exit={{ scale: 0, rotate: "0deg" }}
						onClick={(e) => e.stopPropagation()}
						className="bg-white p-4 rounded-2xl sm:mx-auto w-full max-w-[350px] xs:max-w-md sm:max-w-lg  shadow-xl cursor-default relative overflow-hidden"
					>
						<div className="relative z-10 ">
							<div className="flex items-start justify-between ml-1 rounded-t">
								<h3 className="text-xl font-semibold text-gray-800 mt-1">
									Edit About
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setAboutModal(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<div className=" max-h-[70vh] overflow-y-auto">
								<div className="p-3 pb-6">
									<div className="flex flex-col gap-3">
										<form id="aboutDataForm" onSubmit={handleSubmit(onSubmit)}>
											{/* description section */}
											<div className="flex flex-col gap-5">
												<div className="flex items-start gap-2">
													<span className="size-8 pt-0.5">
														<HiOutlineInformationCircle className="size-5 text-gray-600 " />
													</span>
													<p className="text-sm font-light">
														Describe your years of experience, the industry you
														are part of, and your skills. Additionally, sharing
														your achievements and past job experiences can
														provide more insight.
													</p>
												</div>
												<div className="flex flex-col w-full">
													<textarea
														{...register("description", {
															required: "About is required",
															minLength: {
																value: 25,
																message: "Minimum 25 characters are required",
															},
															maxLength: {
																value: 2000,
																message:
																	"Description should not exceed 2000 characters",
															},
														})}
														name="description"
														id="description"
														value={description}
														onChange={handleInputChange}
														maxLength={maxChars}
														placeholder=""
														rows={8}
														style={{ whiteSpace: "pre-wrap" }}
														className="w-full px-2 py-1.5 text-sm border rounded-lg border-gray-400"
													></textarea>
													<div className="flex relative">
														{errors.description && (
															<span className="form-error" role="alert">
																{errors.description.message as string}
															</span>
														)}
														<span className="absolute right-0 text-xs text-gray-600">
															({maxChars - description.length}/{maxChars})
														</span>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
							{/*footer*/}
							<div className="flex items-center justify-end mt-3 rounded-b">
								<button
									className="bg-zinc-800 text-white active:bg-green-700 font-semibold border rounded-[10px] text-sm px-4 py-2 shadow hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150"
									type="submit"
									form="aboutDataForm"
								>
									Save
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};
