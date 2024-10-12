import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import Spinner from "@/components/ui/Spinner";
import { JobPosting } from "@/types/userTypes";
import {
	employmentType,
	locationType,
	experienceLevels,
} from "@/utils/selectObjects";
import { FiBriefcase, FiClock, FiDollarSign } from "react-icons/fi";
import { StyledDatePicker } from "@/components/ui/StyledDatePicker";
import { SkillSelect } from "@/components/ui/SkillSelect";
import { LocationSelect } from "@/helpers/LocationSelect2";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { LuGraduationCap, LuMapPin } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const JobPostingForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [editorInstance, setEditorInstance] = useState(null);
	const [editorContent, setEditorContent] = useState("");
	const [editorError, setEditorError] = useState("");
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<JobPosting>({
		defaultValues: {
			applyWithUs: true,
		},
	});

	const handleEditorReady = useCallback(
		(editor: React.SetStateAction<null>) => {
			setEditorInstance(editor);
			if (editor) {
				(editor as any).on("update", ({ editor }: any) => {
					const content = editor.getHTML();
					setEditorContent(content);
					if (content && editorError) {
						setEditorError("");
					}
				});
			}
		},
		[]
	);

	const onSubmit = async (data: JobPosting) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User not authorized!");
			}

			const content = editorContent.trim();
			if (!content) {
				setEditorError("Job description is required");
				return;
			} else setEditorError("");

			const formData = {
				...data,
				jobDescription: content,
			};
			const url = "/api/post-job";
			await axios.post(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			navigate("success");
		} catch (error) {
			console.error(error);
			toast.error("Failed to create job posting");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-full">
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				<h2 className="text-lg font-semibold pb-5">Create Job Posting </h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Job Title"
							name="jobTitle"
							register={register}
							icon={<FiBriefcase className="h-5 w-5" />}
							error={errors.jobTitle?.message}
							validationRules={{ required: "Job title is required" }}
						/>
						<SelectInput
							label="Job Type"
							name="jobType"
							options={employmentType}
							control={control}
							icon={<LuGraduationCap className="h-5 w-5" />}
							error={errors.jobType?.message}
							isRequired
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectInput
							label="Work Type"
							name="workType"
							options={locationType}
							control={control}
							icon={<LuMapPin className="h-5 w-5" />}
							error={errors.workType?.message}
							isRequired
						/>
						<SelectInput
							label="Experience Required"
							name="experience"
							options={experienceLevels}
							control={control}
							icon={<FiClock className="h-5 w-5" />}
							error={errors.experience?.message}
							isRequired
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Salary Range"
							name="salaryRange"
							register={register}
							icon={<FiDollarSign className="h-5 w-5" />}
							error={errors.salaryRange?.message}
							validationRules={{ required: "Salary range is required" }}
						/>
						<div className="">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Job Location
							</label>
							<LocationSelect
								control={control}
								name="jobLocation"
								placeholder="Location"
								error={errors.jobLocation?.message}
								rules={{
									required: "Location is required",
								}}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<StyledDatePicker
							name="applicationDeadline"
							label="Application Deadline"
							control={control}
							error={errors.applicationDeadline?.message}
							validationRules={{ required: "Application Deadline is required" }}
						/>
						<TextInput
							label="Apply Link"
							name="applyLink"
							register={register}
							icon={<IoPaperPlaneOutline className="h-5 w-5" />}
							error={errors.applyLink?.message}
							validationRules={{
								pattern: {
									value: /^(http|https):\/\/[^ "]+$/,
									message: "Must be a valid URL starting with http or https",
								},
							}}
						/>
					</div>

					<div className="col-span-2">
						<SkillSelect
							name="skillsRequired"
							label="Skills Required"
							control={control}
							isRequired={true}
							error={errors.skillsRequired?.message}
						/>
					</div>

					<div className="col-span-2">
						<ToggleSwitch
							control={control}
							icon={<IoPaperPlaneOutline className="h-6 w-6" />}
							label="Apply with GradHunt"
							helptext="Allow candidates to apply with GradHunt, if turned off, candidates cannot be managed through GradHunt"
							name="applyWithUs"
							defaultValue={true}
						/>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Job Description
						</label>
						<TiptapEditor onEditorReady={handleEditorReady} />
						{editorError && (
							<p className="mt-1 text-sm text-red-600">{editorError}</p>
						)}
					</div>

					<div className="flex justify-between pt-5">
						<Button type="button" variant="secondary" className="w-32">
							Save as Draft
						</Button>
						<Button type="submit" variant="primary" className="w-32">
							{isLoading ? <Spinner /> : "Publish"}
						</Button>
					</div>
				</form>
			</div>
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
				sidebar
			</div>
		</div>
	);
};
