// hooks
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

// external
import axios from "axios";
import { toast } from "sonner";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

// local
import { languageProficiency } from "@/utils/selectObjects";
import { selectFieldStyle } from "@/utils/styles";

// icons
import {
	HiOutlineXMark,
	HiOutlineArrowLeft,
	HiOutlineArrowRight,
	HiOutlineTrash,
} from "react-icons/hi2";
import { LocationSelect } from "@/helpers/LocationSelect";
import { UserBasicDetails } from "@/types/userTypes";
import Spinner from "@/components/ui/Spinner";

const screens = ["Add Basic Info", "Add Social Links", "Add Languages"];

export const AddBasicDetailModal: React.FC<{
	setShowBasicDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowBasicDetailModal }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);

	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isValid },
		trigger,
		watch,
	} = useForm<UserBasicDetails>({
		mode: "onChange",
		defaultValues: {
			socialLinks: {},
		},
	});

	const handleNext = async (e: React.MouseEvent) => {
		e.preventDefault();
		const isValid = await trigger();
		if (isValid) {
			setSlideDirection(1);
			setCurrentScreen((prev) => prev + 1);
		}
	};

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		setSlideDirection(-1);
		setCurrentScreen((prev) => prev - 1);
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return (
					<BasicInfoScreen
						register={register}
						errors={errors}
						control={control}
					/>
				);
			case 1:
				return <SocialLinksScreen register={register} errors={errors} />;
			case 2:
				return <LanguagesScreen control={control} errors={errors} />;
			default:
				return null;
		}
	};

	const onSubmit: SubmitHandler<UserBasicDetails> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = "/api/add-user-data";
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			// console.log(response.data);
			toast.success("Details Updated");
			setShowBasicDetailModal(false);
		} catch (error: any) {
			toast.error("Error occurred while updating information. Try again!");
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
			>
				<motion.div
					initial={{ scale: 0.9, rotate: "0deg" }}
					animate={{ scale: 1, rotate: "0deg" }}
					exit={{ scale: 0, rotate: "0deg" }}
					onClick={(e) => e.stopPropagation()}
					className="bg-white p-4 rounded-2xl sm:mx-auto w-full max-w-[350px] xs:max-w-md sm:max-w-lg shadow-xl cursor-default relative overflow-hidden"
				>
					<div className="relative z-10">
						<div className="flex items-start justify-between ml-1 rounded-t">
							<h3 className="text-xl font-semibold text-gray-800 mt-1">
								{screens[currentScreen]}
							</h3>
							<button
								className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowBasicDetailModal(false)}
							>
								<span className="bg-transparent text-gray-800">
									<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
								</span>
							</button>
						</div>
						<form id="basicDetailForm" onSubmit={handleSubmit(onSubmit)}>
							<motion.div
								key={currentScreen}
								initial={{ x: slideDirection * 50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -slideDirection * 50, opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="h-[45vh] overflow-y-auto scroll-smooth"
							>
								<div className="p-3">
									<div className="flex flex-col gap-3">{renderScreen()}</div>
								</div>
							</motion.div>
							<div
								className={`flex items-center mt-4 ${
									currentScreen === 0
										? "justify-end"
										: currentScreen > 0 && "justify-between"
								}`}
							>
								{currentScreen > 0 && (
									<button
										type="button"
										onClick={handlePrevious}
										className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
									>
										<HiOutlineArrowLeft className="mr-2" /> Previous
									</button>
								)}
								{currentScreen < screens.length - 1 ? (
									<button
										type="button"
										onClick={handleNext}
										disabled={!isValid}
										className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
									>
										Next <HiOutlineArrowRight className="ml-2" />
									</button>
								) : (
									<button
										type="submit"
										disabled={!isValid || isLoading}
										className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
									>
										{isLoading ? (
											<span className="flex items-center">
												<span className="mr-2">Saving</span>
												<Spinner />
											</span>
										) : (
											"Save"
										)}
									</button>
								)}
							</div>
						</form>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

const BasicInfoScreen: React.FC<{
	errors: any;
	control: any;
	register: any;
}> = ({ errors, control, register }) => {
	const [bio, setBio] = useState("");
	const maxChars = 250;

	return (
		<div className="flex flex-col items-center gap-5">
			<div className="w-full flex flex-col sm:flex-row gap-3">
				<div className="w-full flex flex-col sm:w-1/2">
					<label
						htmlFor="firstname"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						First Name
					</label>
					<input
						{...register("firstname", {
							required: "First Name is required",
							minLength: {
								value: 2,
								message: "First Name should be at least 2 characters",
							},
							maxLength: 50,
						})}
						aria-invalid={errors.firstname ? "true" : "false"}
						type="text"
						name="firstname"
						id="firstname"
						placeholder="First Name"
						className="border py-2 rounded-md border-gray-200 w-full"
					/>
					{errors.firstname && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.firstname.message as string}
						</span>
					)}
				</div>
				<div className="w-full flex flex-col sm:w-1/2 ">
					<label
						htmlFor="lastname"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						Last Name
					</label>
					<input
						{...register("lastname", {
							required: "Last Name is required",
							minLength: {
								value: 2,
								message: "Last Name should be at least 2 characters",
							},
							maxLength: 50,
						})}
						aria-invalid={errors.lastname ? "true" : "false"}
						type="text"
						name="lastname"
						id="lastname"
						placeholder="Last Name"
						className="border py-2 rounded-md border-gray-200 w-full"
					/>
					{errors.lastname && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.lastname.message as string}
						</span>
					)}
				</div>
			</div>
			<div className="w-full flex flex-col">
				<label
					htmlFor="bio"
					className="text-sm font-semibold text-gray-700 pb-1"
				>
					Bio
				</label>
				<textarea
					{...register("bio", {
						minLength: {
							value: 10,
							message: "Minimum 10 characters are required",
						},
						maxLength: {
							value: 250,
							message: "Bio length should not exceed 250 characters",
						},
					})}
					name="bio"
					id="bio"
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					maxLength={maxChars}
					placeholder=""
					rows={2}
					className="border py-2 rounded-md border-gray-200 w-full"
				></textarea>
				<div className="flex relative">
					{errors.bio && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.bio.message as string}
						</span>
					)}
					<span className="absolute right-0 text-xs text-gray-600">
						({maxChars - bio.length}/{maxChars})
					</span>
				</div>
			</div>
			<div className="w-full flex flex-col">
				<label
					htmlFor="location"
					className="text-sm font-semibold text-gray-700 pb-1"
				>
					Location
				</label>
				<LocationSelect
					control={control}
					name="location"
					placeholder="Location"
					error={errors.location?.message}
					rules={{
						required: "Location is required",
					}}
					menuPlacement="top"
				/>
			</div>
		</div>
	);
};

