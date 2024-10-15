import React from "react";
import Select, { StylesConfig } from "react-select";
import { Control, Controller } from "react-hook-form";

interface Option {
	value: string;
	label: string;
}

interface SelectInputProps {
	label?: string;
	name: string;
	placeholder?: string;
	options: Option[];
	control: Control<any>;
	icon?: React.ReactNode;
	isRequired?: boolean;
	error?: string;
    styles?: any;
}

export const selectStyles: StylesConfig<Option, false> = {
	control: (provided, state) => ({
		...provided,
		width: "100%",
		padding: "0.125rem",
		paddingLeft: "2rem",
		fontSize: "0.875rem",
		backgroundColor: "#F9FAFB",
		border: state.isFocused ? "1px solid #6B7280" : "1px solid #D1D5DB",
		borderRadius: "0.5rem",
		boxShadow: "none",
		"&:hover": {
			border: "1px solid #6B7280",
		},
		transition: "all 200ms",
	}),
	option: (provided, state) => ({
		...provided,
		width: "99%",
		alignContent: "center",
		borderRadius: "0.225rem",
		margin: "2px auto",
		backgroundColor: state.isSelected ? "#E5E7EB" : "white",
		color: "#1F2937",
		"&:hover": {
			backgroundColor: "#F3F4F6",
		},
		fontSize: "0.875rem",
		padding: "0.5rem",
	}),
	menu: (provided) => ({
		...provided,
		backgroundColor: "white",
		border: "1px solid #E5E7EB",
		borderRadius: "0.5rem",
		zIndex: 30,
		boxShadow:
			"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
	}),
	input: (provided) => ({
		...provided,
		fontSize: "0.875rem",
	}),
	singleValue: (provided) => ({
		...provided,
		fontSize: "0.875rem",
		color: "#1F2937",
	}),
	indicatorSeparator: () => ({
		display: "none",
	}),
};

export const SelectInput: React.FC<SelectInputProps> = ({
	label,
	name,
	placeholder = label,
	options,
	control,
	icon,
	isRequired = false,
	error,
    styles = selectStyles,
}) => (
	<div className="w-full flex flex-col">
		{label && (
			<label htmlFor={name} className="text-sm font-medium text-gray-700 pb-1">
				{label}
			</label>
		)}

		<div className="relative">
			{icon && (
				<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
					{icon}
				</div>
			)}
			<Controller
				name={name}
				control={control}
				rules={{ required: isRequired ? `${label} is required` : false }}
				render={({ field }) => (
					<Select
						{...field}
						options={options}
						styles={{
							...styles,
							control: (base, state) => ({
								...styles.control?.(base, state),
								paddingLeft: icon ? "2rem" : "0.5rem",
								...(error && {
									border: "1px solid #EF4444", // border-red-500
									"&:hover": {
										border: "1px solid #EF4444", // border-red-500
									},
									boxShadow: "0 0 0 1px #FEE2E2", // focus:ring-red-100
									"&:focus-within": {
										border: "1px solid #EF4444", // focus:border-red-500
										boxShadow: "0 0 0 1px #FEE2E2", // focus:ring-red-100
									},
								}),
							}),
						}}
						className={error ? "select-error" : ""}
						placeholder={placeholder}
					/>
				)}
			/>
		</div>

		{error && (
			<span className="text-red-500 text-sm mt-1" role="alert">
				{error}
			</span>
		)}
	</div>
);
