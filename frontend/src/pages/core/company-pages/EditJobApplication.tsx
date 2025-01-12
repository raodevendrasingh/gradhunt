import React, { useState, useCallback, useEffect } from "react";
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
	currency,
} from "@/utils/selectObjects";
import { FiBriefcase, FiClock, FiDollarSign } from "react-icons/fi";
import { StyledDatePicker } from "@/components/ui/StyledDatePicker";
import { SkillSelect } from "@/components/ui/SkillSelect";
import { LocationSelect } from "@/helpers/LocationSelect2";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { IoPaperPlaneOutline, IoPeopleOutline } from "react-icons/io5";
import { LuGraduationCap, LuMapPin } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { useFetchJobDetails } from "@/hooks/useFetchJobDetails";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const EditJobApplication = () => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [initialLocation, setInitialLocation] = useState<string>("");
	const [, setEditorInstance] = useState(null);
	const [editorContent, setEditorContent] = useState("");
	const [editorError, setEditorError] = useState("");
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const { jobId } = useParams<{ jobId: string }>();

	const {
		data: jobPost,
		isLoading: isJobLoading,
		isError,
	} = useFetchJobDetails({ jobId: jobId! });

	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<JobPosting>({
		defaultValues: {
			applyWithUs: true,
		},
	});

	useEffect(() => {
		if (jobPost && !isJobLoading) {
			reset({
				jobTitle: jobPost.jobTitle,
				jobType: { value: jobPost.jobType, label: jobPost.jobType },
				workType: { value: jobPost.workType, label: jobPost.workType },
				experience: {
					value: jobPost.experience,
					label: jobPost.experience,
				},
				jobLocation: jobPost.jobLocation,
				openings: jobPost.openings,
				lowestSalary: jobPost.lowestSalary,
				highestSalary: jobPost.highestSalary,
				currency: { value: jobPost.currency, label: jobPost.currency },
				applicationDeadline: jobPost.applicationDeadline,
				requiredSkills: jobPost.requiredSkills,
				applyWithUs: jobPost.applyWithUs,
				applyLink: jobPost.applyLink,
				jobDescription: jobPost.jobDescription,
			});
			setInitialLocation(jobPost.jobLocation);
			setEditorContent(jobPost.jobDescription);
		}
	}, [isJobLoading, isError, jobPost]);

	const handleEditorReady = useCallback(
		(editor: any) => {
			setEditorInstance(editor);
			if (editor) {
				editor.on("update", ({ editor }: any) => {
					const content = editor.getHTML();
					setEditorContent(content);
					if (content && editorError) {
						setEditorError("");
					}
				});
			}
		},
		[editorError]
	);

	const applyWithUs = watch("applyWithUs");
	const applyLink = watch("applyLink");

	const atLeastOneRequired =
		"Either 'Apply with GradHunt' must be enabled or provide an external apply link";

	const onSubmit = async (data: JobPosting) => {
		setIsSubmitting(true);
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
			const url = `${apiUrl}/api/jobs/update/${jobId}`;
			await axios.patch(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			navigate("success");
		} catch (error: any) {
			if (error.response) {
				toast.error("Failed to create job posting");
				console.log("Error Status: ", error.response.status);
				console.log("Error Message: ", error.message);
				console.log("Error Response: ", error.response);
			} else if (error.request) {
				console.log("Error Request: ", error.request);
			} else {
				console.log("Error Message: ", error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex h-full">
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold pb-5">
						Edit Job Application{" "}
					</h2>
					<span className="mb-1.5 text-sm text-gray-600">
						JobID : {jobId?.toUpperCase()}
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Job Title"
							name="jobTitle"
							register={register}
							icon={<FiBriefcase className="h-5 w-5" />}
							error={errors.jobTitle?.message}
							validationRules={{
								required: "Job title is required",
							}}
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
								initialValue={initialLocation}
							/>
						</div>
						<TextInput
							label="Open Positions"
							name="openings"
							register={register}
							icon={<IoPeopleOutline className="h-5 w-5" />}
							error={errors.openings?.message}
							validationRules={{
								pattern: {
									value: /^[0-9]+$/,
									message: "Must be a valid number",
								},
							}}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Lowest Salary"
							name="lowestSalary"
							register={register}
							icon={
								<LiaMoneyBillWaveAltSolid className="h-5 w-5" />
							}
							error={errors.lowestSalary?.message}
							validationRules={{
								required: "Lowest Salary is required",
							}}
						/>
						<TextInput
							label="Highest Salary"
							name="highestSalary"
							register={register}
							icon={
								<LiaMoneyBillWaveAltSolid className="h-5 w-5" />
							}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectInput
							label="Currency"
							name="currency"
							options={currency}
							control={control}
							icon={<FiDollarSign className="h-5 w-5" />}
							error={errors.currency?.message}
							isRequired
						/>
						<StyledDatePicker
							name="applicationDeadline"
							label="Application Deadline"
							control={control}
							error={errors.applicationDeadline?.message}
							validationRules={{
								required: "Application Deadline is required",
							}}
						/>
					</div>

					<div className="col-span-2">
						<TextInput
							label="Apply Link"
							name="applyLink"
							register={register}
							icon={<IoPaperPlaneOutline className="h-5 w-5" />}
							error={errors.applyLink?.message}
							validationRules={{
								validate: (value) => {
									return (
										(!!value ||
											applyWithUs ||
											atLeastOneRequired) &&
										(!value ||
											/^(http|https):\/\/[^ "]+$/.test(
												value
											) ||
											"Must be a valid URL starting with http or https")
									);
								},
								pattern: {
									value: /^(http|https):\/\/[^ "]+$/,
									message:
										"Must be a valid URL starting with http or https",
								},
							}}
						/>
					</div>

					<div className="col-span-2">
						<SkillSelect
							name="requiredSkills"
							label="Skills Required"
							control={control}
							isRequired={true}
							error={errors.requiredSkills?.message}
						/>
					</div>

					<div className="col-span-2">
						<ToggleSwitch
							control={control}
							register={register}
							icon={<IoPaperPlaneOutline className="h-6 w-6" />}
							label="Apply with GradHunt"
							helptext="Allow candidates to apply with GradHunt, if turned off, candidates cannot be managed through GradHunt"
							name="applyWithUs"
							defaultValue={true}
							validationRules={{
								validate: (value) => {
									return (
										value ||
										!!applyLink ||
										atLeastOneRequired
									);
								},
							}}
						/>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Job Description
						</label>
						<TiptapEditor
							onEditorReady={handleEditorReady}
							initialContent={editorContent}
						/>
						{editorError && (
							<p className="mt-1 text-sm text-red-600">
								{editorError}
							</p>
						)}
					</div>

					<div className="flex justify-between pt-5">
						<Button
							type="button"
							variant="secondary"
							className="rounded-lg w-32 py-2.5"
							disabled
						>
							Save as Draft
						</Button>
						<Button
							type="submit"
							variant="primary"
							className="rounded-lg w-32 py-2.5"
						>
							{isSubmitting ? <Spinner /> : "Update"}
						</Button>
					</div>
				</form>
			</div>
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4"></div>
		</div>
	);
};
