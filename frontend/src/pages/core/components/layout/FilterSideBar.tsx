import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaXmark } from "react-icons/fa6";
import { FilterCheckbox } from "@/pages/core/components/ui/FilterCheckBox";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { Button } from "@/components/ui/Button";
import { SearchQuery } from "@/types/userTypes";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";
import { RangeFilter } from "./RangeFilter";
import { apiUrl } from "@/modal-forms/OnboardingModal";

type FilterOption = {
	id: string;
	label: string;
	checked: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

// Interface matches the desired backend format
interface FilterFormData {
	category: string[];
	jobType: string[];
	experience: { min: string; max: string }[];
	expectedSalary: { min: string; max: string; currency: string }[];
	workType: string[];
	indiaLocation: string[];
	abroadLocation: string[];
}

export const FilterSideBar = ({
	onFilterResults,
}: {
	onFilterResults: (results: SearchQuery) => void;
}) => {
	const [result, setResult] = useState<SearchQuery>();
	const [isLoading, setIsLoading] = useState(false);

	const {
		workTypes,
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

	const { handleSubmit, reset, control } = useForm<FilterFormData>({
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
			const url = `${apiUrl}/api/jobs/filters`;
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			setResult(response.data);
			onFilterResults(response.data);
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
			...workTypes,
			...IndiaLocations,
			...AbroadLocations,
		].forEach((item) => item.checked[1](false));
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
				onClick={() =>
					toggleSection(sectionKey as keyof typeof openSections)
				}
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
					height: openSections[
						sectionKey as keyof typeof openSections
					]
						? "auto"
						: 0,
					opacity: openSections[
						sectionKey as keyof typeof openSections
					]
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
					<Controller
						name={sectionKey}
						control={control}
						render={({ field }) => (
							<>
								{items.map((item) => (
									<FilterCheckbox
										key={item.id}
										id={item.id}
										label={item.label}
										checked={item.checked[0]}
										setChecked={(checked: boolean) => {
											// Update local state
											item.checked[1](checked);

											// Update form values
											const currentValues =
												field.value as string[];
											const newValues = checked
												? [...currentValues, item.id]
												: currentValues.filter(
														(v) => v !== item.id
													);

											field.onChange(newValues);
										}}
									/>
								))}
							</>
						)}
					/>
				</div>
			</motion.div>
		</div>
	);

	return (
		<div className="border rounded-lg w-64 xl:w-72 ">
			<form className="flex flex-col gap-2">
				<div className="flex items-center justify-between border-b p-4">
					<span className="text-gray-600 font-medium text-lg">
						Filters
					</span>
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
				{renderFilterSection(
					"Employment Type",
					"jobType",
					employmentTypes
				)}
				<RangeFilter
					control={control}
					title="Experience Level"
					type="experience"
					field="experience"
				/>

				<RangeFilter
					control={control}
					title="Expected Salary"
					type="salary"
					field="expectedSalary"
				/>

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
