import React from "react";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import { ValidationRules } from "./TextInput";
import { Controller, Control } from "react-hook-form";

interface DatePickerInputProps {
	name: string;
	control: Control<any>;
	label: string;
	placeholder?: string;
	error?: string;
	validationRules?: ValidationRules;
}

export const StyledDatePicker: React.FC<DatePickerInputProps> = ({
	control,
	label,
	name,
	placeholder,
	validationRules,
	error,
}) => (
	<div className="w-full flex flex-col mb-6">
		<label className="text-sm font-medium text-gray-700 pb-1">{label}</label>

		<div className="relative w-full">
			<Controller
				name={name}
				control={control}
				rules={validationRules}
				render={({ field: { onChange, value, ref } }) => (
					<DatePicker
						selected={value}
						onChange={onChange}
						placeholderText={placeholder || label}
						customInput={
							<input
								ref={ref}
								placeholder={placeholder || label}
								className={`pl-10 w-full py-2.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200 ${
									error
										? "border-red-500 focus:ring-red-100 focus:border-red-500"
										: ""
								}`}
							/>
						}
						className="w-full"
						wrapperClassName="w-full"
					/>
				)}
			/>
			<div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
				<FiCalendar className="h-5 w-5" />
			</div>
		</div>

		{error && (
			<span className="text-red-500 text-sm mt-1" role="alert">
				{error}
			</span>
		)}
	</div>
);
