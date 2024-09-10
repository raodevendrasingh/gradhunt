import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { selectCompanyFieldStyle } from "@/utils/styles";
import {
	endYearOptions,
	monthOptions,
	startYearOptions,
} from "@/utils/selectObjects";

interface DurationFieldsProps {
	control: any;
	register: any;
    name?: string;
	checkedTitle?: string;
	setEndDate: React.Dispatch<React.SetStateAction<boolean>>;
	endDate: boolean;
	startTitle: string;
	endTitle: string;
	errors: any;
}
export const DurationFields = ({
	control,
	register,
    name,
	checkedTitle,
	setEndDate,
	endDate,
	errors,
	startTitle,
	endTitle,
}: DurationFieldsProps) => {
	return (
		<>
			<div className="flex flex-col w-full gap-3">
				{checkedTitle && (
					<div className="w-full flex items-center gap-2 pb-3">
						<input
							{...register(name)}
							type="checkbox"
							name={name}
							id={name}
							className="rounded size-5 focus:ring-[1px] focus:ring-blue-700 focus:ring-offset-0"
							onClick={() => {
								setEndDate(!endDate);
							}}
						/>
						<label htmlFor="isValid" className="text-sm font-light select-none">
							{checkedTitle}
						</label>
					</div>
				)}
				<div className="flex flex-col gap-1">
					<label
						htmlFor="startMonth"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						{startTitle}
					</label>
					<div className="flex flex-col xs:flex-row gap-2">
						<div className="w-full xs:w-1/2 flex flex-col">
							<Controller
								name="startMonth"
								control={control}
								rules={{
									required: "Start Month is required",
								}}
								render={({ field }) => (
									<Select
										{...field}
										id="startMonth"
										options={monthOptions}
										placeholder="Start Month"
										styles={selectCompanyFieldStyle}
										value={field.value as any}
									/>
								)}
							/>
							{errors.startMonth && (
								<span className="form-error" role="alert">
									{errors.startMonth.message as string}
								</span>
							)}
						</div>
						<div className="w-full xs:w-1/2 flex flex-col">
							<Controller
								name="startYear"
								control={control}
								rules={{
									required: "Start Year is required",
								}}
								render={({ field }) => (
									<Select
										{...field}
										id="startYear"
										options={startYearOptions}
										placeholder="Start Year"
										styles={selectCompanyFieldStyle}
										value={field.value as any}
									/>
								)}
							/>
							{errors.startYear && (
								<span className="form-error" role="alert">
									{errors.startYear.message as string}
								</span>
							)}
						</div>
					</div>
				</div>
				{!endDate && (
					<div className="flex flex-col gap-1">
						<label
							htmlFor="startMonth"
							className="text-sm font-semibold text-gray-700 pb-1"
						>
							{endTitle}
						</label>
						<div className="flex flex-col xs:flex-row gap-2">
							<div className="w-full xs:w-1/2 flex flex-col">
								<Controller
									name="endMonth"
									control={control}
									rules={{
										required: "End Month is required",
									}}
									render={({ field }) => (
										<Select
											{...field}
											id="endMonth"
											options={monthOptions}
											placeholder="End Month"
											styles={selectCompanyFieldStyle}
											value={field.value as any}
										/>
									)}
								/>
								{errors.endMonth && (
									<span className="form-error" role="alert">
										{errors.endMonth.message as string}
									</span>
								)}
							</div>
							<div className="w-full xs:w-1/2 flex flex-col">
								<Controller
									name="endYear"
									control={control}
									rules={{
										required: "End Year is required",
									}}
									render={({ field }) => (
										<Select
											{...field}
											id="endYear"
											options={endYearOptions}
											placeholder="End Year"
											styles={selectCompanyFieldStyle}
											value={field.value as any}
										/>
									)}
								/>
								{errors.endYear && (
									<span className="form-error" role="alert">
										{errors.endYear.message as string}
									</span>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
