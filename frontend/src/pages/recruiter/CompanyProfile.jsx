// hooks
import { useCallback, useEffect, useMemo, useState } from "react";

// third party library
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";
import debounce from "lodash/debounce";

// ui library

// icons
import { MdOutlineEdit, MdLocationPin } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";
import uploadPlaceholder from "@/assets/avatar/uploadPlaceholder.png";

// local imports
import { companySize } from "@/utils/selectObjects";
import { sectors } from "@/utils/selectObjects";
import { selectCompanyFieldStyle } from "@/utils/styles";
import axios from "axios";

export const CompanyProfile = () => {
	return (
		<div className="w-full pt-20 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto flex flex-col mb-3 gap-3 px-3">
					<section className="bg-white px-2 p-2 border rounded-xl shadow">
						<div className="flex justify-between items-center">
							<span className="font-semibold text-lg pl-1 text-gray-800">
								Company Profile
							</span>
							<Modal />
							{/* <MdOutlineEdit className="size-8 hover:bg-gray-100 rounded-full p-2" /> */}
						</div>

						<div className="mt-1 bg-white rounded-xl">
							<div className="h-[120px] mb-24">
								{/* cover pic box */}
								<div className="bg-gray-400/80 h-32 p-2 rounded-t-xl"></div>
								{/* logo box */}
								<div className="relative -top-12 left-2 sm:left-4 size-24 sm:size-28 rounded-xl z-10">
									<img src={CompanyLogo} alt="" />
								</div>
								<div className="relative -top-28  pb-2.5 sm:pb-6 bg-gray-100 p-2 flex flex-col sm:flex-row justify-start items-center gap-2 z-0 rounded-b-xl overflow-hidden">
									<div className="flex justify-between items-center ml-20 sm:ml-32 h-12 w-2/3 text-2xl p-2 ">
										{/* <span>+ Add Company Name</span> */}
										<span className="text-lg text-blue-600 pl-3">
											+ Add Company Name
										</span>
									</div>
									{/* company brief */}
									<div className="h-7 mt-2 sm:mt-0 text-sm bg-gray-50 text-gray-800 tracking-wide w-full sm:w-48  flex justify-center items-center rounded-full gap-1 px-2 hover:cursor-pointer">
										{/* <span>
										<TbWorldWww className="size-4" />
									</span>
									<span>company.com</span>
									<span>
										<FaArrowUpRightFromSquare className="size-3" />
									</span> */}
										<span className="text-xs text-blue-600 pl-3">
											+Add Website
										</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								{/* company stats */}

								<div className=" flex flex-col md:flex-row gap-1 bg-gray-50 text-sm p-2 rounded-xl">
									<div className="w-full md:w-2/3 flex gap-1">
										<div className="py-0.5 px-2 w-full md:w-1/2">
											Employees:
											<span className="text-xs text-blue-600 pl-3">
												+ Add Size
											</span>
										</div>
										<div className="py-0.5 px-2 w-full md:w-1/2">
											Estd.
											<span className="text-xs text-blue-600 pl-3">
												+ Add Estd Date
											</span>
										</div>
									</div>

									<div className="py-0.5 px-2 w-full md:w-1/3">
										Industry:
										<span className="text-xs text-blue-600 pl-3">
											+ Add Industry
										</span>
									</div>
								</div>
								{/* locations */}

								<div className=" bg-gray-50 p-2 rounded-xl">
									<span className="text-lg font-medium pl-2 text-gray-800">
										Headquarters
									</span>
									<div className="flex items-center pl-3 pt-1">
										{/* <span>
											<MdLocationPin />
										</span> */}
										{/* <span className="text-sm">Location</span> */}
										<span className="text-xs text-blue-600">
											+ Add Location
										</span>
									</div>
								</div>

								<div className=" bg-gray-50 p-2 rounded-xl">
									<span className="text-lg font-medium pl-2 text-gray-800">
										Other Branches
									</span>
									<div className="flex items-center flex-wrap gap-3 text-sm pt-1 pl-3">
										<span className="text-xs text-blue-600 ">
											+ Add Location
										</span>
									</div>
								</div>

								<div className=" bg-gray-50 p-2 rounded-xl">
									<span className="text-lg font-medium pl-2 text-gray-800">
										About
									</span>
									<p className="text-xs text-blue-600 pl-3">
										+ Add Description
									</p>
								</div>

								<div className=" bg-gray-50 p-2 rounded-xl">
									<span className="text-lg font-medium pl-2 text-gray-800">
										Company mission and values
									</span>
									<p className="text-xs text-blue-600 pl-3">
										+ Add Description
									</p>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export const Modal = () => {
	const [showModal, setShowModal] = useState(false);
	const [logo, setLogo] = useState();
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

	const [uploadStatus, setUploadStatus] = useState(""); // 'uploading', 'uploaded', 'error'
	const [errorMessage, setErrorMessage] = useState("");

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file format
		const validFormats = ["image/png", "image/jpeg", "image/jpg"];
		if (!validFormats.includes(file.type)) {
			setErrorMessage("Invalid file format");
			setUploadStatus("error");
			return;
		}

		setUploadStatus("uploading");
		try {
			const url = URL.createObjectURL(file);
			setLogo(url);
			setUploadStatus("uploaded");
			setErrorMessage(""); // Clear any previous error messages
		} catch (error) {
			setUploadStatus("error");
			setErrorMessage("Error in uploading file.");
		}
	};

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
			{state && <span>, {state}</span>}
			{country && <span>, {country}</span>}
		</div>
	);

	const onSubmit = async (data) => {
		const companyProfileData = {
			logo: logo,
			companyName: data.companyName,
			companyWebsite: data.companyWebsite,
			companySize: data.companySize,
			establishedYear: data.estdYear,
			industry: data.industry,
			headquarter: data.headquarter,
			branch: data.branch || "N/A",
			about: data.about,
			mission: data.mission,
		};

		console.log(companyProfileData);

		axios({
			url: "http://localhost:8000/api/save-company-profile/",
			method: "POST",
			data: companyProfileData,
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
					console.log("Error Response: ", error.response);
					console.log("Error Data: ", error.response.data);
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
												{/* company logo */}
												<div className="w-1/3 flex flex-col gap-3 justify-center items-center h-44 relative">
													<label
														htmlFor="uploadLogo"
														className={`bg-white text-gray-500 font-semibold text-base rounded-xl max-w-md size-32 flex flex-col items-center justify-center cursor-pointer border-2 ${
															uploadStatus === "uploading"
																? "border-blue-500"
																: "border-gray-400"
														} border-dashed hover:border-blue-500 mx-auto font-[sans-serif] transition-all duration-200`}
													>
														{logo ? (
															<img
																src={logo}
																alt="Profile"
																className="h-full w-full object-cover rounded-xl"
															/>
														) : (
															<img
																src={uploadPlaceholder}
																alt="Profile"
																className="h-full w-full object-cover"
															/>
														)}
													</label>
													<input
														type="file"
														id="uploadLogo"
														className="hidden"
														onChange={handleFileChange}
													/>
													{uploadStatus === "uploading" && (
														<span className="text-blue-500 text-xs">File uploading...</span>
													)}
													{uploadStatus === "uploaded" && (
														<span className="text-green-600 text-xs">File uploaded.</span>
													)}
													{uploadStatus === "error" && (
														<span className="text-red-500 text-xs">{errorMessage}</span>
													)}
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
