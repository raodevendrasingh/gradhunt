// hooks
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

// Third-party libraries
import { SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { FaCircleInfo } from "react-icons/fa6";
import { HiOutlineXMark } from "react-icons/hi2";

import { FormFooter } from "@/components/ui/FormFooter";
import { useFetchAboutSection } from "@/hooks/useFetchAboutData";

interface FormData {
	description: string;
}

export const UserAboutModal: React.FC<{
	setAboutModal: React.Dispatch<React.SetStateAction<boolean>>;
	onSave: () => void;
}> = ({ setAboutModal, onSave }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [description, setDescription] = useState("");
	const maxChars = 2000;
	const { getToken } = useAuth();

	const { data: userDesc, isLoading: isAboutLoading } = useFetchAboutSection();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	useEffect(() => {
		if (userDesc && userDesc.description.length > 0) {
			setDescription(userDesc.description);
		}
	}, [userDesc]);

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		setIsLoading(true);
		const description: FormData = {
			description: data.description.replace(/\n/g, "\\n").replace(/\s/g, " "),
		};

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/add-user-desc`;
			const response = await axios.post(url, description, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Description Updated");
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
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
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
												<div className="flex flex-col">
													<div className="flex items-center gap-2 w-full">
														<span className="size-8 pt-0.5">
															<FaCircleInfo className="size-5 text-gray-600 " />
														</span>
														<p className="text-sm">
															Describe your years of experience, the industry
															you are part of, and your skills.
														</p>
													</div>
													<p className="text-sm">
														Additionally, sharing your achievements and past job
														experiences can provide more insight.
													</p>
												</div>
											</div>
											{isAboutLoading ? (
												<div className="flex flex-col justify-start gap-2 w-full h-52 rounded-xl border p-3">
													<div className="h-5 w-full skeleton" />
													<div className="h-5 w-full skeleton" />
													<div className="h-5 w-1/2 skeleton" />
												</div>
											) : (
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
														className="border py-2 rounded-md border-gray-200 w-full"
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
											)}
										</div>
									</form>
								</div>
							</div>
						</div>
						{/*footer*/}
						<FormFooter isLoading={isLoading} formId="aboutDataForm" />
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
