import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaXmark } from "react-icons/fa6";
import { FilterCheckbox } from "@/pages/core/components/ui/FilterCheckBox";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { Button } from "@/components/ui/Button";
import { SearchQuery } from "@/types/userTypes";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";

type FilterOption = {
	id: string;
	label: string;
	checked: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

interface FilterFormData {
	category: string[];
	jobType: string[];
	experience: string[];
	expectedSalary: string[];
	workType: string[];
	indiaLocation: string[];
	abroadLocation: string[];
}

export const FilterSideBar = () => {
	const [result, setResult] = useState<SearchQuery>();
	const [isLoading, setIsLoading] = useState(false);

	const {
		experienceLevels,
		workTypes,
		salaryTypes,
		IndiaLocations,
		AbroadLocations,
		categoryTypes,
		employmentTypes,
	} = useFilterOptions();

	const [openSections, setOpenSections] = useState({
		category: false,
		jobType: false,
		experience: false,
		salary: false,
		workType: false,
		indiaLocation: false,
		abroadLocation: false,
	});

	const { handleSubmit, reset, watch, setValue } = useForm<FilterFormData>({
		defaultValues: {
			category: [],
			jobType: [],
			experience: [],
			expectedSalary: [],
			workType: [],
			indiaLocation: [],
			abroadLocation: [],
		},
	});

	const handleFilter: SubmitHandler<FilterFormData> = async (data) => {
		console.log("Applied Filters:", data);
		setIsLoading(true);
		try {
			const url = `/api/jobs/filters`;
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
			setResult(response.data);
		} catch (error) {
			console.error("Error Applying Filters: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearAll = () => {
		reset();
		[
			...categoryTypes,
			...employmentTypes,
			...experienceLevels,
			...salaryTypes,
			...workTypes,
			...IndiaLocations,
			...AbroadLocations,
		].forEach((item) => item.checked[1](false));
	};

	const handleCheckboxChange = (
		field: keyof FilterFormData,
		value: string,
		checked: boolean
	) => {
		const currentValues = watch(field) || [];
		setValue(
			field,
			checked
				? [...currentValues, value]
				: currentValues.filter((v) => v !== value)
		);
	};

	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const renderFilterSection = (
		title: string,
		sectionKey: keyof FilterFormData,
		items: FilterOption[]
	) => (
		<div className="flex flex-col gap-2 py-3 px-4 border-b">
			<div
				className="flex items-center justify-between cursor-pointer"
				onClick={() => toggleSection(sectionKey as keyof typeof openSections)}
			>
				<span className="text-gray-800 font-medium text-base select-none">
					{title}
				</span>

				{openSections[sectionKey as keyof typeof openSections] ? (
					<FaChevronUp className="text-gray-500" />
				) : (
					<FaChevronDown className="text-gray-500" />
				)}
			</div>

			<motion.div
				initial={false}
				animate={{
					height: openSections[sectionKey as keyof typeof openSections]
						? "auto"
						: 0,
					opacity: openSections[sectionKey as keyof typeof openSections]
						? 1
						: 0,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className="overflow-hidden"
			>
				<div className="flex flex-col gap-4 p-2">
					{items.map((item) => (
						<FilterCheckbox
							key={item.id}
							id={item.id}
							label={item.label}
							checked={item.checked[0]}
							setChecked={(checked: boolean) => {
								item.checked[1](checked);
								handleCheckboxChange(sectionKey, item.id, checked);
							}}
						/>
					))}
				</div>
			</motion.div>
		</div>
	);

	return (
		<div className="border rounded-lg w-64 xl:w-72 ">
			<form className="flex flex-col gap-2">
				<div className="flex items-center justify-between border-b p-4">
					<span className="text-gray-600 font-medium text-lg">Filters</span>
					<span
						onClick={handleClearAll}
						className="flex items-center gap-1 bg-gray-50 text-gray-600 text-sm border rounded-lg px-2 py-1 hover:bg-white hover:text-red-600 select-none cursor-pointer"
					>
						Clear All
						<FaXmark className="text-gray-600" />
					</span>
				</div>
				<Button
					type="submit"
					variant="secondary"
					className="py-2.5 mx-2 rounded-lg text-gray-700"
					onClick={handleSubmit(handleFilter)}
				>
					{isLoading ? <Spinner color="#000" /> : "Apply Filters"}
				</Button>

				{renderFilterSection("Category", "category", categoryTypes)}
				{renderFilterSection("Employment Type", "jobType", employmentTypes)}
				{renderFilterSection(
					"Experience Level",
					"experience",
					experienceLevels
				)}
				{renderFilterSection("Expected Salary", "expectedSalary", salaryTypes)}
				{renderFilterSection("Work Type", "workType", workTypes)}
				{renderFilterSection(
					"Top Locations — India",
					"indiaLocation",
					IndiaLocations
				)}
				{renderFilterSection(
					"Top Locations — Abroad",
					"abroadLocation",
					AbroadLocations
				)}
			</form>
		</div>
	);
};
