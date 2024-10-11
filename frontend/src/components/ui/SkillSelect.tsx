import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { FiX } from "react-icons/fi";
import { skillOptions } from "@/utils/skillOptions";
import { LuSearchCode } from "react-icons/lu";

interface SkillObject {
	value: string;
	label: string;
	image?: string;
}

interface SkillSelectProps {
	label: string;
	name: string;
	control: Control<any>;
	isRequired?: boolean;
	error?: string;
	minSkills?: number;
	maxSkills?: number;
}

export const SkillSelect: React.FC<SkillSelectProps> = ({
	label,
	name,
	control,
	isRequired,
}) => {
	const [searchInputValue, setSearchInputValue] = useState<string>("");

	const loadOptions = (
		inputValue: string,
		callback: (options: SkillObject[]) => void
	) => {
		const filteredOptions = skillOptions.filter((option) =>
			option.label.toLowerCase().includes(inputValue.toLowerCase())
		);
		callback(filteredOptions);
	};

	const validateSkills = (selectedSkills: SkillObject[]) => {
		if (isRequired && (!selectedSkills || selectedSkills.length === 0)) {
			return `${label} is required`;
		}
		if (selectedSkills.length < 5) {
			return `Please select at least 5 skills.`;
		}
		if (selectedSkills.length > 20) {
			return `You can select up to 20 skills.`;
		}
		return true;
	};

	return (
		<div className="w-full flex flex-col mb-6">
			<label htmlFor={name} className="text-sm font-medium text-gray-700 pb-1">
				{label}
			</label>

			<div className="relative">
				<div className="absolute left-3 top-3 text-gray-500 pointer-events-none z-10">
					<LuSearchCode className="h-5 w-5" />
				</div>

				<Controller
					name={name}
					control={control}
					rules={{
						validate: validateSkills,
					}}
					defaultValue={[]}
					render={({
						field: { onChange, value, ref },
						fieldState: { error },
					}) => (
						<div>
							<div className="flex pl-10 py-0.5 bg-slate-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 transition duration-200 w-full px-2">
								<span className="w-full">
									<AsyncSelect
										ref={ref}
										cacheOptions
										loadOptions={loadOptions}
										onChange={(newSkill) => {
											if (
												newSkill &&
												!value.some(
													(skill: SkillObject) => skill.value === newSkill.value
												)
											) {
												const updatedSkills = [...value, newSkill];
												onChange(updatedSkills);
											}
										}}
										isClearable
										isSearchable
										value={null}
										inputValue={searchInputValue}
										onInputChange={(newValue) => setSearchInputValue(newValue)}
										styles={{
											control: (base) => ({
												...base,
												border: "none",
												boxShadow: "none",
												backgroundColor: "#F9FAFB",
											}),
											indicatorSeparator: () => ({
												display: "none",
											}),
										}}
										placeholder="Search Skills or Technologies"
										noOptionsMessage={() => "Type to search"}
									/>
								</span>
							</div>
							{value && value.length > 0 && (
								<div className="border rounded-lg p-3 mt-2">
									<div className="flex flex-wrap gap-2">
										{value.map((skill: SkillObject) => (
											<div
												key={skill.value}
												className="flex items-center justify-center px-2.5 py-1 bg-slate-50 text-gray-700 rounded-full border"
											>
												{skill.image && (
													<span className="inline-block">
														<img
															src={skill.image}
															alt={skill.label}
															className="size-3 mr-2"
														/>
													</span>
												)}
												<span className="text-xs">{skill.label}</span>
												<button
													className="text-gray-600 pl-2 hover:text-red-500"
													onClick={(e) => {
														e.preventDefault();
														const updatedSkills = value.filter(
															(s: SkillObject) => s.value !== skill.value
														);
														onChange(updatedSkills);
													}}
												>
													<FiX />
												</button>
											</div>
										))}
									</div>
								</div>
							)}
							{error && (
								<span className="text-red-500 text-sm mt-1" role="alert">
									{error.message}
								</span>
							)}
						</div>
					)}
				/>
			</div>
		</div>
	);
};
