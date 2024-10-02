// hooks
import { useEffect, useState } from "react";
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
import { useFetchExperienceById } from "@/hooks/useFetchExperienceById";
import Spinner from "@/components/ui/Spinner";

export const EditExpModal: React.FC<{
	setShowEditExpModal: React.Dispatch<React.SetStateAction<boolean>>;
	experienceId: number;
	onSave: () => void;
}> = ({ setShowEditExpModal, experienceId, onSave }) => {
	const [isCurrWorking, setIsCurrWorking] = useState<boolean>(false);
	const [initialLocation, setInitialLocation] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isDeleted, setIsDeleted] = useState<boolean>(false);
	const { getToken } = useAuth();

	const { data: experienceIdData } = useFetchExperienceById({
		experienceId: experienceId,
	});

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ExperienceForm>();

	useEffect(() => {
		if (experienceIdData && !isDeleting && !isDeleted) {
			const data = experienceIdData;
			reset({
				companyName: data.companyName,
				jobTitle: { value: data.jobTitle, label: data.jobTitle },
				jobType: { value: data.jobType, label: data.jobType },
				startMonth: { value: data.startMonth, label: data.startMonth },
				startYear: { value: data.startYear, label: data.startYear },
				endMonth: data.endMonth
					? { value: data.endMonth, label: data.endMonth }
					: null,
				endYear: data.endYear
					? { value: data.endYear, label: data.endYear }
					: null,
				jobLocation: data.jobLocation,
				locationType: { value: data.locationType, label: data.locationType },
				description: data.description,
				isCurrentlyWorking: data.isCurrentlyWorking,
			});
			setIsCurrWorking(data.isCurrentlyWorking as boolean);
			setInitialLocation(data.jobLocation);
		}
	}, [experienceIdData, reset]);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/users/experiences/${experienceId}/`;
			await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Experience Deleted");
			setIsDeleted(true);
			onSave();
			setShowEditExpModal(false);
		} catch (error: any) {
			console.error("Delete error:", error);
			toast.error("Failed to delete experience. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const onSubmit: SubmitHandler<ExperienceForm> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/users/experiences/${experienceId}/`;
			await axios.patch(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Experience Updated");
			onSave();
			setShowEditExpModal(false);
		} catch (error: any) {
			toast.error("Error occured while updating experience. Try again!");
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
								Edit Work Experience
							</h3>
							<button
								className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowEditExpModal(false)}
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
										id="editExperienceDataForm"
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
												{/* job title and type */}
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
													<div className="w-full xs:w-1/2 flex flex-col">
														<label
															htmlFor="locationType"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															Work Type
														</label>
														<Controller
															name="locationType"
															control={control}
															rules={{
																required: "Work Type is required",
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
											control={control}
											register={register}
											name="isCurrentlyWorking"
											checkedTitle="I'm currently working on this role"
											setEndDate={setIsCurrWorking}
											endDate={isCurrWorking}
											startTitle="Start Date"
											endTitle="End Date"
											errors={errors}
										/>

										{/* company location and job type */}
										<hr className="my-5" />
										<div className="w-full flex flex-col">
											<label
												htmlFor="jobLocation"
												className="text-sm font-semibold text-gray-700 pb-1"
											>
												Job Location
											</label>
											<LocationSelect
												control={control}
												name="jobLocation"
												placeholder="Location"
												error={errors.jobLocation?.message}
												rules={{
													required: "Job Location is required",
												}}
												menuPlacement="auto"
												initialValue={initialLocation}
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
						<div className="flex items-center justify-between mt-3 rounded-b">
							<button
								className="flex items-center justify-center w-28 text-red-500 font-semibold rounded-lg text-sm px-4 py-2.5 outline-none focus:outline-none disabled:text-red-400 cursor-pointer ease-linear transition-colors duration-150"
								form="editExperienceDataForm"
								type="button"
								onClick={handleDelete}
								disabled={isLoading || isDeleting}
							>
								{isDeleting ? <Spinner color="red" /> : "Delete"}
							</button>
							<button
								className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
								type="submit"
								form="editExperienceDataForm"
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
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
