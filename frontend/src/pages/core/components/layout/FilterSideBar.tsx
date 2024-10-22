import { MultiSelectDropdown } from "@/components/common/MultiSelectDropdown";
import { employmentType, functions } from "@/utils/selectObjects";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaXmark } from "react-icons/fa6";
import { FilterCheckbox } from "@/pages/core/components/ui/FilterCheckBox";
import { useFilterOptions } from "@/hooks/useFilterOptions";
interface FilterFormData {
	category: string[];
	jobType: string[];
	workType: string[];
	experience: string[];
	expectedSalary: string[];
}
export const FilterSideBar = () => {
    const { experienceLevels, workTypes, salaryTypes, IndiaLocation } =
		useFilterOptions();

	const [isExperienceOpen, setIsExperienceOpen] = useState(false);
	const [isSalaryOpen, setIsSalaryOpen] = useState(false);
	const [isWorkTypeOpen, setIsWorkTypeOpen] = useState(false);
	const [isIndiaLocationOpen, setIsIndiaLocationOpen] = useState(false);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FilterFormData>();

    const handleFilter: SubmitHandler<FilterFormData> = async (data) => {};

	return (
		<div className="border rounded-lg w-64 xl:w-72 ">
			<form
				onSubmit={handleSubmit(handleFilter)}
				className="flex flex-col gap-2"
			>
				<div className="flex items-center justify-between border-b p-4">
					<span className="text-gray-600 font-medium text-lg">Filters</span>
					<span className="flex items-center gap-1 text-gray-600 text-sm border rounded-lg px-2 py-1 hover:bg-gray-100 hover:text-gray-700 select-none cursor-pointer">
						Clear All
						<FaXmark className="text-gray-600" />
					</span>
				</div>
				{/* category */}
				<div className="flex flex-col gap-2 py-3 px-4 border-b">
					<div className="flex items-center justify-start cursor-pointer">
						<span className="text-gray-800 font-medium text-base select-none">
							Category
						</span>
					</div>
					<Controller
						control={control}
						name="category"
						render={({ field }) => (
							<MultiSelectDropdown
								id="function"
								options={functions as { value: string; label: string }[]}
								label=""
								buttonTitle="Categories"
								helpText=""
								maxSelect={5}
								dropdownName="functions"
								selectedValues={field.value ? field.value.flat() : []}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>
				{/* job type */}
				<div className="flex flex-col gap-2 py-3 px-4 border-b">
					<div className="flex items-center justify-start cursor-pointer">
						<span className="text-gray-800 font-medium text-base select-none">
							Job Type
						</span>
					</div>
					<Controller
						control={control}
						name="jobType"
						render={({ field }) => (
							<MultiSelectDropdown
								id="jobType"
								options={employmentType as { value: string; label: string }[]}
								label=""
								buttonTitle="Job Type"
								helpText=""
								maxSelect={5}
								dropdownName="employmentType"
								selectedValues={field.value ? field.value.flat() : []}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>
				{/* experience */}
				<div className="flex flex-col gap-2 py-3 px-4 border-b">
					<div
						className="flex items-center justify-between cursor-pointer"
						onClick={() => setIsExperienceOpen(!isExperienceOpen)}
					>
						<span className="text-gray-800 font-medium text-base select-none">
							Experience Level
						</span>

						{isExperienceOpen ? (
							<FaChevronUp className="text-gray-500" />
						) : (
							<FaChevronDown className="text-gray-500" />
						)}
					</div>

					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{
							height: isExperienceOpen ? "auto" : 0,
							opacity: isExperienceOpen ? 1 : 0,
						}}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						{isExperienceOpen && (
							<div className="flex flex-col gap-4 p-2">
								{experienceLevels.map((level) => (
									<FilterCheckbox
										key={level.id}
										id={level.id}
										label={level.label}
										checked={level.checked}
										setChecked={level.setChecked}
									/>
								))}
							</div>
						)}
					</motion.div>
				</div>
				{/* expected salary */}
				<div className="flex flex-col gap-2 py-3 px-4 border-b">
					<div
						className="flex items-center justify-between cursor-pointer"
						onClick={() => setIsSalaryOpen(!isSalaryOpen)}
					>
						<span className="text-gray-800 font-medium text-base select-none">
							Expected Salary
						</span>

						{isSalaryOpen ? (
							<FaChevronUp className="text-gray-500" />
						) : (
							<FaChevronDown className="text-gray-500" />
						)}
					</div>
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{
							height: isSalaryOpen ? "auto" : 0,
							opacity: isSalaryOpen ? 1 : 0,
						}}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						{isSalaryOpen && (
							<div className="flex flex-col gap-4 p-2">
								{salaryTypes.map((level) => (
									<FilterCheckbox
										key={level.id}
										id={level.id}
										label={level.label}
										checked={level.checked}
										setChecked={level.setChecked}
									/>
								))}
							</div>
						)}
					</motion.div>
				</div>
				{/* work type */}
				<div className="flex flex-col gap-2 py-3 px-4 border-b">
					<div
						className="flex items-center justify-between cursor-pointer"
						onClick={() => setIsWorkTypeOpen(!isWorkTypeOpen)}
					>
						<span className="text-gray-800 font-medium text-base select-none">
							Work Type
						</span>
						{isWorkTypeOpen ? (
							<FaChevronUp className="text-gray-500" />
						) : (
							<FaChevronDown className="text-gray-500" />
						)}
					</div>
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{
							height: isWorkTypeOpen ? "auto" : 0,
							opacity: isWorkTypeOpen ? 1 : 0,
						}}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						{isWorkTypeOpen && (
							<div className="flex flex-col gap-4 p-2">
								{workTypes.map((types) => (
									<FilterCheckbox
										key={types.id}
										id={types.id}
										label={types.label}
										checked={types.checked}
										setChecked={types.setChecked}
									/>
								))}
							</div>
						)}
					</motion.div>
				</div>
				<div className="flex flex-col gap-2 py-3 px-4">
					<div
						className="flex items-center justify-between cursor-pointer"
						onClick={() => setIsIndiaLocationOpen(!isIndiaLocationOpen)}
					>
						<span className="text-gray-800 font-medium text-base select-none">
							Top Locations in India
						</span>
						{isIndiaLocationOpen ? (
							<FaChevronUp className="text-gray-500" />
						) : (
							<FaChevronDown className="text-gray-500" />
						)}
					</div>

					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{
							height: isIndiaLocationOpen ? "auto" : 0,
							opacity: isIndiaLocationOpen ? 1 : 0,
						}}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						{isIndiaLocationOpen && (
							<div className="flex flex-col gap-4 p-2">
								{IndiaLocation.map((types) => (
									<FilterCheckbox
										key={types.id}
										id={types.id}
										label={types.label}
										checked={types.checked}
										setChecked={types.setChecked}
									/>
								))}
							</div>
						)}
					</motion.div>
				</div>
			</form>
		</div>
	);
};
