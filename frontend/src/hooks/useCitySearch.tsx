import { useState, useCallback } from "react";
import axios from "axios";
import { useDebounceCallback } from "usehooks-ts";

interface City {
	name: string;
	state_name: string;
	country_name: string;
}

export interface CityOption {
	value: string;
	label: string;
	city: string;
	state: string;
	country: string;
}

export const useCitySearch = () => {
	const apiKey = import.meta.env.VITE_RAPID_API_KEY;
	const apiHost = import.meta.env.VITE_RAPID_API_HOST;

	const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCities = useCallback(
		async (inputValue: string) => {
			if (inputValue.length < 2) {
				setCityOptions([]);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await axios.get<City[]>(
					"https://city-and-state-search-api.p.rapidapi.com/cities/search",
					{
						params: { q: inputValue },
						headers: {
							"x-rapidapi-key": apiKey,
							"x-rapidapi-host": apiHost,
						},
					}
				);

				const cities = response.data.map((city) => ({
					value: `${city.name}, ${city.state_name}, ${city.country_name}`,
					label: `${city.name}, ${city.state_name}, ${city.country_name}`,
					city: city.name,
					state: city.state_name,
					country: city.country_name,
				}));
				setCityOptions(cities);
			} catch (error) {
				console.error("Error fetching cities:", error);
				setError("Failed to fetch cities. Please try again.");
				setCityOptions([]);
			} finally {
				setIsLoading(false);
			}
		},
		[apiKey, apiHost]
	);

	const debouncedFetchCities = useDebounceCallback(fetchCities, 300);

	const handleInputChange = (inputValue: string) => {
		debouncedFetchCities(inputValue);
		return inputValue;
	};

	const formatOptionLabel = (option: CityOption) => (
		<div>
			<span>{option.city}</span>
			{option.state && <span>, {option.state}</span>}
			{option.country && <span>, {option.country}</span>}
		</div>
	);

	return {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
	};
};
