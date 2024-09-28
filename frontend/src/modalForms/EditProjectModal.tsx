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
import { skills, SelectOption } from "@/utils/selectObjects";
import { selectFieldStyle } from "@/utils/styles";
import { ProjectForm } from "@/types/userTypes";
import { DurationFields } from "@/helpers/DurationFields";
import { useFetchProjectDataById } from "@/hooks/useFetchProjectsDataById";
import Spinner from "@/components/ui/Spinner";

export const EditProjectModal: React.FC<{
	setShowEditProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
	projectId: number;
	onSave: () => void;
}> = ({ setShowEditProjectModal, projectId, onSave }) => {
	const [isCurrWorking, setIsCurrWorking] = useState(false);
	const [description, setDescription] = useState("");
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isDeleted, setIsDeleted] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const maxChars = 2000;
	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProjectForm>();

	const { projectIdData } = useFetchProjectDataById({
		projectId: projectId,
	});

	useEffect(() => {
		if (projectIdData && !isDeleting && !isDeleted) {
			const data = projectIdData;
			reset({
				projectName: data.projectName,
				liveLink: data.liveLink,
				sourceCodeLink: data.sourceCodeLink,
				skills: data.skills.map((skill: string) => ({ value: skill, label: skill })),
				startMonth: { value: data.startMonth, label: data.startMonth },
				startYear: { value: data.startYear, label: data.startYear },
				endMonth: data.endMonth
					? { value: data.endMonth, label: data.endMonth }
					: null,
				endYear: data.endYear
					? { value: data.endYear, label: data.endYear }
					: null,
				description: data.description,
			});
		}
	}, [projectIdData, reset]);

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/delete-project/${projectId}`;
			await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success("Project Deleted");
			setIsDeleted(true);
			onSave();
			setShowEditProjectModal(false);
		} catch (error: any) {
			console.error("Delete error:", error);
			toast.error("Failed to delete project. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const onSubmit: SubmitHandler<ProjectForm> = async (data) => {
		setIsLoading(true);
		const transformedSkills: SelectOption[] = data.skills.map((skill) => ({
			label: skill.label,
			value: skill.value,
		}));
		const projectData: ProjectForm = {
			...data,
			skills: transformedSkills,
		};
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}
			console.log("projectData sent to backend", projectData);

			const url = `/api/update-project/${projectId}`;
			const response = await axios.patch(url, projectData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("Project Updated Successfully!");
			setShowEditProjectModal(false);
			onSave();
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
								onClick={() => setShowEditProjectModal(false)}
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
										id="editProjectDataForm"
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
													className="border py-2 rounded-md border-gray-200 w-full"
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
													className="border py-2 rounded-md border-gray-200 w-full"
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
														styles={selectFieldStyle}
														menuPlacement="auto"
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
													className="border py-2 rounded-md border-gray-200 w-full"
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
													className="border py-2 rounded-md border-gray-200 w-full"
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
						<div className="flex items-center justify-between mt-3 rounded-b">
							<button
								className="flex items-center justify-center w-28 text-red-500 font-semibold rounded-lg text-sm px-4 py-2.5 outline-none focus:outline-none disabled:text-red-400 cursor-pointer ease-linear transition-colors duration-150"
								form="editProjectDataForm"
								type="button"
								onClick={handleDelete}
								disabled={isLoading || isDeleting}
							>
								{isDeleting ? <Spinner color="red" /> : "Delete"}
							</button>
							<button
								className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:shadow-none shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
								type="submit"
								form="editProjectDataForm"
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
