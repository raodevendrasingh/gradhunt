// hooks
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

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
	jobTitleOptions,
	employmentType,
	locationType,
} from "@/utils/selectObjects";
import { selectFieldStyle } from "@/utils/styles";
import { LocationSelect } from "@/helpers/LocationSelect";
import { ExperienceForm } from "@/types/userTypes";
import { DurationFields } from "@/helpers/DurationFields";
import { FormFooter } from "@/components/ui/FormFooter";

export const AddExpModal: React.FC<{
	setShowExpModal: React.Dispatch<React.SetStateAction<boolean>>;
	onSave: () => void;
}> = ({ setShowExpModal, onSave }) => {
	const [isCurrWorking, setIsCurrWorking] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ExperienceForm>();

	const onSubmit: SubmitHandler<ExperienceForm> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/users/experiences`;
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
            if (response.status !== 201) {
                throw new Error("Error occured while adding experience");
            }
			toast.success("Experience Added");
			onSave();
			setShowExpModal(false);
		} catch (error: any) {
			toast.error("Error occured while adding experience. Try again!");
			console.log("error", error);
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
				onClick={() => setShowExpModal(false)}
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
								Add Work Experience
							</h3>
							<button
								className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowExpModal(false)}
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
										id="experienceDataForm"
									>
										{/* section */}
										<div className="flex flex-col-reverse sm:flex-row items-center gap-3">
											<div className="flex flex-col w-full gap-3">
												{/* company name */}
												<div className="w-full flex flex-col">
													<label
														htmlFor="companyName"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Company Name
													</label>
													<input
														{...register("companyName", {
															required: "Company name is required",
															minLength: {
																value: 2,
																message:
																	"Company name shoud be alteast 2 characters",
															},
															maxLength: 50,
														})}
														aria-invalid={errors.companyName ? "true" : "false"}
														type="text"
														name="companyName"
														id="companyName"
														placeholder="Company Name"
														className="border py-2 rounded-md border-gray-200 w-full"
													/>
													{errors.companyName && (
														<span className="form-error" role="alert">
															{errors.companyName.message as string}
														</span>
													)}
												</div>
												<div className="w-full flex flex-col">
													<label
														htmlFor="jobTitle"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Job Title
													</label>
													<Controller
														name="jobTitle"
														control={control}
														rules={{
															required: "Job Title is required",
														}}
														render={({ field }) => (
															<Select
																{...field}
																id="jobTitle"
																options={jobTitleOptions}
																placeholder="Job Title"
																styles={selectFieldStyle}
																value={field.value as any}
																menuPlacement="auto"
															/>
														)}
													/>
													{errors.jobTitle && (
														<span className="form-error" role="alert">
															{errors.jobTitle.message as string}
														</span>
													)}
												</div>
												{/* job title and type */}
												<div className="flex flex-col xs:flex-row gap-3">
													<div className="w-full sm:w-1/2 flex flex-col">
														<label
															htmlFor="jobType"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															Employment Type
														</label>
														<Controller
															name="jobType"
															control={control}
															rules={{
																required: "Employment Type is required",
															}}
															render={({ field }) => (
																<Select
																	{...field}
																	id="jobType"
																	options={employmentType}
																	placeholder="Employment Type"
																	styles={selectFieldStyle}
																	value={field.value as any}
																	menuPlacement="auto"
																/>
															)}
														/>
														{errors.jobType && (
															<span className="form-error" role="alert">
																{errors.jobType.message as string}
															</span>
														)}
													</div>
													<div className="w-full xs:w-1/2 flex flex-col ">
														<label
															htmlFor="locationType"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															Location Type
														</label>
														<Controller
															name="locationType"
															control={control}
															rules={{
																required: "Location Type is required",
															}}
															render={({ field }) => (
																<Select
																	{...field}
																	id="locationType"
																	options={locationType}
																	placeholder="Location Type"
																	styles={selectFieldStyle}
																	value={field.value as any}
																	menuPlacement="auto"
																/>
															)}
														/>
														{errors.locationType && (
															<span className="form-error" role="alert">
																{errors.locationType.message as string}
															</span>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* employment duration */}
										<hr className="my-5" />
										<DurationFields
											checkedTitle="I'm currently working on this role"
											name="isCurrentlyWorking"
											startTitle="Start Date"
											endTitle="End Date"
											control={control}
											register={register}
											setEndDate={setIsCurrWorking}
											endDate={isCurrWorking}
											errors={errors}
										/>

										{/* company location and job type */}
										<hr className="my-5" />
										<div className="w-full flex flex-col">
											<label
												htmlFor="jobLocation"
												className="text-sm font-semibold text-gray-700 pb-1"
											>
												Location
											</label>
											<LocationSelect
												control={control}
												name="jobLocation"
												placeholder="Location"
												error={errors.jobLocation?.message}
												rules={{
													required: "Location is required",
												}}
												menuPlacement="auto"
											/>
										</div>

										{/* description section */}
										<hr className="my-5" />
										<div>
											<div className="flex flex-col w-full relative">
												<label
													htmlFor="description"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Description
													<span className="text-sm pl-1 font-light text-gray-500">
														(Optional)
													</span>
												</label>
												<textarea
													{...register("description", {
														minLength: {
															value: 10,
															message: "Minimum 10 characters are required",
														},
														maxLength: {
															value: 200,
															message:
																"Description should not exceed 1500 characters",
														},
													})}
													name="description"
													id="description"
													placeholder="Activities & Participation"
													rows={3}
													className="border py-2 rounded-md border-gray-200 w-full"
												></textarea>
												{errors.description && (
													<span className="form-error" role="alert">
														{errors.description.message as string}
													</span>
												)}
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						{/*footer*/}
						<FormFooter isLoading={isLoading} formId="experienceDataForm" />
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
