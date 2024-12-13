import { useState } from "react";

interface FilterOption {
	id: string;
	label: string;
	checked: boolean;
}

export const useFilterOptions = () => {
	const createFilterGroup = (options: Omit<FilterOption, "checked">[]) => {
		return options.map((option) => ({
			...option,
			checked: useState(false),
		}));
	};

	const categoryTypes = createFilterGroup([
		{
			id: "Development & Engineering",
			label: "Development & Engineering",
		},
		{ id: "Data & AI", label: "Data & AI" },
		{ id: "Product & Design", label: "Product & Design" },
		{
			id: "Cloud & Infrastructure",
			label: "Cloud & Infrastructure",
		},
		{ id: "Security & Networking", label: "Security & Networking" },
		{ id: "Emerging Technologies", label: "Emerging Technologies" },
		{ id: "Testing & QA", label: "Testing & QA" },
		{ id: "Leadership & Management", label: "Leadership & Management" },
		{ id: "Support & Training", label: "Support & Training" },
		{ id: "Creative & Writing", label: "Creative & Writing" },
		{ id: "Specialized Roles", label: "Specialized Roles" },
	]);

	const workTypes = createFilterGroup([
		{ id: "On-Site", label: "On-Site" },
		{ id: "Remote", label: "Remote" },
		{ id: "Hybrid", label: "Hybrid" },
	]);

	const IndiaLocations = createFilterGroup([
		{ id: "Bengaluru", label: "Bengaluru" },
		{ id: "Pune", label: "Pune" },
		{ id: "Mumbai", label: "Mumbai" },
		{ id: "Chennai", label: "Chennai" },
		{ id: "New Delhi", label: "New Delhi" },
		{ id: "Hyderabad", label: "Hyderabad" },
	]);

	const AbroadLocations = createFilterGroup([
		{ id: "New York", label: "New York" },
		{ id: "London", label: "London" },
		{ id: "Singapore", label: "Singapore" },
		{ id: "Dubai", label: "Dubai" },
		{ id: "Tokyo", label: "Tokyo" },
		{ id: "Sydney", label: "Sydney" },
	]);

	const employmentTypes = createFilterGroup([
		{ id: "Full Time", label: "Full Time" },
		{ id: "Part Time", label: "Part Time" },
		{ id: "Contract", label: "Contract" },
		{ id: "Freelance", label: "Freelance" },
		{ id: "Internship", label: "Internship" },
	]);

	return {
		categoryTypes,
		workTypes,
		IndiaLocations,
		AbroadLocations,
		employmentTypes,
	};
};
