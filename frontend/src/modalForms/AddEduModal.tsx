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

// Local imports
import {
	degreeTypes,
	fieldsOfStudy,
	monthOptions,
	startYearOptions,
	endYearOptions,
} from "@/utils/selectObjects";
import { selectCompanyFieldStyle } from "@/utils/styles";
import { useStore } from "@/store/userStore";

interface FieldWithMessage {
	message: string;
}

interface FormField<T> {
	value: T;
	validation: FieldWithMessage;
}
type EducationData = {
	instituteName: string;
	degreeTitle: string;
	studyField: string;
	startMonth: string;
	startYear: number;
	endMonth: string;
	endYear: number;
	instituteLocation: string;
	grade?: number;
	description: string;
};

type FormData = {
	instituteName: string;
	degreeTitle: string;
	studyField: string;
	startMonth: string;
	startYear: number;
	endMonth: string;
	endYear: number;
	instituteLocation: string;
	grade?: number;
	description: string;
};

export const AddEduModal = ({
	setShowEduModal,
	onSave,
}: {
	onSave: () => void;
	setShowEduModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { isSignedIn, user } = useUser();
	const { userName } = useStore();
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
		handleSelection,
	} = useCitySearch();

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const educationData: EducationData = {
			instituteName: data.instituteName,
			degreeTitle: data.degreeTitle,
			studyField: data.studyField,
			startMonth: data.startMonth,
			startYear: data.startYear,
			endMonth: data.endMonth,
			endYear: data.endYear,
			instituteLocation: data.instituteLocation,
			grade: data.grade,
			description: data.description,
		};

		console.log(educationData);

		try {
			if (!userName) {
				throw new Error("No Username provided");
			}
			const token = await getToken();
            console.log(token);
			if (!token) {
				throw new Error("Token is not available");
			}
			const url = `http://localhost:8000/api/${userName}/add-education-data`;
			const response = await axios.post(url, educationData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("Education Added");
			onSave();
			setShowEduModal(false);
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
		}
	};

	return (
		isSignedIn && (
			<AnimatePresence>
				{/* {isUsernameModalOpen && ( */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setShowEduModal(false)}
					className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer "
				>
					<motion.div
						initial={{ scale: 0.9, rotate: "0deg" }}
						animate={{ scale: 1, rotate: "0deg" }}
						exit={{ scale: 0, rotate: "0deg" }}
						onClick={(e) => e.stopPropagation()}
						className="bg-white p-4 rounded-2xl my-6 mx-10 sm:mx-auto w-full min-w-[350px] sm:min-w-[500px] sm:max-w-lg md:max-w-xl shadow-xl cursor-default relative overflow-hidden"
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
											id="educationDataForm"
											onSubmit={handleSubmit(onSubmit)}
										>
											{/* section */}
											<div className="flex flex-col-reverse sm:flex-row items-center gap-3 border-b pb-5 mb-1">
												<div className="flex flex-col w-full">
													{/* company name */}
													<div className="w-full flex flex-col h-20 relative">
														<label
															htmlFor="companyName"
															className="text-sm pb-1"
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
															className="border px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
														/>
														{errors.instituteName && (
															<span className="form-error" role="alert">
																{errors.instituteName.message as string}
															</span>
														)}
													</div>
													{/* job title and type */}
													<div className="flex flex-col sm:flex-row gap-2">
														<div className="w-full sm:w-1/2 flex flex-col h-20 relative">
															<label
																htmlFor="degreeTitle"
																className="text-sm pb-1 pt-2"
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
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.degreeTitle && (
																<span className="form-error" role="alert">
																	{errors.degreeTitle.message as string}
																</span>
															)}
														</div>
														<div className="w-full sm:w-1/2 flex flex-col h-20 relative">
															<label
																htmlFor="studyField"
																className="text-sm pb-1 pt-2"
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
																		styles={selectCompanyFieldStyle}
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

											<div className="flex flex-col w-full gap-2 border-b pb-3 mb-1">
												<div className="flex flex-col gap-1">
													<label htmlFor="startMonth" className="text-sm pt-2">
														Start Date
													</label>
													<div className="flex flex-col sm:flex-row gap-2">
														<div className="w-full sm:w-1/2 flex flex-col">
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
																	/>
																)}
															/>
															{errors.startMonth && (
																<span className="form-error" role="alert">
																	{errors.startMonth.message as string}
																</span>
															)}
														</div>
														<div className="w-full sm:w-1/2 flex flex-col">
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
												<div className="flex flex-col gap-1">
													<label htmlFor="startMonth" className="text-sm pt-2">
														End Date
													</label>
													<div className="flex flex-col sm:flex-row gap-2">
														<div className="w-full sm:w-1/2 flex flex-col">
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
																	/>
																)}
															/>
															{errors.endMonth && (
																<span className="form-error" role="alert">
																	{errors.endMonth.message as string}
																</span>
															)}
														</div>
														<div className="w-full sm:w-1/2 flex flex-col">
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
											</div>

											{/* company location and job type */}
											<div className="flex flex-col sm:flex-row w-full gap-2 border-b pb-6 mb-1 ">
												<div className="w-full sm:w-1/2 flex flex-col h-20 relative">
													<label
														htmlFor="instituteLocation"
														className="text-sm pb-1 pt-2"
													>
														Institute Location
													</label>
													<Controller
														name="instituteLocation"
														control={control}
														rules={{
															required: "Institute Location is required",
														}}
														render={({ field, fieldState }) => (
															<Select
																{...field}
																isClearable
																isSearchable
																isLoading={isLoading}
																onInputChange={handleInputChange}
																onChange={(option) =>
																	handleSelection(option, field.onChange)
																}
																options={cityOptions}
																formatOptionLabel={formatOptionLabel}
																value={field.value as any}
																id="headquarter"
																placeholder="Institute Location"
																styles={selectCompanyFieldStyle}
																classNamePrefix="select"
																noOptionsMessage={({ inputValue }) =>
																	inputValue.length < 2
																		? "Type at least 2 characters to search"
																		: error
																			? error
																			: "No cities found"
																}
															/>
														)}
													/>
													{errors.instituteLocation && (
														<span className="form-error" role="alert">
															{errors.instituteLocation.message as string}
														</span>
													)}
												</div>
												<div className="w-full sm:w-1/2 flex flex-col h-20 relative">
													<label
														htmlFor="companyName"
														className="text-sm pb-1 pt-2"
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
														className="border px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
													/>
													{errors.grade && (
														<span className="form-error" role="alert">
															{errors.grade.message as string}
														</span>
													)}
												</div>
											</div>
											{/* description section */}
											<div>
												<div className="flex flex-col w-full relative">
													<label
														htmlFor="description"
														className="text-sm pb-1 pt-2"
													>
														Description
														<span className="text-sm font-light text-gray-500">
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
														className="w-full px-2 py-1.5 border rounded-lg border-gray-400 focus:border-blue-500"
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
