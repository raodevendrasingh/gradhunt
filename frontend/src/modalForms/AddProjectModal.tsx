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
	skills,
} from "@/utils/selectObjects";
import { selectCompanyFieldStyle } from "@/utils/styles";

interface FormData {
	projectName: string;
	description: string;
	liveLink: string;
	skills: string[];
	sourceCodeLink: string | null;
	isCurrentlyWorking: boolean;
	startMonth: string;
	startYear: number;
	endMonth: string | null;
	endYear: number | null;
}

export const AddProjectModal: React.FC<{
	onSave: () => void;
	setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowProjectModal, onSave }) => {
	const [isCurrWorking, setIsCurrWorking] = useState(false);
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

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};

	const onSubmit: SubmitHandler<FormData> = async (data) => {
        const transformedSkills = data.skills.map(skill => skill.value);
		const projectData: FormData = {
			projectName: data.projectName,
			description: data.description,
			liveLink: data.liveLink,
			sourceCodeLink: data.sourceCodeLink,
            skills: transformedSkills,	
			isCurrentlyWorking: data.isCurrentlyWorking,
			startMonth: data.startMonth,
			startYear: data.startYear,
			endMonth: data.endMonth,
			endYear: data.endYear,
		};

		console.log(projectData);
		console.log();

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/add-project-data`;
			const response = await axios.post(url, projectData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// console.log(response.data);
			toast.success("Project Added");
			onSave();
			setShowProjectModal(false);
		} catch (error: any) {
			toast.error("Error occured while adding project. Try again!");
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
					onClick={() => setShowProjectModal(false)}
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
									Add Project
								</h3>
								<button
									className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowProjectModal(false)}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<div className=" max-h-[70vh] overflow-y-auto scroll-smooth">
								<div className="p-3">
									<div className="flex flex-col gap-3">
										<form
											id="educationDataForm"
											onSubmit={handleSubmit(onSubmit)}
											// className="flex flex-col gap-3"
										>
											{/* main section */}
											<div className="flex flex-col w-full gap-3">
												{/* company name */}
												<div className="w-full flex flex-col ">
													<label
														htmlFor="projectName"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Protect Title
													</label>
													<input
														{...register("projectName", {
															required: "Project title is required",
															minLength: {
																value: 2,
																message:
																	"Project title shoud be alteast 2 characters",
															},
															maxLength: 50,
														})}
														aria-invalid={errors.projectName ? "true" : "false"}
														type="text"
														name="projectName"
														id="projectName"
														placeholder="Project Title"
														className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-blue-500"
													/>
													{errors.projectName && (
														<span className="form-error" role="alert">
															{errors.projectName.message as string}
														</span>
													)}
												</div>

												{/*  project description */}
												<div className="flex flex-col w-full">
													<label
														htmlFor="description"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Description
													</label>
													<textarea
														{...register("description", {
															required: "Project Description is Required!",
															minLength: {
																value: 50,
																message: "Minimum 50 characters are required",
															},
															maxLength: {
																value: 1500,
																message:
																	"Description should not exceed 1500 characters",
															},
														})}
														name="description"
														id="description"
														value={description}
														onChange={handleInputChange}
														maxLength={maxChars}
														placeholder="Explain problem statement, inspiration, usecase, etc."
														rows={3}
														className="w-full px-2 py-2 text-sm border rounded-lg border-gray-400 focus:border-blue-500"
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
											<hr className="my-5" />
											<div className="w-full">
												<label htmlFor="skills" className="text-sm font-semibold text-gray-700 pb-1">
													Skills Used in the project
													<span className="text-xs text-gray-500 pl-2">
														(Max. 10)
													</span>
												</label>
												<Controller
													control={control}
													name="skills"
													rules={{
														required: "At least one skill must be selected",
													}}
													render={({ field }) => (
														<Select
															id="skills"
															isMulti
															name="skills"
															options={skills}
															onChange={(selected) => {
																if (selected.length <= 10) {
																	field.onChange(selected);
																}
															}}
															value={field.value as any}
															placeholder="Skills"
															styles={selectCompanyFieldStyle}
														/>
													)}
												/>
												{errors.skills && (
													<p className="form-error">{errors.skills.message}</p>
												)}
											</div>
											<hr className="my-5" />
											<div className="flex flex-col items-center w-full gap-3">
												<div className="w-full flex flex-col">
													<label
														htmlFor="liveLink"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Live Link
													</label>
													<input
														{...register("liveLink", {
															pattern: {
																value:
																	/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
																message: "Please enter a valid URL",
															},
														})}
														aria-invalid={errors.liveLink ? "true" : "false"}
														name="liveLink"
														type="text"
														id="liveLink"
														placeholder="e.g. https://example.com/"
														className="border px-2 py-2 text-sm rounded-lg border-gray-400 focus:border-blue-500"
													/>
													{errors.liveLink && (
														<span className="form-error" role="alert">
															{errors.liveLink.message}
														</span>
													)}
												</div>
												<div className="w-full flex flex-col">
													<label
														htmlFor="sourceCodeLink"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Source Code
													</label>
													<input
														{...register("sourceCodeLink", {
															pattern: {
																value:
																	/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
																message: "Please enter a valid URL",
															},
														})}
														aria-invalid={
															errors.sourceCodeLink ? "true" : "false"
														}
														name="sourceCodeLink"
														type="text"
														id="sourceCodeLink"
														placeholder="Github Link"
														className="border px-2 py-2 text-sm rounded-lg border-gray-400 focus:border-blue-500"
													/>
													{errors.sourceCodeLink && (
														<span className="form-error" role="alert">
															{errors.sourceCodeLink.message}
														</span>
													)}
												</div>
											</div>
											<hr className="my-5" />
											{/* project duration */}
											<div className="flex flex-col w-full gap-2">
												<div className="w-full flex items-center gap-2 pb-3">
													<input
														{...register("isCurrentlyWorking")}
														type="checkbox"
														name="isCurrentlyWorking"
														id="isCurrentlyWorking"
														className="rounded size-5 focus:ring-[1px] focus:ring-blue-700"
														onClick={() => {
															setIsCurrWorking(!isCurrWorking);
														}}
													/>
													<label
														htmlFor="isCurrentlyWorking"
														className="text-sm font-light select-none"
													>
														I&apos;m Currently working on this project
													</label>
												</div>
												<div className="flex flex-col gap-1">
													<label
														htmlFor="startMonth"
														className="text-sm font-semibold text-gray-700 pb-1"
													>
														Start Date
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
												{!isCurrWorking && (
													<div className="flex flex-col gap-1">
														<label
															htmlFor="startMonth"
															className="text-sm font-semibold text-gray-700 pb-1"
														>
															End Date
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
