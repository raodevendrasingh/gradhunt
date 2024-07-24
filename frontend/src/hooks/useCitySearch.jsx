import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

export const useCitySearch = () => {
	const apiKey = import.meta.env.VITE_KINDE_RAPID_API_KEY;
	const apiHost = import.meta.env.VITE_KINDE_RAPID_API_HOST;

	const [cityOptions, setCityOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCities = useCallback(
		async (inputValue) => {
			if (typeof inputValue !== "string" || inputValue.length < 2) {
				setCityOptions([]);
				return;
			}

			setIsLoading(true);
			setError(null);

			const options = {
				method: "GET",
				url: "https://city-and-state-search-api.p.rapidapi.com/cities/search",
				params: { q: inputValue },
				headers: {
					"x-rapidapi-key": apiKey,
					"x-rapidapi-host": apiHost,
				},
			};

			try {
				const response = await axios.request(options);
				const cities = response.data.map((city) => ({
					value: `${city.name},${city.state_name},${city.country_name}`,
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

	const debouncedFetchCities = useMemo(
		() => debounce(fetchCities, 300),
		[fetchCities]
	);

	const handleInputChange = useCallback(
		(inputValue, { action }) => {
			if (action === "input-change") {
				debouncedFetchCities(inputValue);
			}
			return inputValue;
		},
		[debouncedFetchCities]
	);

	const formatOptionLabel = ({ city, state, country }) => (
		<div>
			<span>{city}</span>
			{state && <span>, {state}</span>}
			{country && <span>, {country}</span>}
		</div>
	);

	const handleSelection = (selectedOptions, onChange) => {
		const formattedOptions = selectedOptions.map((option) => ({
			value: `${option.city}, ${option.state}, ${option.country}`,
			label: `${option.city}, ${option.state}, ${option.country}`,
			city: option.city,
			state: option.state,
			country: option.country,
		}));
		onChange(formattedOptions);
	};
    
	return {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
		handleSelection,
	};
};
