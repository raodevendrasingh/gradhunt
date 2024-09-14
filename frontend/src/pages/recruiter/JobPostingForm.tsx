import { JobListing } from "@/types/userTypes";
import {
	companySize,
	employmentType,
	experience,
	locationType,
	requiredExperience,
	SelectOption,
	skills,
} from "@/utils/selectObjects";
import { selectFieldStyle } from "@/utils/styles";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";

import { FaBriefcase, FaClock, FaIndianRupeeSign } from "react-icons/fa6";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useFetchCompanyProfile } from "@/hooks/useFetchCompanyProfile";
import { useMemo, useState } from "react";
import Spinner from "@/components/ui/Spinner";

export const JobPostingForm = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [description, setDescription] = useState<string>("");
	const { companyData } = useFetchCompanyProfile();
	const maxChars = 5000;
	const { getToken } = useAuth();
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<JobListing>();

	const createJobLocationOptions = (companyData: {
		headquarters: string;
		branches: { city: string; state: string; country: string }[];
	}): SelectOption[] => {
		const locations: SelectOption[] = [];

		locations.push({
			label: companyData.headquarters,
			value: companyData.headquarters,
		});

		companyData.branches.forEach((branch) => {
			const location = `${branch.city}, ${branch.state}, ${branch.country}`;
			locations.push({ label: location, value: location });
		});

		return locations;
	};

	const jobLocationOptions: SelectOption[] = useMemo(() => {
		return companyData ? createJobLocationOptions(companyData) : [];
	}, [companyData]);

	const onSubmit: SubmitHandler<JobListing> = async (data) => {
		setIsLoading(true);
		console.log(data);
		const token = await getToken();
		const formData: JobListing = {
			...data,
			jobDescription: data.jobDescription
				.replace(/\n/g, "\\n")
				.replace(/\s/g, " "),
		};
		try {
			if (!token) {
				throw new Error("User not authorized. Invalid Token!");
			}

			const url = "/api/post-job";
			const response = await axios.post(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			console.log(response);

			toast.success("Job Posted!");
		} catch (error) {
			console.log("An Error occured while posting jobs", error);
			toast.error("Unable to post job");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value);
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white pt-20">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Create Job Posting
			</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="w-full flex flex-col">
						<label
							htmlFor="jobTitle"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Job Title
						</label>
						<div className="relative">
							<FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								{...register("jobTitle", {
									required: "Job title is required",
									minLength: {
										value: 2,
										message: "Job title should be at least 2 characters",
									},
									maxLength: {
										value: 50,
										message: "Job title must not exceed 50 characters",
									},
								})}
								type="text"
								id="jobTitle"
								aria-invalid={errors.jobTitle ? "true" : "false"}
								placeholder="e.g. Senior React Developer"
								className="border pl-10 pr-2 py-2 rounded-md border-gray-200  w-full"
							/>
						</div>
						{errors.jobTitle && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.jobTitle.message}
							</span>
						)}
					</div>
					<div className="w-full flex flex-col">
						<label
							htmlFor="jobType"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Job Type
						</label>
						<Controller
							name="jobType"
							control={control}
							rules={{ required: "Job Type is required" }}
							render={({ field }) => (
								<Select
									{...field}
									id="jobType"
									options={employmentType}
									placeholder="Select Job Type"
									styles={selectFieldStyle}
									menuPlacement="auto"
								/>
							)}
						/>
						{errors.jobType && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.jobType.message}
							</span>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="w-full flex flex-col">
						<label
							htmlFor="experience"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Experience Required
						</label>
						<Controller
							name="experience"
							control={control}
							rules={{ required: "Experience is required" }}
							render={({ field }) => (
								<Select
									{...field}
									id="experience"
									options={requiredExperience}
									placeholder="Select Experience"
									styles={selectFieldStyle}
									menuPlacement="auto"
									value={field.value as any}
								/>
							)}
						/>
						{errors.experience && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.experience.message}
							</span>
						)}
					</div>
					<div className="w-full flex flex-col">
						<label
							htmlFor="workType"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Work Type
						</label>
						<Controller
							name="workType"
							control={control}
							rules={{ required: "Experience is required" }}
							render={({ field }) => (
								<Select
									{...field}
									id="workType"
									options={locationType}
									placeholder="Select Work Type"
									styles={selectFieldStyle}
									menuPlacement="auto"
									value={field.value as any}
								/>
							)}
						/>
						{errors.workType && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.workType.message}
							</span>
						)}
					</div>
				</div>

				<div className="w-full flex flex-col">
					<label
						htmlFor="jobDescription"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						Job Description
					</label>
					<textarea
						{...register("jobDescription", {
							required: "Job description is required",
							minLength: {
								value: 500,
								message: "Job Description must be at least 500 characters",
							},
							maxLength: {
								value: 5000,
								message: "Job Description must not exceed 5000 characters",
							},
						})}
						value={description}
						onChange={handleInputChange}
						maxLength={maxChars}
						id="jobDescription"
						aria-invalid={errors.jobDescription ? "true" : "false"}
						placeholder="Describe the job role, responsibilities, and requirements"
						style={{ whiteSpace: "pre-wrap" }}
						className="border pr-2 py-2 rounded-md border-gray-200 w-full min-h-[200px]"
					/>
					<div className="flex relative">
						{errors.jobDescription && (
							<span className="form-error" role="alert">
								{errors.jobDescription.message as string}
							</span>
						)}
						<span className="absolute right-0 text-xs text-gray-600">
							({0 + description.length}/{maxChars})
						</span>
					</div>
				</div>

				<div className="w-full flex flex-col">
					<label
						htmlFor="jobLocation"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						Location
					</label>
					<Controller
						name="jobLocation"
						control={control}
						rules={{ required: "Location is required" }}
						render={({ field }) => (
							<Select
								{...field}
								isMulti
								isClearable
								isSearchable
								id="jobLocation"
								options={jobLocationOptions}
								placeholder="Select Location"
								styles={selectFieldStyle}
								menuPlacement="auto"
								value={field.value as any}
							/>
						)}
					/>
					{errors.jobLocation && (
						<span className="form-error text-red-500 text-sm" role="alert">
							{errors.jobLocation.message}
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="w-full flex flex-col">
						<label
							htmlFor="companySize"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Company Size
						</label>
						<Controller
							name="companySize"
							control={control}
							rules={{ required: "Company Size is required" }}
							render={({ field }) => (
								<Select
									{...field}
									id="companySize"
									options={companySize}
									placeholder="Select Company Size"
									styles={selectFieldStyle}
									menuPlacement="auto"
									value={field.value as any}
								/>
							)}
						/>
						{errors.companySize && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.companySize.message}
							</span>
						)}
					</div>

					<div className="w-full flex flex-col">
						<label
							htmlFor="salaryRange"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Salary Range
						</label>
						<div className="relative">
							<FaIndianRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								{...register("salaryRange", {
									required: "Salary range is required",
								})}
								type="text"
								id="salaryRange"
								aria-invalid={errors.salaryRange ? "true" : "false"}
								placeholder="e.g. 5 - 7 LPA"
								className="border pl-10 pr-2 py-2 rounded-md border-gray-200  w-full"
							/>
						</div>
						{errors.salaryRange && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.salaryRange.message}
							</span>
						)}
					</div>
					<div className="w-full flex flex-col">
						<label
							htmlFor="applicationDeadline"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							Application Deadline
						</label>
						<div className="relative">
							<FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								{...register("applicationDeadline", {
									required: "Application deadline is required",
								})}
								type="date"
								id="applicationDeadline"
								aria-invalid={errors.applicationDeadline ? "true" : "false"}
								className="border pl-10 pr-2 py-2 rounded-md border-gray-200  w-full"
							/>
						</div>
						{errors.applicationDeadline && (
							<span className="form-error text-red-500 text-sm" role="alert">
								{errors.applicationDeadline.message}
							</span>
						)}
					</div>
				</div>

				<div className="w-full flex flex-col">
					<label
						htmlFor="skillsRequired"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						Skills Required
						<span className="text-xs text-gray-500 pl-2">(Min. 5)</span>
					</label>
					<Controller
						control={control}
						name="skillsRequired"
						rules={{
							required: "Skills are required",
						}}
						render={({ field }) => (
							<Select
								id="skillsRequired"
								isMulti
								name="skillsRequired"
								options={skills}
								onChange={(selected) => {
									if (selected.length > 20) {
										setError("skillsRequired", {
											message: "A maximum of 20 skills can be selected",
										});
										return;
									}
									if (selected.length < 5) {
										setError("skillsRequired", {
											message: "At least 5 skills must be selected",
										});
										return;
									}
									clearErrors("skillsRequired"); // Clear any previous errors
									field.onChange(selected);
								}}
								menuPlacement="auto"
								value={field.value as any}
								placeholder="Skills"
								styles={selectFieldStyle}
							/>
						)}
					/>
					{errors.skillsRequired && (
						<span className="form-error text-red-500 text-sm" role="alert">
							{errors.skillsRequired.message}
						</span>
					)}
				</div>

				<button
					type="submit"
                    disabled={isLoading}
					className="w-full flex items-center justify-center  bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-opacity-50"
				>
					{isLoading ? (
						<span className="flex justify-center w-full">
							<span className="mr-2">Posting</span>
							<Spinner />
						</span>
					) : (
						"Post Job"
					)}
				</button>
			</form>
		</div>
	);
};
