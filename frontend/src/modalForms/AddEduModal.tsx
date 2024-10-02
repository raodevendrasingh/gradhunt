// hooks
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
import { degreeTypes, fieldsOfStudy } from "@/utils/selectObjects";
import { selectFieldStyle } from "@/utils/styles";
import { LocationSelect } from "@/helpers/LocationSelect";
import { EducationForm } from "@/types/userTypes";
import { DurationFields } from "@/helpers/DurationFields";
import { useState } from "react";
import { FormFooter } from "@/components/ui/FormFooter";

export const AddEduModal: React.FC<{
	setShowEduModal: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}> = ({ setShowEduModal, onSave }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EducationForm>();

	const onSubmit: SubmitHandler<EducationForm> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/users/education/`;
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// console.log(response.data);
			toast.success("Education Added");
			setShowEduModal(false);
            onSave();
		} catch (error: any) {
			toast.error("Error occured while adding education. Try again!");
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
								Add Education
							</h3>
							<button
								className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowEduModal(false)}
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
										id="educationDataForm"
									>
										{/* section */}
										<div className="flex flex-col-reverse items-center gap-3">
											<div className="flex flex-col w-full gap-3">
												{/* company name */}
												<div className="w-full flex flex-col">
													<label
														htmlFor="companyName"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Institute Name
													</label>
													<input
														{...register("instituteName", {
															required: "Institute name is required",
															minLength: {
																value: 2,
																message:
																	"Institute name shoud be alteast 2 characters",
															},
															maxLength: 50,
														})}
														aria-invalid={
															errors.instituteName ? "true" : "false"
														}
														type="text"
														name="instituteName"
														id="instituteName"
														placeholder="Institute Name"
                                                        className="border py-2 rounded-md border-gray-200 w-full"
                                                        />
													{errors.instituteName && (
														<span className="form-error" role="alert">
															{errors.instituteName.message as string}
														</span>
													)}
												</div>
												{/* job title and type */}
												<div className="flex flex-col xs:flex-row gap-3">
													<div className="w-full xs:w-1/2 flex flex-col">
														<label
															htmlFor="degreeTitle"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															Degree
														</label>
														<Controller
															name="degreeTitle"
															control={control}
															rules={{
																required: "Degree is required",
															}}
															render={({ field }) => (
																<Select
																	{...field}
																	id="degreeTitle"
																	options={degreeTypes}
																	placeholder="Degree"
																	styles={selectFieldStyle}
																	value={field.value as any}
																	menuPlacement="auto"
																/>
															)}
														/>
														{errors.degreeTitle && (
															<span className="form-error" role="alert">
																{errors.degreeTitle.message as string}
															</span>
														)}
													</div>
													<div className="w-full xs:w-1/2 flex flex-col">
														<label
															htmlFor="studyField"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															Field of Study
														</label>
														<Controller
															name="studyField"
															control={control}
															rules={{
																required: "Field of study is required",
															}}
															render={({ field }) => (
																<Select
																	{...field}
																	id="studyField"
																	options={fieldsOfStudy}
																	placeholder="Field of Study"
																	styles={selectFieldStyle}
																	value={field.value as any}
																	menuPlacement="auto"
																/>
															)}
														/>
														{errors.studyField && (
															<span className="form-error" role="alert">
																{errors.studyField.message as string}
															</span>
														)}
													</div>
												</div>
											</div>
										</div>

										<hr className="my-5" />
										<DurationFields
											startTitle="Start Date"
											endTitle="End Date"
											control={control}
											register={register}
											setEndDate={() => {}}
											endDate={false}
											errors={errors}
										/>

										<hr className="my-5" />
										{/* company location and job type */}
										<div className="flex flex-col xs:flex-row w-full gap-3">
											<div className="w-full xs:w-2/3 flex flex-col">
												<label
													htmlFor="instituteLocation"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Institute Location
												</label>
												<LocationSelect
													control={control}
													name="instituteLocation"
													placeholder="Location"
													error={errors.instituteLocation?.message}
													rules={{
														required: "Location is required",
													}}
													menuPlacement="auto"
												/>
											</div>
											<div className="w-full xs:w-1/3 flex flex-col">
												<label
													htmlFor="grade"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Grade
												</label>
												<input
													{...register("grade")}
													aria-invalid={errors.grade ? "true" : "false"}
													type="text"
													name="grade"
													id="grade"
													placeholder="Grade"
                                                    className="border py-2 rounded-md border-gray-200 w-full"
                                                    />
												{errors.grade && (
													<span className="form-error" role="alert">
														{errors.grade.message as string}
													</span>
												)}
											</div>
										</div>
										{/* description section */}
										<hr className="my-5" />
										<div>
											<div className="flex flex-col w-full">
												<label
													htmlFor="description"
													className="text-sm font-semibold text-gray-700 pb-1"
												>
													Description
													<span className="text-sm font-light pl-1 text-gray-500">
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
						<FormFooter isLoading={isLoading} formId="educationDataForm" />
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
