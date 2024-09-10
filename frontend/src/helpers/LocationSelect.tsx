import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { Controller } from "react-hook-form"; // Ensure this import is present
import { useCitySearch, CityOption } from "@/hooks/useCitySearch";
import { selectCompanyFieldStyle } from "@/utils/styles";

interface LocationSelectProps {
	control: any; // Adjust type as needed
	name: string;
	placeholder?: string;
	rules?: any; // Adjust type as needed
	error?: string;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
	control,
	name,
	placeholder,
	rules,
	error,
}) => {
	const { isLoading, cityOptions, handleInputChange, formatOptionLabel } =
		useCitySearch();

	const [selectedOption, setSelectedOption] = useState<CityOption | null>(null);

	return (
		<>
			<Controller
				name={name}
				control={control}
				rules={rules}
				render={({ field }) => {
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
						<>
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
								placeholder={placeholder}
								className="w-full"
								classNamePrefix="react-select"
								styles={selectCompanyFieldStyle}
								noOptionsMessage={({ inputValue }) =>
									inputValue.length < 2
										? "Type to search"
										: error
											? error
											: "No cities found"
								}
							/>
							{error && (
								<span className="form-error" role="alert">
									{error}
								</span>
							)}
						</>
					);
				}}
			/>
		</>
	);
};
