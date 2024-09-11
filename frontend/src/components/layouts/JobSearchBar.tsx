import { HiOutlineSearch } from "react-icons/hi";
import { TfiLocationPin } from "react-icons/tfi";
import { GoBriefcase } from "react-icons/go";
import { SingleValue } from "react-select";
import { CityOption } from "@/hooks/useCitySearch";

import Select from "react-select";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

import { experience } from "@/utils/selectObjects";
import { inputSearchFieldStyle } from "@/utils/styles";
import { useEffect, useState } from "react";

export interface FormData {
	position: string;
	experience: string | { value: string; label: string } | null;
	location: string | { value: string; label: string } | null;
}

interface JobSearchFormProps {
	onSubmit: SubmitHandler<FormData>;
	isLoading: boolean;
	cityOptions: CityOption[];
	handleInputChange: (inputValue: string) => void;
	formatOptionLabel: (option: CityOption) => React.ReactNode;
	error?: string;
}

export const JobSearchForm: React.FC<JobSearchFormProps> = ({
	onSubmit,
	isLoading,
	cityOptions,
	handleInputChange,
	formatOptionLabel,
	error,
}) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>();

	return (
		<div className="w-full max-w-6xl mx-auto px-4 py-6">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 rounded-2xl md:rounded-full border border-gray-300 shadow-lg bg-white"
			>
				<div className="flex-grow flex flex-col md:flex-row items-stretch md:items-center gap-4">
					<div className="w-full md:w-[40%] md:border-r border-gray-300 md:pr-4">
						<div className="flex items-center gap-2">
							<HiOutlineSearch className="w-5 h-5 text-gray-500 flex-shrink-0" />
							<input
								{...register("position", {
									required: "Position / Skill is required",
									minLength: {
										value: 2,
										message: "Position should be at least 2 characters",
									},
									maxLength: 50,
								})}
								aria-invalid={errors.position ? "true" : "false"}
								type="text"
								id="positions"
								placeholder="Company / Position / Skills"
								className="w-full border-none focus:ring-0 text-gray-800 placeholder-gray-500"
							/>
						</div>
					</div>
					<div className="w-full md:w-[30%] md:border-r border-gray-300 md:pr-4">
						<div className="flex items-center gap-2">
							<GoBriefcase className="w-5 h-5 text-gray-500 flex-shrink-0" />
							<Controller
								name="experience"
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										id="experience"
										options={experience}
										placeholder="Experience"
										className="w-full"
										classNamePrefix="react-select"
										styles={inputSearchFieldStyle}
										value={field.value as any}
									/>
								)}
							/>
						</div>
					</div>
					<div className="w-full md:w-[30%]">
						<div className="flex items-center gap-2">
							<TfiLocationPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
							<Controller
								name="location"
								control={control}
								render={({ field }) => {
									const [selectedOption, setSelectedOption] =
										useState<CityOption | null>(null);

									useEffect(() => {
										if (field.value && !selectedOption) {
											const option = cityOptions.find(
												(opt) => opt.value === field.value
											);
											if (option) {
												setSelectedOption(option);
											}
										}
									}, [field.value, cityOptions]);

									return (
										<Select<CityOption, false>
											{...field}
											value={selectedOption}
											onChange={(newValue: SingleValue<CityOption>) => {
												setSelectedOption(newValue);
												field.onChange(newValue ? newValue.value : null);
											}}
											isClearable
											isSearchable
											isLoading={isLoading}
											onInputChange={handleInputChange}
											options={cityOptions}
											formatOptionLabel={formatOptionLabel}
											id="jobLocation"
											placeholder="Location"
											className="w-full"
											classNamePrefix="react-select"
											styles={inputSearchFieldStyle}
											noOptionsMessage={({ inputValue }) =>
												inputValue.length < 2
													? "Type at least 2 characters to search"
													: error
														? error
														: "No cities found"
											}
										/>
									);
								}}
							/>
						</div>
					</div>
				</div>
				<button
					type="submit"
					className="w-full md:w-auto px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
				>
					Search
				</button>
			</form>

			{/* Error messages */}
			<div className="mt-2 space-y-1">
				{errors.position && (
					<span className="text-red-500 text-sm" role="alert">
						{errors.position.message as String}
					</span>
				)}
				{errors.experience && (
					<span className="text-red-500 text-sm" role="alert">
						{errors.experience.message as String}
					</span>
				)}
				{errors.location && (
					<span className="text-red-500 text-sm" role="alert">
						{errors.location.message as String}
					</span>
				)}
			</div>
		</div>
	);
};
