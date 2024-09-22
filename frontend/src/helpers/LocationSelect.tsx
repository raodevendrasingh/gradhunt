import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { Controller } from "react-hook-form";
import { useCitySearch, CityOption } from "@/hooks/useCitySearch";
import { selectFieldStyle } from "@/utils/styles";

interface LocationSelectProps {
	control: any;
	name: string;
	placeholder?: string;
	rules?: any;
	error?: string;
	menuPlacement: "auto" | "bottom" | "top" | undefined;
	initialValue?: string;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
	control,
	name,
	placeholder,
	rules,
	error,
	menuPlacement,
	initialValue,
}) => {
	const { isLoading, cityOptions, handleInputChange, formatOptionLabel } =
		useCitySearch();

	const [selectedOption, setSelectedOption] = useState<CityOption | null>(null);

	useEffect(() => {
		const cityVal = initialValue?.split(",")[0];
		const stateVal = initialValue?.split(",")[1];
		const countryVal = initialValue?.split(",")[2];
		if (initialValue && !selectedOption) {
			setSelectedOption({
				city: cityVal as string,
				state: stateVal as string,
				country: countryVal as string,
				value: initialValue,
				label: initialValue,
			});
			handleInputChange(initialValue);
		}
	}, [initialValue]);

	return (
		<>
			<Controller
				name={name}
				control={control}
				rules={rules}
				render={({ field }) => (
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
							styles={selectFieldStyle}
							menuPlacement={menuPlacement}
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
				)}
			/>
		</>
	);
};
