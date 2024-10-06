import React from "react";
import Select, { StylesConfig } from "react-select";
import { Control, Controller, FieldError } from "react-hook-form";

interface Option {
	value: string;
	label: string;
}

interface SelectInputProps {
	label: string;
	name: string;
	options: Option[];
	control: Control<any>;
	icon?: React.ReactNode;
	isRequired?: boolean;
	error?: FieldError;
}

export const selectStyles: StylesConfig<Option, false> = {
	control: (provided, state) => ({
		...provided,
		width: "100%",
		padding: "0.125rem",
		backgroundColor: "#F9FAFB", // matches bg-gray-50 from TextInput
		border: state.isFocused ? "1px solid #6B7280" : "1px solid #D1D5DB", // matches border-gray-300
		borderRadius: "0.5rem", // matches rounded-lg
		boxShadow: "none",
		"&:hover": {
			border: "1px solid #6B7280",
		},
		transition: "all 200ms", // matches transition duration-200
	}),
	option: (provided, state) => ({
		...provided,
		width: "99%",
		alignContent: "center",
		borderRadius: "0.225rem",
		margin: "2px auto",
		backgroundColor: state.isSelected ? "#E5E7EB" : "white",
		color: "#1F2937", // matches text-gray-800
		"&:hover": {
			backgroundColor: "#F3F4F6",
		},
		fontSize: "0.875rem", // matches text-sm
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
		fontSize: "0.875rem", // matches text-sm
	}),
	singleValue: (provided) => ({
		...provided,
		fontSize: "0.875rem", // matches text-sm
		color: "#1F2937", // matches text-gray-800
	}),
	indicatorSeparator: () => ({
		display: "none",
	}),
};

export const SelectInput: React.FC<SelectInputProps> = ({
	label,
	name,
	options,
	control,
	icon,
	isRequired = false,
	error,
}) => (
	<div className="w-full flex flex-col mb-6">
		<label htmlFor={name} className="text-sm font-medium text-gray-700 pb-1">
			{label}
		</label>
		<div className="flex gap-2">
			<div className="relative flex-grow">
				{icon && (
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 z-10">
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
								...selectStyles,
								control: (base, state) => ({
									...selectStyles.control?.(base, state),
									paddingLeft: icon ? "2.5rem" : "0.5rem",
								}),
							}}
							className={error ? "select-error" : ""}
							placeholder={`Select ${label}`}
						/>
					)}
				/>
			</div>
		</div>
		{error && (
			<span className="text-red-500 text-sm mt-1" role="alert">
				{error.message}
			</span>
		)}
	</div>
);
