// hooks
import { useState } from 'react';
import { useCitySearch } from '@/hooks/useCitySearch';
import { useAuth, useUser } from '@clerk/clerk-react';

// external
import axios from 'axios';
import { toast } from 'sonner';
import Select from 'react-select';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

// local
import { languageProficiency } from '@/utils/selectObjects';
import { selectCompanyFieldStyle } from '@/utils/styles';

// icons
import {
	HiOutlineXMark,
	HiOutlineArrowLeft,
	HiOutlineArrowRight,
	HiOutlineTrash,
} from "react-icons/hi2";

interface FormData {
	firstName: string;
	lastName: string;
	bio: string;
	location: string;
	socialLinks: {
		linkedin?: string;
		github?: string;
		leetcode?: string;
		twitter?: string;
	};
	languages: { language: string; proficiency: string }[];
}

const screens = ["Add Basic Info", "Add Social Links", "Add Languages"];

export const AddBasicDetailModal: React.FC<{
	onSave: () => void;
	setShowBasicDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowBasicDetailModal, onSave }) => {
	const { isSignedIn } = useUser();
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);

	const { getToken } = useAuth();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isValid },
		trigger,
	} = useForm<FormData>({
		mode: "onChange",
		defaultValues: {
			socialLinks: {},
		},
	});

	const {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
		handleSelection,
	} = useCitySearch();

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
						error={error}
						errors={errors}
						control={control}
						cityOptions={cityOptions}
						isLoading={isLoading}
						handleInputChange={handleInputChange}
						handleSelection={handleSelection}
						formatOptionLabel={formatOptionLabel}
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

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		console.log("Form data:", data);

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = "/api/add-basic-data";
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("Information Added");
			onSave();
			setShowBasicDetailModal(false);
		} catch (error: any) {
			toast.error("Error occurred while updating information. Try again!");
			console.error("Error:", error);
		}
	};

	return (
		isSignedIn && (
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
								<div className="flex justify-between mt-4">
									{currentScreen > 0 && (
										<button
											type="button"
											onClick={handlePrevious}
											className="flex items-center px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-[10px] hover:bg-gray-300 transition-colors"
										>
											<HiOutlineArrowLeft className="mr-2" /> Previous
										</button>
									)}
									{currentScreen < screens.length - 1 ? (
										<button
											type="button"
											onClick={handleNext}
											disabled={!isValid}
											className="flex items-center text-sm px-4 py-2 bg-zinc-800 text-white rounded-[10px] hover:bg-zinc-900 disabled:bg-zinc-900/60 disabled:cursor-not-allowed transition-colors ml-auto"
										>
											Next <HiOutlineArrowRight className="ml-2" />
										</button>
									) : (
										<button
											type="submit"
											disabled={!isValid}
											className="px-4 py-2 bg-zinc-800 text-sm text-white rounded-[10px] hover:bg-zinc-900 transition-colors ml-auto"
										>
											Save
										</button>
									)}
								</div>
							</form>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};

const BasicInfoScreen: React.FC<{
	error: any;
	errors: any;
	control: any;
	register: any;
	handleSelection: any;
	isLoading: boolean;
	formatOptionLabel: any;
	handleInputChange: any;
	cityOptions: any[];
}> = ({
	error,
	errors,
	control,
	register,
	handleSelection,
	isLoading,
	formatOptionLabel,
	handleInputChange,
	cityOptions,
}) => {
	const [bio, setBio] = useState("");
	const maxChars = 250;

	return (
		<div className="flex flex-col items-center gap-5">
			<div className="w-full flex flex-col sm:flex-row gap-3">
				<div className="w-full flex flex-col sm:w-1/2">
					<label
						htmlFor="firstName"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						First Name
					</label>
					<input
						{...register("firstName", {
							required: "First Name is required",
							minLength: {
								value: 2,
								message: "First Name should be at least 2 characters",
							},
							maxLength: 50,
						})}
						aria-invalid={errors.firstName ? "true" : "false"}
						type="text"
						name="firstName"
						id="firstName"
						placeholder="First Name"
						className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-blue-500"
					/>
					{errors.firstName && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.firstName.message as string}
						</span>
					)}
				</div>
				<div className="w-full flex flex-col sm:w-1/2 ">
					<label
						htmlFor="lastName"
						className="text-sm font-semibold text-gray-700 pb-1"
					>
						Last Name
					</label>
					<input
						{...register("lastName", {
							required: "Last Name is required",
							minLength: {
								value: 2,
								message: "Last Name should be at least 2 characters",
							},
							maxLength: 50,
						})}
						aria-invalid={errors.lastName ? "true" : "false"}
						type="text"
						name="lastName"
						id="lastName"
						placeholder="Last Name"
						className="border px-2 py-2 rounded-lg text-sm border-gray-400 focus:border-blue-500"
					/>
					{errors.lastName && (
						<span className="form-error text-red-500 text-xs mt-1" role="alert">
							{errors.lastName.message as string}
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
					className="w-full px-2 py-2 text-sm border rounded-lg border-gray-400 focus:border-blue-500"
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
				<Controller
					name="location"
					control={control}
					rules={{
						required: "Location is required",
					}}
					render={({ field }) => (
						<Select
							{...field}
							isClearable
							isSearchable
							isLoading={isLoading}
							onInputChange={handleInputChange}
							onChange={(option) => handleSelection(option, field.onChange)}
							options={cityOptions}
							formatOptionLabel={formatOptionLabel}
							value={field.value as any}
							id="location"
							placeholder="Location"
							styles={selectCompanyFieldStyle}
							classNamePrefix="select"
							noOptionsMessage={({ inputValue }) =>
								inputValue.length < 2
									? "Type at least 2 characters to search"
									: error
										? error
										: "No cities found"
							}
						/>
					)}
				/>
				{errors.location && (
					<span className="form-error text-red-500 text-xs mt-1" role="alert">
						{errors.location.message as string}
					</span>
				)}
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
					className="w-full px-2 py-2 text-sm border border-gray-400 rounded-lg focus:border-blue-500"
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
						if (!value.some((lang: { language: any; proficiency: any; }) => lang.language && lang.proficiency)) {
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
												className="w-1/2 px-2 py-2 text-sm border border-gray-400 rounded-lg focus:border-blue-500"
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
												styles={selectCompanyFieldStyle}
												className="w-2/5"
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
							className="w-full mt-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
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
