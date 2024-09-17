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
import { skills, SelectOption } from "@/utils/selectObjects";
import { selectCompanyFieldStyle } from "@/utils/styles";
import { Project } from "@/types/userTypes";
import { DurationFields } from "@/helpers/DurationFields";
import { FormFooter } from "@/components/ui/FormFooter";

export const AddProjectModal: React.FC<{
	setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowProjectModal }) => {
	const [isCurrWorking, setIsCurrWorking] = useState(false);
	const [description, setDescription] = useState("");
	const maxChars = 2000;
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Project>();

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};

	const onSubmit: SubmitHandler<Project> = async (data) => {
		setIsLoading(true);
		const transformedSkills: SelectOption[] = data.skills.map((skill) => ({
			label: skill.label,
			value: skill.value,
		}));
		const projectData: Project = {
			...data,
			skills: transformedSkills,
		};
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/add-project-data-`;
			const response = await axios.post(url, projectData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// console.log(response.data);
			toast.success("Project Added");
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
										id="projectDataForm"
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
													Project Title
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
											<label
												htmlFor="skills"
												className="text-sm font-semibold text-gray-700 pb-1"
											>
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
										<DurationFields
											checkedTitle="I'm currently working on this project"
											name="isCurrentlyWorking"
											startTitle="Start Date"
											endTitle="End Date"
											control={control}
											register={register}
											setEndDate={setIsCurrWorking}
											endDate={isCurrWorking}
											errors={errors}
										/>
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
									</form>
								</div>
							</div>
						</div>
						{/*footer*/}
						<FormFooter isLoading={isLoading} formId="projectDataForm" />
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
