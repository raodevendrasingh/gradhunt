import React, { useEffect, useState } from "react";

// third party imports
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import axios from "axios";
import { toast } from "sonner";

// ui library components
import countryList from "react-select-country-list";
import Select from "react-select";

// local components
import { Header } from "@/components/common/Header";
import { MultiSelectDropdown } from "@/components/common/MultiSelectDropdown";
import { useStore } from "@/store/userStore";

// dropdown options
import {
	levels,
	experience,
	sectors,
	skills,
	functions,
} from "@/utils/selectObjects";

// dropdown styles
import { selectFieldStyle } from "@/utils/styles";

// assets
import blankUser from "@/assets/avatar/noUser.png";

export const RecruiterForm = () => {
	const { user, isAuthenticated } = useKindeAuth();
	const [image, setImage] = useState(null);
	const [dateTypeDOJ, setDateTypeDOJ] = useState("text");
	const [country, setCountry] = useState(countryList().getData());

	const navigate = useNavigate();

	// to generated unique username
	function generateUsername(firstName) {
		const firstFourLetters = firstName.slice(0, 4).toLowerCase();
		const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let randomCharacters = "";

		for (let i = 0; i < 5; i++) {
			randomCharacters += possibleCharacters.charAt(
				Math.floor(Math.random() * possibleCharacters.length)
			);
		}

		return `${firstFourLetters}${randomCharacters}`;
	}

	const {
		control,
		register,
		trigger,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			userType: "recruiter",
		},
	});

	useEffect(() => {
		if (isAuthenticated) {
			setValue("firstName", user.given_name);
			setValue("lastName", user.family_name);
			setValue("email", user.email);
		}
	}, [isAuthenticated, setValue, user]);

	// set usertype globally
	const userType = "recruiter";
	useStore.getState().setUserType(userType);

	// form submit logic
	const onSubmit = async (data) => {
        const transformedSkills = data.skills.map(skill => skill.value);

		const userDetails = {
			profilePicture: data.profilePicture,
			username: data.userName,
			usertype: data.userType,
			firstname: data.firstName,
			lastname: data.lastName,
			email: data.email,
		};

		const recruiterDetails = {
			companyName: data.companyName,
			jobTitle: data.jobTitle,
			startDate: data.dateOfJoining,
			Address1: data.companyAddress1,
			Address2: data.companyAddress2,
			city: data.city,
			state: data.state,
			country: data.country.label,
			zipcode: data.zipcode,
		};

		const hiringPreferences = {
			experience: data.experience.value,
			levels: data.levels,
			industry: data.sectors,
			function: data.functions,
			skills: transformedSkills,
		};

		const postData = {
			userDetails,
			recruiterDetails,
			hiringPreferences,
		};

		axios({
			url: "http://localhost:8000/api/save-recruiter-form-data/",
			method: "POST",
			data: postData,
		})
			.then((response) => {
				console.log(response.data);

				// set username globally
				const newUserName = response.data.username;
				useStore.getState().setUserName(newUserName);

				navigate("/profile");
				toast.success("Recruiter Profile Created!");

				console.log("Username:", newUserName);
			})
			.catch((error) => {
				toast.error("Error occured while creating profile. Try again! ");
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
			<Header />
			<section className="bg-white pt-20">
				<main className=" py-10 max-w-screen-2xl text h-full mx-auto ">
					<h1 className="text-2xl font-bold pb-5 pl-5">
						Create Recruiter Profile
					</h1>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col px-6 lg:flex-row gap-5"
					>
						{/* personal details section */}
						<div className="form-section lg:w-1/3 ">
							<h1 className="form-heading">Personal Details</h1>

							<div className="flex flex-col gap-3 p-6 ">
								{/* image file input */}
								<div className="flex justify-center">
									<label htmlFor="profilePicture" className="cursor-pointer">
										<div className="rounded-xl h-28 w-28 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden">
											{image ? (
												<img
													src={image}
													alt="Profile"
													className="h-full w-full object-cover"
												/>
											) : (
												<img
													src={blankUser}
													alt="Profile"
													className="h-full w-full object-cover"
												/>
											)}
										</div>
									</label>
									<input
										type="file"
										id="profilePicture"
										className="hidden"
										onChange={(event) => {
											// handle file upload here
											const file = event.target.files[0];
											const url = URL.createObjectURL(file);
											setImage(url);
										}}
									/>
								</div>

								<div className="w-full">
									<label htmlFor="uname" className="text-sm">
										User Name
									</label>
									<input
										{...register("userName", {
											required: "Username is required",
											maxLength: {
												value: 16,
												message: "Username cannot be more than 16 characters",
											},
											minLength: {
												value: 4,
												message: "Username must be at least 4 characters",
											},
											pattern: {
												value: /^[A-Za-z][A-Za-z0-9._]*$/i,
												message:
													"Username can only contain alphanumeric characters, periods, and underscores, and cannot start with a symbol",
											},
											validate: async (value) => {
												// Changed from 'exists' to 'validate' for clarity
												try {
													const response = await axios.get(
														`http://localhost:8000/api/check-username?username=${value}`
													);
													return (
														!response.data.exists || "Username already exists"
													);
												} catch (error) {
													console.error(error);
													return "Error checking username";
												}
											},
										})}
										onBlur={async () => {
											await trigger("userName");
										}}
										aria-invalid={errors.userName ? "true" : "false"}
										type="text"
										name="userName"
										id="uname"
										placeholder="Username"
										defaultValue={
											isAuthenticated ? generateUsername(user.given_name) : ""
										}
										className="form-input"
									/>
									{errors.userName && (
										<p className="form-error" role="alert">
											{errors.userName.message}
										</p>
									)}
								</div>

								{/* default usertype */}
								<div className="hidden">
									<input
										{...register("userType")}
										type="text"
										id="usertype"
										name="userType"
									/>
								</div>

								<div className="w-full">
									<label htmlFor="fname" className="text-sm">
										First Name
									</label>
									<input
										{...register("firstName", {
											required: "First name is required",
											maxLength: 20,
											minLength: {
												value: 2,
												message: "First name should be 2 characters atleast.",
											},
										})}
										aria-invalid={errors.firstName ? "true" : "false"}
										type="text"
										name="firstName"
										id="fname"
										placeholder="First Name"
										className="form-input"
									/>
									{errors.firstName && (
										<p className="form-error" role="alert">
											{errors.firstName.message}
										</p>
									)}
								</div>
								<div className="w-full">
									<label htmlFor="lname" className="text-sm">
										Last name
									</label>
									<input
										{...register("lastName", {
											required: "Last name is required",
											maxLength: 20,
											minLength: {
												value: 2,
												message: "Last name should be 2 characters atleast.",
											},
										})}
										aria-invalid={errors.lastName ? "true" : "false"}
										type="text"
										name="lastName"
										id="lname"
										placeholder="Last Name"
										className="form-input"
									/>
									{errors.lastName && (
										<p className="form-error" role="alert">
											{errors.lastName.message}
										</p>
									)}
								</div>

								<div className="w-full">
									<label htmlFor="email" className="text-sm">
										Company Email
									</label>
									<input
										{...register("email", {
											required: "Email Address is required",
											validate: {
												pattern: (value) => {
													const pattern =
														/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
													return pattern.test(value) || "Invalid email address";
												},
												exists: async (value) => {
													try {
														const response = await axios.get(
															`http://localhost:8000/api/check-email?email=${value}`
														);
														return (
															!response.data.exists || "Email already exists"
														);
													} catch (error) {
														console.error(error);
														return "Error checking email";
													}
												},
											},
										})}
										aria-invalid={errors.email ? "true" : "false"}
										type="email"
										name="email"
										id="email"
										placeholder="Email Address"
										className="form-input"
										onBlur={handleSubmit}
									/>
									{errors.email && (
										<p className="form-error" role="alert">
											{errors.email.message}
										</p>
									)}
								</div>

								
							</div>
						</div>

						{/* professional details section */}
						<div className="form-section lg:w-2/3 ">
							<h1 className="form-heading">Professional Details</h1>

							<div className="flex flex-col gap-3 p-6 border-b-2 border-slate-200 ">
								<div>
									<label htmlFor="companyName" className="text-sm">
										Company Name
									</label>
									<input
										{...register("companyName", {
											required: "Company name is required",
											maxLength: {
												value: 100,
												message:
													"Company name should not exceed 100 characters",
											},
										})}
										type="text"
										name="companyName"
										id="companyName"
										placeholder="Company Name"
										className="form-input"
									/>
									{errors.companyName && (
										<p className="form-error" role="alert">
											{errors.companyName.message}
										</p>
									)}
								</div>
								<div className="w-full flex flex-col sm:flex-row  gap-2">
									<div className="w-full sm:w-1/2 ">
										<label htmlFor="jobTitle" className="text-sm">
											Designation
										</label>
										<input
											{...register("jobTitle", {
												required: "Job title is required",
												maxLength: {
													value: 50,
													message: "Job title should not exceed 50 characters",
												},
											})}
											type="text"
											name="jobTitle"
											id="jobTitle"
											placeholder="Current Designation"
											className=" form-input"
										/>
										{errors.jobTitle && (
											<p className="form-error" role="alert">
												{errors.jobTitle.message}
											</p>
										)}
									</div>
									<div className="w-full sm:w-1/2  ">
										<label htmlFor="dateOfJoining" className="text-sm">
											Date Joined
										</label>
										<input
											{...register("dateOfJoining", {
												required: "Date of joining is required",
												validate: (value) => {
													const joinDate = new Date(value);
													const currentDate = new Date();
													const experience =
														currentDate.getFullYear() - joinDate.getFullYear();
													const isFutureDate = joinDate > currentDate;

													if (experience > 30) {
														return "Experience should not exceed 30 years";
													}

													if (isFutureDate) {
														return "Date of joining cannot be in the future";
													}

													return true;
												},
											})}
											type={dateTypeDOJ}
											onFocus={() => setDateTypeDOJ("date")}
											onBlur={() => setDateTypeDOJ("text")}
											placeholder="Date of Joining"
											name="dateOfJoining"
											id="dateOfJoining"
											className="form-input"
										/>
										{errors.dateOfJoining && (
											<p className="form-error" role="alert">
												{errors.dateOfJoining.message}
											</p>
										)}
									</div>
								</div>

								<h1 className=" text-sm font-bold ">Company Address</h1>

								<div className="w-full flex flex-col sm:flex-row gap-2">
									<div className="w-full sm:w-1/2 ">
										<label htmlFor="companyAddress1" className="text-sm">
											Address 1
										</label>
										<input
											{...register("companyAddress1", {
												required: "Address Line 1 is required",
												maxLength: {
													value: 100,
													message:
														"Address Line 1 should not exceed 100 characters",
												},
											})}
											type="text"
											name="companyAddress1"
											id="companyAddress1"
											placeholder="Address Line 1"
											className="form-input"
										/>
										{errors.companyAddress1 && (
											<p className="form-error" role="alert">
												{errors.companyAddress1.message}
											</p>
										)}
									</div>
									<div className="w-full sm:w-1/2 ">
										<label htmlFor="companyAddress2" className="text-sm">
											Address 2
										</label>
										<input
											{...register("companyAddress2", {
												maxLength: {
													value: 100,
													message:
														"Address Line 2 should not exceed 100 characters",
												},
											})}
											type="text"
											name="companyAddress2"
											id="companyAddress2"
											placeholder="Address Line 2"
											className="form-input"
										/>
										{errors.companyAddress2 && (
											<p className="form-error" role="alert">
												{errors.companyAddress2.message}
											</p>
										)}
									</div>
								</div>

								<div className="w-full flex flex-col sm:flex-row gap-2 ">
									<div className="w-full sm:w-1/2 flex gap-2 ">
										<div className="w-1/2">
											<label htmlFor="city" className="text-sm">
												City
											</label>
											<input
												{...register("city", {
													required: "City is required",
													maxLength: 20,
													minLength: {
														value: 3,
														message: "City should be 3 characters atleast.",
													},
												})}
												aria-invalid={errors.city ? "true" : "false"}
												type="text"
												name="city"
												id="city"
												placeholder="City"
												className="form-input"
											/>
											{errors.city && (
												<p className="form-error" role="alert">
													{errors.city.message}
												</p>
											)}
										</div>
										<div className="w-1/2">
											<label htmlFor="state" className="text-sm">
												State
											</label>
											<input
												{...register("state", {
													required: "State is required",
													maxLength: 20,
													minLength: {
														value: 2,
														message: "State should be 2 characters atleast.",
													},
												})}
												aria-invalid={errors.state ? "true" : "false"}
												type="text"
												name="state"
												id="state"
												placeholder="State"
												className="form-input"
											/>
											{errors.state && (
												<p className="form-error" role="alert">
													{errors.state.message}
												</p>
											)}
										</div>
									</div>
									<div className="w-full sm:w-1/2 flex gap-2">
										<div className="w-1/2">
											<label htmlFor="country" className="text-sm">
												Country
											</label>
											<Controller
												name="country"
												control={control}
												rules={{
													required: "Country is required",
												}}
												render={({ field }) => (
													<Select
														{...field}
														options={country}
														placeholder="Country"
														styles={selectFieldStyle}
													/>
												)}
											/>
											{errors.country && (
												<p className="form-error" role="alert">
													{errors.country.message}
												</p>
											)}
										</div>
										<div className="w-1/2">
											<label htmlFor="zipcode" className="text-sm">
												Zip Code
											</label>
											<input
												{...register("zipcode", {
													required: "Zipcode is required",
													maxLength: {
														value: 10,
														message:
															"Zipcode should be of atmost 10 characters.",
													},
													minLength: {
														value: 4,
														message:
															"Zipcode should be of atleast 4 characters.",
													},
												})}
												aria-invalid={errors.zipcode ? "true" : "false"}
												type="text"
												name="zipcode"
												id="zipcode"
												placeholder="Zipcode"
												className="form-input"
											/>
											{errors.zipcode && (
												<p className="form-error" role="alert">
													{errors.zipcode.message}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							<h1 className="form-heading border-slate-600  ">
								Hiring Preference
							</h1>
							<div className="flex flex-col gap-2 p-6">
								<div className="w-full flex flex-col sm:flex-row gap-2">
									<div className="w-full sm:w-1/2">
										<label htmlFor="experience" className="text-sm">
											Total Experience in hiring
										</label>
										<Controller
											name="experience"
											id="experience"
											control={control}
											rules={{
												required: "Experience is required",
											}}
											render={({ field }) => (
												<Select
													{...field}
													options={experience}
													placeholder="Select Experience"
													styles={selectFieldStyle}
												/>
											)}
										/>
										{errors.experience && (
											<p className="form-error">{errors.experience.message}</p>
										)}
									</div>

									<div className="w-full sm:w-1/2">
										<Controller
											control={control}
											name="levels"
											rules={{
												required: "At least one level must be selected",
											}}
											render={({ field }) => (
												<MultiSelectDropdown
													id="level"
													options={levels}
													label="Levels I hire for"
													buttonTitle="Select Levels"
													maxSelect="4"
													dropdownName="levels"
													selectedValues={field.value}
													onChange={field.onChange}
												/>
											)}
										/>
										{errors.levels && (
											<p className="form-error">{errors.levels.message}</p>
										)}
									</div>
								</div>

								<div className="w-full flex flex-col sm:flex-row gap-2">
									<div className="w-full sm:w-1/2">
										<Controller
											control={control}
											name="sectors"
											rules={{
												required: "At least one sector must be selected",
											}}
											render={({ field }) => (
												<MultiSelectDropdown
													id="sector"
													options={sectors}
													label="Sectors"
													buttonTitle="Select Industry"
													helpText="(Max. 5)"
													maxSelect="5"
													dropdownName="sectors"
													selectedValues={field.value}
													onChange={field.onChange}
												/>
											)}
										/>
										{errors.sectors && (
											<p className="form-error">{errors.sectors.message}</p>
										)}
									</div>
									<div className="w-full sm:w-1/2">
										<Controller
											control={control}
											name="functions"
											rules={{
												required: "At least one function must be selected",
											}}
											render={({ field }) => (
												<MultiSelectDropdown
													id="function"
													options={functions}
													label="Function"
													buttonTitle="Select Functions"
													helpText="(Max. 5)"
													maxSelect="5"
													dropdownName="functions"
													selectedValues={field.value}
													onChange={field.onChange}
												/>
											)}
										/>
										{errors.functions && (
											<p className="form-error">{errors.functions.message}</p>
										)}
									</div>
								</div>

								<div className="w-full flex">
									<div className="w-full">
										<label htmlFor="skills" className="text-sm">
											Skills I hire for
											<span className="text-xs text-gray-500 pl-2">
												(Max. 15)
											</span>
										</label>
										<Controller
											control={control}
											name="skills"
											rules={{
												required: "At least one skill must be selected",
											}}
											render={({ field }) => (
												<Select
													id="skills"
													isMulti
													name="skills"
													options={skills}
													onChange={(selected) => {
														if (selected.length <= 15) {
															field.onChange(selected);
														}
													}}
													value={field.value}
													placeholder="Skills"
													styles={selectFieldStyle}
												/>
											)}
										/>
										{errors.skills && (
											<p className="form-error">{errors.skills.message}</p>
										)}
									</div>
								</div>

								<div className="flex w-full my-5">
									<div className="text-sm flex flex-col gap-2 text-gray-500 dark:text-gray-400">
										<div className="flex flex-col">
											<div className="flex items-center gap-2">
												<Controller
													control={control}
													name="confirmDetails"
													rules={{ required: "You must confirm the details" }}
													render={({ field }) => (
														<input
															{...field}
															type="checkbox"
															className="form-checkbox outline-none ring-0 rounded h-6 w-6 text-indigo-500 ring-offset-0 "
														/>
													)}
												/>
												I confirm that the provided recruiter profile details
												are accurate and consent to their display on the
												GradHunt site. I agree to the terms and conditions and
												privacy policy.
											</div>
											{errors.confirmDetails && (
												<p className="form-error pl-6">
													{errors.confirmDetails.message}
												</p>
											)}
										</div>
									</div>
								</div>

								<div className="flex justify-end">
									<button className="inline-block shrink-0 rounded-md border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500">
										Submit Details
									</button>
								</div>
							</div>
						</div>
					</form>
				</main>
			</section>
		</>
	);
};
