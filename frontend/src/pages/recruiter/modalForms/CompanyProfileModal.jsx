// hooks
import { useCallback, useEffect, useMemo, useState } from "react";

// third party library
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";
import debounce from "lodash/debounce";

// icons
import { MdOutlineEdit } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";

// local imports
import { companySize } from "@/utils/selectObjects";
import { sectors } from "@/utils/selectObjects";
import { selectCompanyFieldStyle } from "@/utils/styles";
import axios from "axios";
import { useStore } from "@/store/userStore.js";

export const CompanyProfileModal = () => {
	const [showModal, setShowModal] = useState(false);
	const currentYear = new Date().getFullYear();
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [cityOptions, setCityOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCities = useCallback(async (inputValue) => {
		// console.log("Fetching cities for:", inputValue);

		if (typeof inputValue !== "string" || inputValue.length < 2) {
			console.log("Input value invalid, clearing options");
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
				"x-rapidapi-key": import.meta.env.VITE_KINDE_RAPID_API_KEY,
				"x-rapidapi-host": import.meta.env.VITE_KINDE_RAPID_API_HOST,
			},
		};

		try {
			// console.log("Making API request with options:", options);
			const response = await axios.request(options);
			// console.log("API response:", response.data);
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
	}, []);

	const debouncedFetchCities = useMemo(
		() => debounce(fetchCities, 300),
		[fetchCities]
	);

	const handleInputChange = useCallback(
		(inputValue, { action }) => {
			// console.log("handleInputChange called with:", inputValue, action);
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
			{state && <span>,{" "}{state}</span>}
			{country && <span>,{" "}{country}</span>}
		</div>
	);

	const { userName, setUserName } = useStore((state) => ({
		userName: state.userName,
		setUserName: state.setUserName,
	}));

	useEffect(() => {
		// Fetch userName from localStorage if it's not already set
		if (!userName) {
			const storedUserName = localStorage.getItem("userName");
			if (storedUserName) {
				setUserName(storedUserName);
			}
		}
	}, [userName, setUserName]);

	// console.log(userName);

	const onSubmit = async (data) => {
		const companyProfileData = {
			companyName: data.companyName,
			companyWebsite: data.companyWebsite,
			companySize: data.companySize,
			establishedYear: data.estdYear,
			industry: data.industry.value,
			headquarters: data.headquarter.value,
			branch: data.branch || "N/A",
			about: data.about,
			values: data.mission,
		};

		console.log(companyProfileData);

		axios({
			url: `http://localhost:8000/api/recruiter/${userName}/update-company-data`,
			method: "POST",
			data: companyProfileData,
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				console.log(response.data);
				toast.success("Company Profile Updated");
				setShowModal(false);
			})
			.catch((error) => {
				toast.error("Error occured while updating profile. Try again!");
				if (error.response) {
					console.log("Error Status: ", error.response.status);
					console.log("Error Message: ", error.message);
					console.log("Error Response: ", error.response.request.response);
				} else if (error.request) {
					console.log("Error Request: ", error.request);
				} else {
					console.log("Error Message: ", error.message);
				}
			});
	};

	return (
		<>
			<button type="button" onClick={() => setShowModal(true)}>
				<MdOutlineEdit className="size-8 hover:bg-gray-100 rounded-full p-2" />
			</button>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
						<div className="relative my-6 mx-10 sm:mx-auto  w-full min-w-[350px] sm:min-w-[500px] sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[90vh] overflow-hidden">
								{/*header*/}
								<div className="flex items-start justify-between p-3 border-b border-solid border-blueGray-200 rounded-t">
									<h3 className="text-xl font-semibold">
										Edit Company Profile
									</h3>
									<button
										className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
										onClick={() => setShowModal(false)}
									>
										<span className="bg-transparent text-gray-800 h-6 w-6 text-2xl block outline-none focus:outline-none">
											<FaXmark />
										</span>
									</button>
								</div>
								{/*body*/}
								<div
									className="p-6 overflow-y-auto"
									style={{ maxHeight: "calc(90vh - 120px)" }}
								>
									<div className="flex flex-col gap-3">
										<form
											id="companyProfileForm"
											onSubmit={handleSubmit(onSubmit)}
										>
											{/* comapny detail section */}
											<div className="flex flex-col-reverse sm:flex-row items-center gap-3 border-b pb-3 mb-3">
												<div className="flex flex-col w-full gap-2">
													<div className="w-full flex flex-col h-20 relative">
														<label
															htmlFor="companyName"
															className="text-sm pb-1"
														>
															Company Name
														</label>
														<input
															{...register("companyName", {
																required: "Company name is required",
																minLength: {
																	value: 2,
																	message:
																		"Company name shoud be alteast 2 characters",
																},
																maxLength: 50,
															})}
															aria-invalid={
																errors.companyName ? "true" : "false"
															}
															type="text"
															name="companyName"
															id="companyName"
															placeholder="Company Name"
															className="border-2 px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
														/>
														{errors.companyName && (
															<span className="form-error" role="alert">
																{errors.companyName.message}
															</span>
														)}
													</div>
													<div className="w-full flex flex-col h-20 relative">
														<label
															htmlFor="companyWebsite"
															className="text-sm pb-1"
														>
															Website
														</label>
														<input
															{...register("companyWebsite", {
																required: "Company Website is required",
																pattern: {
																	value:
																		/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
																	message: "Please enter a valid URL",
																},
															})}
															aria-invalid={
																errors.companyWebsite ? "true" : "false"
															}
															name="companyWebsite"
															type="text"
															id="companyWebsite"
															placeholder="e.g. https://example.com/"
															className="border-2 px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
														/>
														{errors.companyWebsite && (
															<span className="form-error" role="alert">
																{errors.companyWebsite.message}
															</span>
														)}
													</div>
												</div>
												
											</div>
											{/* company stats section */}
											<div className="flex flex-col md:flex-row w-full md:gap-2 lg:gap-2 border-b pb-6 mb-1">
												<div className="flex justify-center items-center gap-2 w-full md:w-2/3">
													<div className="w-1/2 flex flex-col h-20 relative">
														<label
															htmlFor="estdYear"
															className="text-sm pb-1 pt-2"
														>
															Established Year
														</label>
														<input
															{...register("estdYear", {
																required: "Established year is required",
																minLength: {
																	value: 4,
																	message: "Year must contain 4 digits",
																},
																maxLength: {
																	value: 4,
																	message: "Year should contain only 4 digits",
																},
																pattern: {
																	// This regex matches a four-digit number from 1901 to the current year
																	value: new RegExp(
																		`^(19[0-9][1-9]|20[0-1][0-9]|20[2][0-${currentYear % 100}])$`
																	),

																	message: `Year must be between 1901 and ${currentYear}`,
																},
															})}
															aria-invalid={errors.estdYear ? "true" : "false"}
															name="estdYear"
															type="text"
															id="estdYear"
															placeholder="YYYY"
															className="border-2 px-2 py-1.5 rounded-lg border-gray-400 focus:border-blue-500"
														/>
														{errors.estdYear && (
															<span className="form-error" role="alert">
																{errors.estdYear.message}
															</span>
														)}
													</div>
													<div className="w-1/2 flex flex-col h-20 relative">
														<label
															htmlFor="companySize"
															className="text-sm pb-1 pt-2"
														>
															Company Size
														</label>
														<Controller
															name="companySize"
															id="companysite"
															control={control}
															rules={{
																required: "Company Size is required",
															}}
															render={({ field }) => (
																<Select
																	{...field}
																	options={companySize}
																	placeholder="Company Size"
																	styles={selectCompanyFieldStyle}
																/>
															)}
														/>
														{errors.companySize && (
															<span className="form-error" role="alert">
																{errors.companySize.message}
															</span>
														)}
													</div>
												</div>
												<div className="w-full md:w-1/3 flex flex-col h-20 relative">
													<label
														htmlFor="industry"
														className="text-sm pb-1 pt-2"
													>
														Industry
													</label>
													<Controller
														name="industry"
														control={control}
														id="companysite"
														rules={{
															required: "Industry is required",
														}}
														render={({ field }) => (
															<Select
																{...field}
																options={sectors}
																placeholder="Select Industry"
																styles={selectCompanyFieldStyle}
															/>
														)}
													/>
													{errors.industry && (
														<span className="form-error" role="alert">
															{errors.industry.message}
														</span>
													)}
												</div>
											</div>
											{/* company locations */}
											<div className="flex flex-col w-full gap-2 border-b pb-6 mb-1">
												<div className="w-full flex flex-col h-20 relative">
													<label
														htmlFor="headquarter"
														className="text-sm pb-1 pt-2"
													>
														Headquarters
													</label>
													<Controller
														name="headquarter"
														control={control}
														rules={{ required: "Headquarters is required" }}
														render={({ field }) => (
															<Select
																{...field}
																isClearable
																isSearchable
																isLoading={isLoading}
																onInputChange={handleInputChange}
																options={cityOptions}
																formatOptionLabel={formatOptionLabel}
																id="headquarter"
																placeholder="Company headquarter"
																styles={selectCompanyFieldStyle}
																classNamePrefix="select"
																noOptionsMessage={({ inputValue }) =>
																	inputValue.length < 2
																		? "Type at least 2 characters to search"
																		: error
																			? error
																			: "No options found"
																}
															/>
														)}
													/>
													{errors.headquarter && (
														<span className="form-error" role="alert">
															{errors.headquarter.message}
														</span>
													)}
												</div>
												<div className="w-full flex flex-col h-20 relative">
													<label htmlFor="branch" className="text-sm pb-1 pt-2">
														Other Branches
													</label>
													<Controller
														name="branch"
														control={control}
														rules={{ required: "Headquarters is required" }}
														render={({ field }) => (
															<Select
																{...field}
																isMulti
																isClearable
																isSearchable
																isLoading={isLoading}
																onInputChange={handleInputChange}
																options={cityOptions}
																formatOptionLabel={formatOptionLabel}
																id="headquarter"
																placeholder="Company Branch"
																styles={selectCompanyFieldStyle}
																classNamePrefix="select"
																noOptionsMessage={({ inputValue }) =>
																	inputValue.length < 2
																		? "Type at least 2 characters to search"
																		: error
																			? error
																			: "No options found"
																}
															/>
														)}
													/>
													{errors.branch && (
														<span className="form-error" role="alert">
															{errors.branch.message}
														</span>
													)}
												</div>
											</div>
											{/* about section */}
											<div>
												<div className="flex flex-col w-full relative">
													<label htmlFor="about" className="text-sm pb-1 pt-2">
														About Company
													</label>
													<textarea
														{...register("about", {
															required: "About Company is required",
															minLength: {
																value: 100,
																message: "Minimum 100 characters are required",
															},
															maxLength: {
																value: 1500,
																message:
																	"About section should not exceed 1500 characters",
															},
														})}
														name="about"
														id="about"
														placeholder="Share details about your company"
														rows="3"
														className="w-full px-2 py-1.5 border-2 rounded-lg border-gray-400 focus:border-blue-500"
													></textarea>
													{errors.about && (
														<span className="form-error" role="alert">
															{errors.about.message}
														</span>
													)}
												</div>
											</div>
											{/* missions and value section */}
											<div>
												<div className="flex flex-col w-full relative">
													<label
														htmlFor="mission"
														className="text-sm pb-1 pt-2"
													>
														Mission and Values
													</label>
													<textarea
														{...register("mission", {
															required: "Mission and values are required",
															minLength: {
																value: 100,
																message: "Minimum 100 characters are required",
															},
															maxLength: {
																value: 1500,
																message:
																	"Mission and values should not exceed 1500 characters",
															},
														})}
														name="mission"
														id="mission"
														rows="3"
														placeholder="Share company mission and values"
														className="w-full px-2 py-1.5 border-2 rounded-lg border-gray-400 focus:border-blue-500"
													></textarea>
													{errors.mission && (
														<span className="form-error" role="alert">
															{errors.mission.message}
														</span>
													)}
												</div>
											</div>
										</form>
									</div>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-end p-4 border-t border-solid border-blueGray-200 rounded-b">
									<button
										className="text-red-500 font-semibold border rounded-xl px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 hover:bg-rose-500 hover:text-white ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
									<button
										className="bg-green-600 text-white active:bg-green-700 font-semibold border rounded-xl text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="submit"
										form="companyProfileForm"
									>
										Save Changes
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};