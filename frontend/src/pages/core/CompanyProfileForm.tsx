import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { FiCamera, FiGlobe, FiUsers } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa6";
import { LuCalendar } from "react-icons/lu";
import { BiBriefcase } from "react-icons/bi";
import { CompanyForm } from "@/types/userTypes";
import { companySize, sectors } from "@/utils/selectObjects";
import { LocationSelect } from "@/helpers/LocationSelect2";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { useState } from "react";

export default function CompanyProfileForm() {
	const [editorInstance, setEditorInstance] = useState(null);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CompanyForm>();

	const onSubmit: SubmitHandler<CompanyForm> = (data) => {
		if (editorInstance) {
			const content = (editorInstance as any).getHTML();
			console.log("Editor content:", content);
			// Send the content to your backend or process it as needed
		}
		console.log(data);
	};

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				<h2 className="text-lg font-semibold pb-5">Create Company Profile </h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
					{/* Cover Image Upload */}
					<div className="relative w-full h-48 bg-gray-100 rounded-xl mb-16">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="text-center">
								<FiCamera className="mx-auto h-12 w-12 text-gray-400" />
								<p className="mt-2 text-sm text-gray-500">Upload Cover Image</p>
							</div>
						</div>

						{/* Company Logo Upload */}
						<div className="absolute -bottom-12 left-8">
							<div className="relative w-28 h-28 bg-white rounded-xl border-2 border-gray-300">
								<div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
									<FiCamera className="h-8 w-8 text-gray-400" />
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
						<TextInput
							label="Company Name"
							name="companyName"
							register={register}
							icon={<FaBuilding className="h-5 w-5" />}
							validationRules={{ required: "Company name is required" }}
						/>
						<TextInput
							label="Website"
							name="website"
							register={register}
							icon={<FiGlobe className="h-5 w-5" />}
							validationRules={{ required: "Website is required" }}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectInput
							label="Employee Size"
							name="employeeSize"
							options={companySize}
							control={control}
							icon={<FiUsers className="h-5 w-5" />}
							isRequired
						/>
						<TextInput
							label="Established Year"
							name="establishedYear"
							register={register}
							icon={<LuCalendar className="h-5 w-5" />}
							validationRules={{
								required: "Established year is required",
								maxLength: { value: 4, message: "Invalid year" },
								minLength: { value: 4, message: "Invalid year" },
								pattern: { value: /^\d+$/, message: "Only digits are allowed" },
							}}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectInput
							label="Industry"
							name="industry"
							options={sectors}
							control={control}
							icon={<BiBriefcase className="h-5 w-5" />}
							isRequired
						/>
						<div className="">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Company Headquarters
							</label>
							<LocationSelect
								control={control}
								name="headquarters"
								placeholder="Location"
								error={errors.headquarters?.message}
								rules={{
									required: "Location is required",
								}}
							/>
						</div>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Company Branches
						</label>
						<LocationSelect
							control={control}
							name="branches"
							placeholder="Location"
							isMulti
							error={errors.branches?.message}
						/>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							About Company
						</label>
                        <TiptapEditor onEditorReady={setEditorInstance} />
						{/* <textarea
							{...register("about")}
							rows={4}
							className="w-full p-3 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 transition duration-200"
							placeholder="Tell us about your company..."
						/> */}
					</div>
					<div className="flex justify-between pt-5">
						<Button type="button" variant="secondary" className="px-8">
							Save as Draft
						</Button>
						<Button type="submit" variant="primary" className="px-8">
							Create Profile
						</Button>
					</div>
				</form>
			</div>

			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4"></div>
		</div>
	);
}
