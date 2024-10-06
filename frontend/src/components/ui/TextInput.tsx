import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface ValidationRules {
	required?: string;
	minLength?: {
		value: number;
		message: string;
	};
	maxLength?: {
		value: number;
		message: string;
	};
	pattern?: {
		value: RegExp;
		message: string;
	};
}

interface TextInputProps {
	label: string;
	name: string;
	type?: string;
	icon?: React.ReactNode;
	register: UseFormRegister<any>;
	validationRules?: ValidationRules;
	error?: FieldError;
}

export const TextInput: React.FC<TextInputProps> = ({
	label,
	name,
	type = "text",
	icon,
	register,
	validationRules,
	error,
}) => (
	<div className="w-full flex flex-col mb-6">
		<label htmlFor={name} className="text-sm font-medium text-gray-700 pb-1">
			{label}
		</label>
		<div className="flex gap-2">
			<div className="relative flex-grow">
				{icon && (
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
						{icon}
					</div>
				)}
				<input
					{...register(name, validationRules)}
					type={type}
					id={name}
					placeholder={label}
					className={`${icon ? "pl-10" : "pl-3"} w-full py-2.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200 ${
						error
							? "border-red-500 focus:ring-red-500 focus:border-red-500"
							: ""
					}`}
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
