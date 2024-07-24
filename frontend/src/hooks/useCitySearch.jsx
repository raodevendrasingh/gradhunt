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
        // Check if selectedOptions is null or undefined and handle the cleared state
        if (selectedOptions === null || selectedOptions === undefined) {
            onChange(null); // or onChange('') or any other suitable value for your use case
            return; // Exit the function early
        }
    
        let formattedOptions;
    
        if (Array.isArray(selectedOptions)) {
            // Handle the case for an array of cities
            formattedOptions = selectedOptions.map((option) => ({
                value: `${option.city}, ${option.state}, ${option.country}`,
                label: `${option.city}, ${option.state}, ${option.country}`,
                city: option.city,
                state: option.state,
                country: option.country,
            }));
        } else if (typeof selectedOptions === 'string') {
            // Handle the case for a single city as a string
            formattedOptions = selectedOptions;
        } else {
            // Handle the case for a single city object
            formattedOptions = {
                city: selectedOptions.city,
                state: selectedOptions.state,
                country: selectedOptions.country,
                value: `${selectedOptions.city}, ${selectedOptions.state}, ${selectedOptions.country}`,
                label: `${selectedOptions.city}, ${selectedOptions.state}, ${selectedOptions.country}`,
            };
        }
    
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
