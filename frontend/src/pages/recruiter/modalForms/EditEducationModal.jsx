/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// Hooks
import { useEffect, useState } from "react";
import { useCitySearch } from "@/hooks/useCitySearch";

// Third-party libraries
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";
import axios from "axios";

// Icons
import { HiOutlineXMark} from "react-icons/hi2";
import { MdOutlineEdit } from "react-icons/md";

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

export const EditEducationModal = ({ educationId, onSave }) => {
	const [showModal, setShowModal] = useState(false);
	const {
		control,
		register,
		handleSubmit,
        reset,
		formState: { errors },
	} = useForm();

	const {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
		handleSelection,
	} = useCitySearch();

	// add check to validate the dates

	const { userName, setUserName } = useStore((state) => ({
		userName: state.userName,
		setUserName: state.setUserName,
	}));

	useEffect(() => {
		if (!userName) {
			const storedUserName = localStorage.getItem("userName");
			if (storedUserName) {
				setUserName(storedUserName);
			}
		}
	}, [userName, setUserName]);

    const fetchEducationDetails = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/api/recruiter/${userName}/get-education-data/${educationId}`
			);
			reset({
				instituteName: response.data.instituteName,
				degreeTitle: {
					label: response.data.degreeTitle,
					value: response.data.degreeTitle,
				},
				studyField: { label: response.data.studyField, value: response.data.studyField },
				startMonth: {
					label: response.data.startMonth,
					value: response.data.startMonth,
				},
				startYear: {
					label: response.data.startYear,
					value: response.data.startYear,
				},
				endMonth: {
					label: response.data.endMonth,
					value: response.data.endMonth,
				},
				endYear: { label: response.data.endYear, value: response.data.endYear },
				instituteLocation: {
					city: response.data.instituteLocation.split(", ")[0],
					state: response.data.instituteLocation.split(", ")[1],
					country: response.data.instituteLocation.split(", ")[2],
					value: response.data.instituteLocation,
					label: response.data.instituteLocation,
				},
				grade: response.data.grade,
				description: response.data.description,
			});
		} catch (error) {
			console.error("Error fetching experience details:", error);
			toast.error("Failed to load experience details");
		}
	};


    const deleteEducation = async ({ userName, educationId }) => {
		try {
			const url = `http://localhost:8000/api/recruiter/${userName}/delete-education-data/${educationId}`;
			const response = await axios.delete(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.log(response.data);
			setShowModal(false);
            onSave();
			toast.success("Education deleted!");
		} catch (error) {
			console.error("Error deleting education: ", error);
			toast.error("Error deleting education! Try Again!");
		}
	};

    useEffect(() => {
		if (showModal && educationId) {
			fetchEducationDetails();
		}
	}, [showModal, educationId]);

	const onSubmit = async (data) => {
		const updatedEducationData = {
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

		// console.log(educationData);

        try {
            const url = `http://localhost:8000/api/recruiter/${userName}/update-education-data/${educationId}`
            await axios.put(url, updatedEducationData ).then((response) => {
				console.log(updatedEducationData);
				console.log(response.data);
				console.log(response);
				toast.success("Recruiter Education Updated!");
				setShowModal(false);
				onSave();
			});
        } catch (error) {
            toast.error("Error occured while updating education. Try again!");
			console.log("Error Status: ", error.response.status);
			console.log("Error Message: ", error.message);
        }

		// axios({
			
		// 	method: "POST",
		// 	data: educationData,
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// })
		// 	.then((response) => {
		// 		console.log(response.data);
		// 		toast.success("Recruiter Experience Added");
		// 		setShowModal(false);
        //         onSave();
		// 	})
		// 	.catch((error) => {
		// 		toast.error("Error occured while adding education. Try again!");
		// 		if (error.response) {
		// 			console.log("Error Status: ", error.response.status);
		// 			console.log("Error Message: ", error.message);
		// 			console.log("Error Response: ", error.response);
		// 		} else if (error.request) {
		// 			console.log("Error Request: ", error.request);
		// 		} else {
		// 			console.log("Error Message: ", error.message);
		// 		}
		// 	});
	};

	return (
		<>
			<button type="button" onClick={() => setShowModal(true)}>
				<MdOutlineEdit className="size-9 hover:bg-gray-100 rounded-full p-2" />
			</button>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none scrollbar scrollbar-track-transparent">
						<div className="relative my-6 mx-10 sm:mx-auto  w-full min-w-[350px] sm:min-w-[500px] sm:max-w-lg md:max-w-2xl">
							{/*content*/}
							<div className="border-0 p-3 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[90vh] overflow-hidden">
								{/*header*/}
								<div className="flex items-start justify-between ml-1 rounded-t">
									<h3 className="text-xl font-bold text-gray-800 mt-1">Add Education</h3>
									<button
										className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
										onClick={() => setShowModal(false)}
									>
										<span className="bg-transparent text-gray-800">
											<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2"/>
										</span>
									</button>
								</div>

								{/*body*/}
								<div className=" p-6 overflow-y-auto h-[calc(90vh - 160px)] border rounded-xl">
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
															className="border-2 px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
														/>
														{errors.instituteName && (
															<span className="form-error" role="alert">
																{errors.instituteName.message}
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
																id="degreeTitle"
																control={control}
																rules={{
																	required: "Degree is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		options={degreeTypes}
																		placeholder="Degree"
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.degreeTitle && (
																<span className="form-error" role="alert">
																	{errors.degreeTitle.message}
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
																id="studyField"
																control={control}
																rules={{
																	required: "Field of study is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		options={fieldsOfStudy}
																		placeholder="Field of Study"
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.studyField && (
																<span className="form-error" role="alert">
																	{errors.studyField.message}
																</span>
															)}
														</div>
													</div>
												</div>
											</div>

											<div className="flex flex-col w-full gap-2 border-b pb-3 mb-1">
												<div className="flex flex-col gap-1">
													<span htmlFor="startMonth" className="text-sm pt-2">
														Start Date
													</span>
													<div className="flex flex-col sm:flex-row gap-2">
														<div className="w-full sm:w-1/2 flex flex-col">
															<Controller
																name="startMonth"
																id="startMonth"
																control={control}
																rules={{
																	required: "Start Month is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		options={monthOptions}
																		placeholder="Start Month"
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.startMonth && (
																<span className="form-error" role="alert">
																	{errors.startMonth.message}
																</span>
															)}
														</div>
														<div className="w-full sm:w-1/2 flex flex-col">
															<Controller
																name="startYear"
																id="startYear"
																control={control}
																rules={{
																	required: "Start Year is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		options={startYearOptions}
																		placeholder="Start Year"
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.startYear && (
																<span className="form-error" role="alert">
																	{errors.startYear.message}
																</span>
															)}
														</div>
													</div>
												</div>
												<div className="flex flex-col gap-1">
													<span htmlFor="startMonth" className="text-sm pt-2">
														End Date
													</span>
													<div className="flex flex-col sm:flex-row gap-2">
														<div className="w-full sm:w-1/2 flex flex-col">
															<Controller
																name="endMonth"
																id="endMonth"
																control={control}
																rules={{
																	required: "End Month is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		options={monthOptions}
																		placeholder="End Month"
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.endMonth && (
																<span className="form-error" role="alert">
																	{errors.endMonth.message}
																</span>
															)}
														</div>
														<div className="w-full sm:w-1/2 flex flex-col">
															<Controller
																name="endYear"
																id="endYear"
																control={control}
																rules={{
																	required: "End Year is required",
																}}
																render={({ field }) => (
																	<Select
																		{...field}
																		options={endYearOptions}
																		placeholder="End Year"
																		styles={selectCompanyFieldStyle}
																	/>
																)}
															/>
															{errors.endYear && (
																<span className="form-error" role="alert">
																	{errors.endYear.message}
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
														rules={{ required: "Institute Location is required" }}
														render={({ field }) => (
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
															{errors.instituteLocation.message}
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
														className="border-2 px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
													/>
													{errors.grade && (
														<span className="form-error" role="alert">
															{errors.grade.message}
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
														Description{" "}
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
														rows="3"
														className="w-full px-2 py-1.5 border-2 rounded-lg border-gray-400 focus:border-blue-500"
													></textarea>
													{errors.description && (
														<span className="form-error" role="alert">
															{errors.description.message}
														</span>
													)}
												</div>
											</div>
										</form>
									</div>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-between mt-3 rounded-b">
									<button
										className="text-rose-600 bg-rose-200 active:text-rose-700 font-semibold border rounded-[10px] text-sm px-4 py-2 shadow hover:bg-rose-600 hover:text-white outline-none focus:outline-none ease-linear transition-all duration-150"
										type="delete"
										onClick={() => deleteEducation({ userName, educationId })}
									>
										Delete
									</button>
									<button
										className="bg-green-600 text-white active:bg-green-700 font-semibold border rounded-[10px] text-sm px-4 py-2 shadow hover:bg-green-800 outline-none focus:outline-none ease-linear transition-all duration-150"
										type="submit"
										onClick={handleSubmit(onSubmit)}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};
