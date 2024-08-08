// hooks
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

// Third-party libraries
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import Select from "react-select";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiOutlineXMark } from "react-icons/hi2";

// Local imports
import {
	monthOptions,
	startYearOptions,
	endYearOptions,
} from "@/utils/selectObjects";
import { selectCompanyFieldStyle } from "@/utils/styles";

interface FormData {
	certificateName: string;
	issuerOrg: string;
	credentialUrl: string;
	credentialId: string;
	isValid: boolean;
	startMonth: string;
	startYear: number;
	endMonth: string | null;
	endYear: number | null;
}

export const AddAchieveModal: React.FC<{
	onSave: () => void;
	setShowCertifyModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowCertifyModal, onSave }) => {
	const [isExpired, setIsExpired] = useState(false);
	const { isSignedIn, user } = useUser();
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const ceritificateData: FormData = {
			certificateName: data.certificateName,
			issuerOrg: data.issuerOrg,
			isValid: data.isValid,
			startMonth: data.startMonth,
			startYear: data.startYear,
			endMonth: data.endMonth,
			endYear: data.endYear,
			credentialUrl: data.credentialUrl,
			credentialId: data.credentialId,
		};

		console.log(ceritificateData);

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/add-certificate-data`;
			const response = await axios.post(url, ceritificateData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("Certificate Added");
			onSave();
			setShowCertifyModal(false);
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
		}
	};

	return (
		isSignedIn && (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					// onClick={() => setShowCertifyModal(false)}
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
											id="educationDataForm"
											onSubmit={handleSubmit(onSubmit)}
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
														className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-blue-500"
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
														className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-blue-500"
													/>
													{errors.issuerOrg && (
														<span className="form-error" role="alert">
															{errors.issuerOrg.message as string}
														</span>
													)}
												</div>
											</div>

											<hr className="my-5" />
											{/* project duration */}
											<div className="flex flex-col w-full gap-2">
												<div className="w-full flex items-center gap-2 pb-3">
													<input
														{...register("isValid")}
														type="checkbox"
														name="isValid"
														id="isValid"
														className="rounded size-5 focus:ring-[1px] focus:ring-blue-700"
														onClick={() => {
															setIsExpired(!isExpired);
														}}
													/>
													<label
														htmlFor="isValid"
														className="text-sm font-light select-none"
													>
														This certificate doesn&apos;t expire
													</label>
												</div>
												<div className="flex flex-col gap-1">
													<label
														htmlFor="startMonth"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Valid From
													</label>
													<div className="flex flex-col xs:flex-row gap-2">
														<div className="w-full xs:w-1/2 flex flex-col">
															<Controller
																name="startMonth"
																control={control}
																rules={{
																	required: "Start Month is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		id="startMonth"
																		options={monthOptions}
																		placeholder="Start Month"
																		styles={selectCompanyFieldStyle}
																		value={field.value as any}
																	/>
																)}
															/>
															{errors.startMonth && (
																<span className="form-error" role="alert">
																	{errors.startMonth.message as string}
																</span>
															)}
														</div>
														<div className="w-full xs:w-1/2 flex flex-col">
															<Controller
																name="startYear"
																control={control}
																rules={{
																	required: "Start Year is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		id="startYear"
																		options={startYearOptions}
																		placeholder="Start Year"
																		styles={selectCompanyFieldStyle}
																		value={field.value as any}
																	/>
																)}
															/>
															{errors.startYear && (
																<span className="form-error" role="alert">
																	{errors.startYear.message as string}
																</span>
															)}
														</div>
													</div>
												</div>
												{!isExpired && (
													<div className="flex flex-col gap-1">
														<label
															htmlFor="startMonth"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															Valid Till
														</label>
														<div className="flex flex-col xs:flex-row gap-2">
															<div className="w-full xs:w-1/2 flex flex-col">
																<Controller
																	name="endMonth"
																	control={control}
																	rules={{
																		required: "End Month is required",
																	}}
																	render={({ field }) => (
																		<Select
																			{...field}
																			id="endMonth"
																			options={monthOptions}
																			placeholder="End Month"
																			styles={selectCompanyFieldStyle}
																			value={field.value as any}
																		/>
																	)}
																/>
																{errors.endMonth && (
																	<span className="form-error" role="alert">
																		{errors.endMonth.message as string}
																	</span>
																)}
															</div>
															<div className="w-full xs:w-1/2 flex flex-col">
																<Controller
																	name="endYear"
																	control={control}
																	rules={{
																		required: "End Year is required",
																	}}
																	render={({ field }) => (
																		<Select
																			{...field}
																			id="endYear"
																			options={endYearOptions}
																			placeholder="End Year"
																			styles={selectCompanyFieldStyle}
																			value={field.value as any}
																		/>
																	)}
																/>
																{errors.endYear && (
																	<span className="form-error" role="alert">
																		{errors.endYear.message as string}
																	</span>
																)}
															</div>
														</div>
													</div>
												)}
											</div>

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
														aria-invalid={
															errors.credentialId ? "true" : "false"
														}
														name="credentialId"
														type="text"
														id="credentialId"
														placeholder="Credential ID"
														className="border px-2 py-2 text-sm rounded-lg border-gray-400 focus:border-blue-500"
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
														aria-invalid={
															errors.credentialUrl ? "true" : "false"
														}
														name="credentialUrl"
														type="text"
														id="credentialUrl"
														placeholder="e.g. https://example.com/"
														className="border px-2 py-2 text-sm rounded-lg border-gray-400 focus:border-blue-500"
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
							<div className="flex items-center justify-end mt-3 rounded-b">
								<button
									className="bg-zinc-800 text-white active:bg-green-700 font-semibold border rounded-[10px] text-sm px-4 py-2 shadow hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150"
									type="submit"
									form="educationDataForm"
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
