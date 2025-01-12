// hooks
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

// Third-party libraries
import { SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiOutlineXMark } from "react-icons/hi2";

// Local imports
import { DurationFields } from "@/helpers/DurationFields";
import { CertificateData } from "@/types/userTypes";
import { FormFooter } from "@/components/ui/FormFooter";
import { apiUrl } from "./OnboardingModal";

export const AddCertificateModal: React.FC<{
	setShowCertifyModal: React.Dispatch<React.SetStateAction<boolean>>;
	onSave: () => void;
}> = ({ setShowCertifyModal, onSave }) => {
	const [isExpired, setIsExpired] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CertificateData>();

	const onSubmit: SubmitHandler<CertificateData> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `${apiUrl}/api/users/certificates`;
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// console.log(response.data);
			toast.success("Certificate Added");
			setShowCertifyModal(false);
			onSave();
		} catch (error: any) {
			toast.error("Error occured while adding certificate. Try again!");
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
								Add Licence & Certifications
							</h3>
							<button
								className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowCertifyModal(false)}
							>
								<span className="bg-transparent text-gray-800">
									<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
								</span>
							</button>
						</div>
						<div className=" max-h-[70vh] overflow-y-auto">
							<div className="p-3">
								<div className="flex flex-col gap-3">
									<form
										onSubmit={handleSubmit(onSubmit)}
										id="certificateDataForm"
									>
										{/* main section */}
										<div className="flex flex-col w-full gap-3">
											{/* company name */}
											<div className="w-full flex flex-col">
												<label
													htmlFor="certificateName"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Certificate Title
												</label>
												<input
													{...register(
														"certificateName",
														{
															required:
																"Certificate name is required",
															minLength: {
																value: 2,
																message:
																	"Certificate name shoud be alteast 2 characters",
															},
															maxLength: 50,
														}
													)}
													aria-invalid={
														errors.certificateName
															? "true"
															: "false"
													}
													type="text"
													name="certificateName"
													id="certificateName"
													placeholder="Certificate Title"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.certificateName && (
													<span
														className="form-error"
														role="alert"
													>
														{
															errors
																.certificateName
																.message as string
														}
													</span>
												)}
											</div>
											<div className="w-full flex flex-col">
												<label
													htmlFor="issuerOrg"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Issuing Authority
												</label>
												<input
													{...register("issuerOrg", {
														required:
															"Organization name is required",
														minLength: {
															value: 2,
															message:
																"Organization name shoud be alteast 2 characters",
														},
														maxLength: 50,
													})}
													aria-invalid={
														errors.issuerOrg
															? "true"
															: "false"
													}
													type="text"
													name="issuerOrg"
													id="issuerOrg"
													placeholder="Organization Name"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.issuerOrg && (
													<span
														className="form-error"
														role="alert"
													>
														{
															errors.issuerOrg
																.message as string
														}
													</span>
												)}
											</div>
										</div>

										{/* project duration */}
										<hr className="my-5" />
										<DurationFields
											checkedTitle="This certificate doesn't expire"
											name="isValid"
											startTitle="Valid From"
											endTitle="Valid Till"
											control={control}
											register={register}
											setEndDate={setIsExpired}
											endDate={isExpired}
											errors={errors}
										/>

										{/* credential */}
										<hr className="my-5" />
										<div className="flex flex-col items-center w-full gap-3">
											<div className="w-full flex flex-col">
												<label
													htmlFor="credentialId"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Credential ID
												</label>
												<input
													{...register(
														"credentialId",
														{
															pattern: {
																value: /^[a-zA-Z0-9]+$/,
																message:
																	"Please enter a valid credential ID (alphanumeric characters only)",
															},
														}
													)}
													aria-invalid={
														errors.credentialId
															? "true"
															: "false"
													}
													name="credentialId"
													type="text"
													id="credentialId"
													placeholder="Credential ID"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.credentialId && (
													<span
														className="form-error"
														role="alert"
													>
														{
															errors.credentialId
																.message
														}
													</span>
												)}
											</div>
											<div className="w-full flex flex-col">
												<label
													htmlFor="credentialUrl"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Credential Link
												</label>
												<input
													{...register(
														"credentialUrl",
														{
															pattern: {
																value: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
																message:
																	"Please enter a valid URL",
															},
														}
													)}
													aria-invalid={
														errors.credentialUrl
															? "true"
															: "false"
													}
													name="credentialUrl"
													type="text"
													id="credentialUrl"
													placeholder="e.g. https://example.com/"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.credentialUrl && (
													<span
														className="form-error"
														role="alert"
													>
														{
															errors.credentialUrl
																.message
														}
													</span>
												)}
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						{/*footer*/}
						<FormFooter
							isLoading={isLoading}
							formId="certificateDataForm"
						/>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
