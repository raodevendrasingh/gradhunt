// hooks
import { useEffect, useState } from "react";
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
import { CertificateForm } from "@/types/userTypes";
import { useFetchCertificateDataById } from "@/hooks/useFetchCertificateDataById";
import Spinner from "@/components/ui/Spinner";

export const EditCertificateModal: React.FC<{
	setShowEditCertifyModal: React.Dispatch<React.SetStateAction<boolean>>;
	certificateId: number;
	onSave: () => void;
}> = ({ setShowEditCertifyModal, certificateId, onSave }) => {
	const [isExpired, setIsExpired] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isDeleted, setIsDeleted] = useState<boolean>(false);
	const { getToken } = useAuth();

	const { data: certificateIdData } = useFetchCertificateDataById({
		certificateId: certificateId,
	});

	console.log(certificateIdData);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CertificateForm>();

	useEffect(() => {
		if (certificateIdData && !isDeleting && !isDeleted) {
			const data = certificateIdData;
			reset({
				certificateName: data.certificateName,
				issuerOrg: data.issuerOrg,
				credentialUrl: data.credentialUrl,
				credentialId: data.credentialId,
				isValid: data.isValid,
				startMonth: { value: data.startMonth, label: data.startMonth },
				startYear: { value: data.startYear, label: data.startYear },
				endMonth: data.endMonth
					? { value: data.endMonth, label: data.endMonth }
					: null,
				endYear: data.endYear
					? { value: data.endYear, label: data.endYear }
					: null,
			});
		}
	}, [reset, certificateIdData]);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/users/certificates/${certificateId}`;
			await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Certificate Deleted");
			setIsDeleted(true);
			onSave();
			setShowEditCertifyModal(false);
		} catch (error: any) {
			console.error("Delete error:", error);
			toast.error("Failed to delete certificate. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const onSubmit: SubmitHandler<CertificateForm> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/users/certificates/${certificateId}`;
			const response = await axios.patch(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("Certificate Added");
			onSave();
			setShowEditCertifyModal(false);
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
								onClick={() => setShowEditCertifyModal(false)}
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
										id="certificateEditDataForm"
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
													{...register("certificateName", {
														required: "Certificate name is required",
														minLength: {
															value: 2,
															message:
																"Certificate name shoud be alteast 2 characters",
														},
														maxLength: 50,
													})}
													aria-invalid={
														errors.certificateName ? "true" : "false"
													}
													type="text"
													name="certificateName"
													id="certificateName"
													placeholder="Certificate Title"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.certificateName && (
													<span className="form-error" role="alert">
														{errors.certificateName.message as string}
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
														required: "Organization name is required",
														minLength: {
															value: 2,
															message:
																"Organization name shoud be alteast 2 characters",
														},
														maxLength: 50,
													})}
													aria-invalid={errors.issuerOrg ? "true" : "false"}
													type="text"
													name="issuerOrg"
													id="issuerOrg"
													placeholder="Organization Name"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.issuerOrg && (
													<span className="form-error" role="alert">
														{errors.issuerOrg.message as string}
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
													{...register("credentialId", {
														pattern: {
															value: /^[a-zA-Z0-9]+$/,
															message:
																"Please enter a valid credential ID (alphanumeric characters only)",
														},
													})}
													aria-invalid={errors.credentialId ? "true" : "false"}
													name="credentialId"
													type="text"
													id="credentialId"
													placeholder="Credential ID"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.credentialId && (
													<span className="form-error" role="alert">
														{errors.credentialId.message}
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
													{...register("credentialUrl", {
														pattern: {
															value:
																/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
															message: "Please enter a valid URL",
														},
													})}
													aria-invalid={errors.credentialUrl ? "true" : "false"}
													name="credentialUrl"
													type="text"
													id="credentialUrl"
													placeholder="e.g. https://example.com/"
													className="border py-2 rounded-md border-gray-200 w-full"
												/>
												{errors.credentialUrl && (
													<span className="form-error" role="alert">
														{errors.credentialUrl.message}
													</span>
												)}
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						{/*footer*/}
						<div className="flex items-center justify-between mt-3 rounded-b">
							<button
								className="flex items-center justify-center w-28 text-red-500 font-semibold rounded-lg text-sm px-4 py-2.5 outline-none focus:outline-none disabled:text-red-400 cursor-pointer ease-linear transition-colors duration-150"
								form="certificateEditDataForm"
								type="button"
								onClick={handleDelete}
								disabled={isLoading || isDeleting}
							>
								{isDeleting ? <Spinner color="red" /> : "Delete"}
							</button>
							<button
								className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:shadow-none shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
								type="submit"
								form="certificateEditDataForm"
								disabled={isLoading || isDeleting}
							>
								{isLoading ? (
									<span className="flex items-center">
										<Spinner />
									</span>
								) : (
									"Update"
								)}
							</button>
						</div>{" "}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