const SocialLinksScreen: React.FC<{
	register: any;
	errors: any;
}> = ({ register, errors }) => (
	<div className="space-y-4">
		{["linkedin", "github", "leetcode", "twitter"].map((sitename) => (
			<div key={sitename}>
				<label
					htmlFor={sitename}
					className="block text-sm font-medium text-gray-700 mb-1 capitalize"
				>
					{sitename}
				</label>
				<input
					{...register(`socialLinks.${sitename}`, {
						pattern: {
							value:
								/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
							message: "Please enter a valid URL",
						},
					})}
					className="border py-2 rounded-md border-gray-200 w-full"
					placeholder={`https://${sitename}.com/yourusername`}
				/>
				{errors.socialLinks?.[sitename] && (
					<span className="text-red-500 text-xs mt-1">
						{errors.socialLinks[sitename].message}
					</span>
				)}
			</div>
		))}
	</div>
);

const LanguagesScreen: React.FC<{
	control: any;
	errors: any;
}> = ({ control, errors }) => {
	return (
		<div className="space-y-4">
			<Controller
				name="languages"
				control={control}
				defaultValue={[]}
				rules={{
					validate: (value) => {
						if (!value || value.length === 0) {
							return "Add at least one language";
						}
						if (
							!value.some(
								(lang: { language: any; proficiency: any }) =>
									lang.language && lang.proficiency
							)
						) {
							// return "Ensure all language fields are filled";
						}
						return true;
					},
				}}
				render={({ field }) => (
					<>
						{field.value && field.value.length > 0
							? field.value.map(
									(
										lang: {
											language: string;
											proficiency: string;
										},
										index: number
									) => (
										<div key={index} className="flex items-center space-x-2">
											<input
												type="text"
												value={lang.language}
												onChange={(e) => {
													const newLangs = [...field.value];
													newLangs[index].language = e.target.value;
													field.onChange(newLangs);
												}}
												placeholder="Language"
												className="w-1/2 border py-2 rounded-md border-gray-200"
											/>
											<Select
												value={languageProficiency.find(
													(option) => option.value === lang.proficiency
												)}
												options={languageProficiency}
												onChange={(selectedOption) => {
													const newLangs = [...field.value];
													newLangs[index].proficiency =
														selectedOption?.value || "";
													field.onChange(newLangs);
												}}
												styles={selectFieldStyle}
												className="w-2/5"
												menuPlacement="auto"
											/>
											<button
												type="button"
												onClick={() => {
													if (field.value.length > 1) {
														const newLangs = field.value.filter(
															(_: any, i: number) => i !== index
														);
														field.onChange(newLangs);
													}
												}}
												className="w-1/10 p-2 text-red-500 rounded-lg transition-colors"
												disabled={field.value.length === 1}
											>
												<HiOutlineTrash />
											</button>
										</div>
									)
								)
							: null}
						{errors.languages && (
							<span className="text-red-500 text-sm">
								{errors.languages.message as string}
							</span>
						)}
						<button
							type="button"
							onClick={() => {
								const currentValue = field.value || [];
								if (currentValue.length < 5) {
									field.onChange([
										...currentValue,
										{ language: "", proficiency: "" },
									]);
								}
							}}
							className="w-full mt-2 px-4 py-2 bg-slate-200 text-black rounded-lg hover:bg-slate-300 transition-colors"
							disabled={field.value && field.value.length >= 5}
						>
							Add Language
						</button>
					</>
				)}
			/>
		</div>
	);
};
