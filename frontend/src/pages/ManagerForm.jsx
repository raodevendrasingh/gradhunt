import { useForm } from "react-hook-form";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import { useStore } from "../store/userStore";
import axios from "axios";

export const ManagerForm = () => {
	const [dateTypeDOB, setDateTypeDOB] = useState("text");
	const [dateTypeDOJ, setDateTypeDOJ] = useState("text");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// zustand store
	const setUserType = useStore((state) => state.setUserType); // Get the setter function for userType
    const setUserId = useStore((state) => state.setUserId);

	// const onSubmit = (data) => console.log(data);
	const onSubmit = async (data) => {
		console.log(data);
		console.log(errors);
		const userType = "hiring-manager";
		setUserType(userType);

		// Prepare the data to be sent
		const personalDetails = {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			dateOfBirth: data.dateOfBirth,
			gender: data.gender,
			country: data.country,
			timezone: data.timezone,
		};

		const employmentDetails = {
			companyName: data.companyName,
			jobTitle: data.jobTitle,
			start_date: data.dateOfJoining,
			companyLocation: data.companyLocation,
		};
		const postData = { userType, personalDetails, employmentDetails };

		axios({
			url: "http://localhost:8000/api/managers/",
			method: "POST",
			data: postData,
		})
			.then((response) => {
				console.log(response.data);
				console.log(response.data.userId);
                const newUserId = response.data.id;
                setUserId(newUserId);
			})
			.catch((error) => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
				} else if (error.request) {
					// The request was made but no response was received
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log("Error", error.message);
				}
				console.log(error.config);
			});
	};
	return (
		<>
			<Navbar />
			<section className="bg-gray-50 pt-20">
				<div className="lg:grid lg:min-h-screen lg:grid-cols-12 lg:items-center lg:justify-items-center">
					<main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-12 lg:px-16 lg:py-12 xl:col-span-12">
						<div className="max-w-xl min-w-3xl lg:max-w-3xl ">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="mt-8 grid grid-cols-6 gap-6"
							>
								<div className="col-span-6 pt-3 pb-1">
									<h2 className="text-xl font-medium text-gray-900">
										Personal Details
									</h2>
								</div>
								<div className="col-span-6 sm:col-span-3">
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
										placeholder="First Name"
										className="mt-1 focus:ring-0 focus:outline-none text-lg w-full rounded-lg border-gray-200 bg-white text-gray-700 shadow-sm"
									/>
									{errors.firstName && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.firstName.message}
										</p>
									)}
								</div>

								<div className="col-span-6 sm:col-span-3">
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
										placeholder="Last Name"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.lastName && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.lastName.message}
										</p>
									)}
								</div>
								<div className="col-span-6">
									<input
										{...register("email", {
											required: "Email Address is required",
											validate: (value) => {
												const pattern =
													/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
												return pattern.test(value) || "Invalid email address";
											},
										})}
										aria-invalid={errors.email ? "true" : "false"}
										type="email"
										name="email"
										placeholder="email@company.com"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.email && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.email.message}
										</p>
									)}
								</div>
								<div className="col-span-6 sm:col-span-3">
									<input
										{...register("dateOfBirth", {
											required: "Date of Birth is required",
											validate: (value) => {
												const today = new Date();
												const birthDate = new Date(value);
												let age = today.getFullYear() - birthDate.getFullYear();
												const m = today.getMonth() - birthDate.getMonth();
												if (
													m < 0 ||
													(m === 0 && today.getDate() < birthDate.getDate())
												) {
													age--;
												}
												return (
													(age >= 18 && age <= 60) ||
													"Age must be between 18 and 60"
												);
											},
										})}
										type={dateTypeDOB}
										onFocus={() => setDateTypeDOB("date")}
										onBlur={() => setDateTypeDOB("text")}
										placeholder="Date of Birth"
										name="dateOfBirth"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.dateOfBirth && (
										<p className="text-red-500 text-xs mt-1">
											{errors.dateOfBirth.message}
										</p>
									)}
								</div>

								<div className="col-span-6 sm:col-span-3">
									<select
										{...register("gender", { required: "Gender is required" })}
										id="gender"
										name="gender"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									>
										<option value="">Select gender</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="other">Other</option>
									</select>
									{errors.gender && (
										<p className="text-red-500 text-xs mt-1">
											{errors.gender.message}
										</p>
									)}
								</div>
								<div className="col-span-6 sm:col-span-3">
									<select
										{...register("country", {
											required: "Country is required",
										})}
										name="country"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									>
										<option value="">Country</option>
										<option value="country1">country1</option>
										<option value="country2">country2</option>
										<option value="country3">country3</option>
									</select>
									{errors.country && (
										<p className="text-red-500 text-xs mt-1">
											{errors.country.message}
										</p>
									)}
								</div>
								<div className="col-span-6 sm:col-span-3">
									<select
										{...register("timezone", {
											required: "Timezone is required",
										})}
										name="timezone"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									>
										<option value="">Time Zone</option>
										<option value="timezone1">timezone1</option>
										<option value="timezone2">timezone2</option>
										<option value="timezone3">timezone3</option>
									</select>
									{errors.timezone && (
										<p className="text-red-500 text-xs mt-1">
											{errors.timezone.message}
										</p>
									)}
								</div>

								{/* Current Employement Details */}
								<div className="col-span-6 pt-3 pb-1">
									<h2 className="text-xl font-medium text-gray-900">
										Current Employement Details
									</h2>
								</div>
								<div className="col-span-6">
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
										placeholder="Company Name"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.companyName && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.companyName.message}
										</p>
									)}
								</div>
								<div className="col-span-6 sm:col-span-3">
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
										placeholder="Job Title"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.jobTitle && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.jobTitle.message}
										</p>
									)}
								</div>

								<div className="col-span-6 sm:col-span-3">
									<input
										{...register("dateOfJoining", {
											required: "Date of joining is required",
											validate: (value) => {
												const joinDate = new Date(value);
												const currentDate = new Date();
												const experience =
													currentDate.getFullYear() - joinDate.getFullYear();
												return (
													experience <= 30 ||
													"Experience should not exceed 30 years"
												);
											},
										})}
										type={dateTypeDOJ}
										onFocus={() => setDateTypeDOJ("date")}
										onBlur={() => setDateTypeDOJ("text")}
										placeholder="Date of Joining"
										name="dateOfJoining"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.dateOfJoining && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.dateOfJoining.message}
										</p>
									)}
								</div>
								<div className="col-span-6">
									<input
										{...register("companyLocation", {
											required: "Company location is required",
											maxLength: {
												value: 100,
												message:
													"Company location should not exceed 100 characters",
											},
										})}
										type="text"
										name="companyLocation"
										placeholder="Company Location"
										className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
									/>
									{errors.companyLocation && (
										<p className="text-red-500 text-sm" role="alert">
											{errors.companyLocation.message}
										</p>
									)}
								</div>

								<div className="col-span-6">
									<p className="text-sm text-gray-500 dark:text-gray-400">
										I hereby confirm that the details provided are correct and
										true to my best knowledge.
										<br />I agree to the{" "}
										<a
											href="#"
											className="text-gray-700 underline dark:text-gray-200"
										>
											terms and conditions
										</a>{" "}
										and{" "}
										<a
											href="#"
											className="text-gray-700 underline dark:text-gray-200"
										>
											{" "}
											privacy policy
										</a>{" "}
										.
									</p>
								</div>

								<div className="col-span-6 sm:flex sm:items-center sm:justify-center sm:gap-4">
									<button className="inline-block shrink-0 rounded-md border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500">
										Submit Details
									</button>
								</div>
							</form>
						</div>
					</main>
				</div>
			</section>
		</>
	);
};
