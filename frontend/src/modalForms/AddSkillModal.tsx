import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import AsyncSelect from "react-select/async";
import { toast } from "sonner";
import axios from "axios";
import { HiOutlineXMark } from "react-icons/hi2";
import { HiOutlineSearch } from "react-icons/hi";
import { skillSearchFieldStyle } from "@/utils/styles";
import { skillObject } from "@/utils/skillOptions";
import { FormFooter } from "@/components/ui/FormFooter";
import { useFetchSkillData } from "@/hooks/useFetchSkillsData";
import { Skill } from "@/types/userTypes";

export const AddSkillModal: React.FC<{
	setShowSkillModal: React.Dispatch<SetStateAction<boolean>>;
    onUpdate: () => void;
}> = ({ setShowSkillModal, onUpdate }) => {
	const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();

    const {
		data: skillData,
		isLoading: isSkillLoading
	} = useFetchSkillData();
    
	useEffect(() => {
		if (skillData && skillData.length > 0) {
			setSelectedSkills(
				skillData.map((skill) => ({
					id: skill.id, //
					value: skill.value,
					label: skill.label,
					image: skill.image,
					category: skill.category,
				}))
			);
		}
	}, [skillData]);

	const {
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const loadOptions = (
		inputValue: string,
		callback: (options: Skill[]) => void
	) => {
		const filteredOptions = skillObject.filter(
			(option) =>
				option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
				!selectedSkills.some((skill) => skill.value === option.value)
		);
		callback(filteredOptions);
	};

	const [searchInputValue, setSearchInputValue] = useState<string>("");

	const handleSkillSelect = (newSkill: Skill | null) => {
		if (selectedSkills.length >= 20) {
			toast.error("You cannot select more than 20 skills.");
			return;
		}

		if (
			newSkill &&
			!selectedSkills.some((skill) => skill.value === newSkill.value)
		) {
			setSelectedSkills([...selectedSkills, newSkill]);
			setSearchInputValue("");
		}
	};

	const handleSkillRemove = (removedSkill: Skill) => {
		setSelectedSkills(
			selectedSkills.filter((skill) => skill.value !== removedSkill.value)
		);
	};

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		setIsLoading(true);
		const skillData = {
			skills: selectedSkills.map((skill) => ({
				value: skill.value,
				label: skill.label,
				image: skill.image,
				category: skill.category,
			})),
		};
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}
			const url = "/api/add-skills";
			await axios.post(url, skillData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
            onUpdate();
			toast.success("Skills Updated");
			setShowSkillModal(false);
		} catch (error: any) {
			toast.error("Error occurred while updating skills. Try again!");
			if (error.response) {
				console.log("Error Status: ", error.response.status);
				console.log("Error Message: ", error.message);
				console.log("Error Response: ", error.response);
			} else if (error.request) {
				console.log("Error Request: ", error.request);
			} else {
				console.log("Error Message: ", error.message);
			}
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
				className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer "
			>
				<motion.div
					initial={{ scale: 0.9, rotate: "0deg" }}
					animate={{ scale: 1, rotate: "0deg" }}
					exit={{ scale: 0, rotate: "0deg" }}
					onClick={(e) => e.stopPropagation()}
					className="bg-white p-4 rounded-2xl sm:mx-auto w-full max-w-[350px] xs:max-w-md sm:max-w-lg  shadow-xl cursor-default relative overflow-hidden"
				>
					<div className="relative z-10 ">
						<div className="flex items-start justify-between ml-1 rounded-t">
							<h3 className="text-xl font-semibold text-gray-800 mt-1">
								Add Skills
							</h3>
							<button
								className="pb-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowSkillModal(false)}
							>
								<span className="bg-transparent text-gray-800">
									<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
								</span>
							</button>
						</div>
						<div className=" h-[400px]">
							<div className="p-3">
								<div className="flex flex-col gap-3">
									<form id="skillDataForm" onSubmit={handleSubmit(onSubmit)}>
										<div className="flex flex-col w-full gap-3">
											<div className="w-full flex flex-col">
												<div className="flex border py-1 rounded-md border-gray-200 w-full px-2">
													<span className="w-[8%] flex items-center justify-center">
														<HiOutlineSearch className="text-gray-600" />
													</span>
													<span className="w-[92%]">
														<AsyncSelect
															cacheOptions
															loadOptions={loadOptions}
															onChange={handleSkillSelect}
															isClearable
															isSearchable
															value={null}
															inputValue={searchInputValue}
															onInputChange={(newValue) =>
																setSearchInputValue(newValue)
															}
															styles={skillSearchFieldStyle}
															placeholder="Search Skills and Technology"
															noOptionsMessage={() => "Type to search"}
														/>
													</span>
												</div>
											</div>
											<div className="h-80 border rounded-md border-gray-200 p-3">
												{isSkillLoading ? (
													<div className="flex flex-wrap w-full gap-2 p-2">
														{[...Array(12)].map((_, index) => (
															<div
																key={index}
																className={`h-6 w-${16 + (index % 5) * 4} rounded-full skeleton`}
															/>
														))}
													</div>
												) : selectedSkills.length === 0 ? (
													<div className="flex items-center justify-center h-full text-gray-700">
														No skills added yet.
													</div>
												) : selectedSkills.length > 0 && (
														<div className="flex flex-wrap gap-2">
															{selectedSkills.map((skill) => (
																<div
																	key={skill.value}
																	className="flex items-center justify-center px-2.5 py-1 bg-slate-50 text-gray-700 rounded-full border"
																>
																	{skill.image && (
																		<span className="inline-block">
																			<img
																				src={skill.image}
																				alt={skill.label}
																				className="size-3 mr-2"
																			/>
																		</span>
																	)}
																	<span className="text-xs">{skill.label}</span>
																	<button
																		className="text-gray-600 pl-2 hover:text-red-500"
																		onClick={(e) => {
																			e.preventDefault();
																			handleSkillRemove(skill);
																		}}
																	>
																		<HiOutlineXMark />
																	</button>
																</div>
															))}
														</div>
												  ) ? (
													selectedSkills.length > 0 && (
														<div className="flex flex-wrap gap-2">
															{selectedSkills.map((skill) => (
																<div
																	key={skill.value}
																	className="flex items-center justify-center px-2.5 py-1 bg-slate-50 text-gray-700 rounded-full border"
																>
																	{skill.image && (
																		<span className="inline-block">
																			<img
																				src={skill.image}
																				alt={skill.label}
																				className="size-3 mr-2"
																			/>
																		</span>
																	)}
																	<span className="text-xs">{skill.label}</span>

																	{/* {skill.image} */}
																	<button
																		className="text-gray-600 pl-2 hover:text-red-500"
																		onClick={(e) => {
																			e.preventDefault();
																			handleSkillRemove(skill);
																		}}
																	>
																		<HiOutlineXMark />
																	</button>
																</div>
															))}
														</div>
													)
												) : undefined}
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						{/*footer*/}
						<FormFooter isLoading={isLoading} formId="skillDataForm" />
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
