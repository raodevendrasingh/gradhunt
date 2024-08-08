import { SetStateAction, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AnimatePresence, motion, Variants } from "framer-motion";
import AsyncSelect from "react-select/async";
import { toast } from "sonner";
import axios from "axios";
import { HiOutlineXMark } from "react-icons/hi2";
import { HiOutlineSearch } from "react-icons/hi";
import { skillSearchFieldStyle } from "@/utils/styles";
import { skillObject } from "@/utils/skillOptions";

interface SkillOption {
	value: string;
	label: string;
	image?: string;
	category: string;
}

export const AddSkillModal: React.FC<{
	onSave: () => void;
	setShowSkillModal: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setShowSkillModal, onSave }) => {
	const { isSignedIn, user } = useUser();
	const { getToken } = useAuth();

	const {
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const [selectedSkills, setSelectedSkills] = useState<SkillOption[]>([]);

	const loadOptions = (
		inputValue: string,
		callback: (options: SkillOption[]) => void
	) => {
		const filteredOptions = skillObject.filter(
			(option) =>
				option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
				!selectedSkills.some((skill) => skill.value === option.value)
		);
		callback(filteredOptions);
	};

	const [searchInputValue, setSearchInputValue] = useState<string>("");

	const handleSkillSelect = (newSkill: SkillOption | null) => {
        if (selectedSkills.length >= 20) {
            toast.error('You cannot select more than 20 skills.');
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

	const handleSkillRemove = (removedSkill: SkillOption) => {
		setSelectedSkills(
			selectedSkills.filter((skill) => skill.value !== removedSkill.value)
		);
	};

	const onSubmit: SubmitHandler<FormData> = async (data) => {
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
			const response = await axios.post(url, skillData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			toast.success("Skills Updated");
			onSave();
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
		}
	};

	const modalVariants: Variants = {
		initial: { opacity: 0, scale: 0.9, rotate: "0deg" },
		animate: { opacity: 1, scale: 1, rotate: "0deg" },
		exit: { opacity: 0, scale: 0, rotate: "0deg" },
	};

	return (
		isSignedIn && (
			<AnimatePresence>
				<motion.div
					variants={modalVariants}
					initial="initial"
					animate="animate"
					exit={{ opacity: 0 }}
					className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer "
				>
					<motion.div
						variants={modalVariants}
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
							<div className=" h-[50vh]">
								<div className="p-3">
									<div className="flex flex-col gap-3">
										<form
											id="educationDataForm"
											onSubmit={handleSubmit(onSubmit)}
										>
											<div className="flex flex-col w-full gap-3">
												<div className="w-full flex flex-col">
													<div className="flex w-full items-center border border-gray-400 rounded-xl px-2">
														<span className="w-[5%]">
															<HiOutlineSearch className="text-gray-600" />
														</span>
														<span className="w-[95%]">
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
												<div className="h-80  border border-gray-400 rounded-lg p-3">
													{selectedSkills.length > 0 && (
														<div className="flex flex-wrap gap-2">
															{selectedSkills.map((skill) => (
																<div
																	key={skill.value}
																	className="flex items-center  gap-2 bg-white h-7 rounded-full border border-gray-400 p-2 py-1"
																>
																	{skill.image && (
																		<span className="inline-block">
																			<img
																				src={skill.image}
																				alt={skill.label}
																				className="w-4 h-4 object-contain" // Adjust the width and height as needed
																			/>
																		</span>
																	)}
																	<span className="text-xs">{skill.label}</span>

																	{/* {skill.image} */}
																	<button
																		className="text-gray-600 hover:text-gray-800"
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
													)}
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
							{/*footer*/}
							<div className="flex items-center justify-end mt-3 rounded-b">
								<button
									className="bg-zinc-800 text-white active:bg-green-700 font-semibold border rounded-[10px] text-sm px-4 py-2 shadow hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150"
									type="submit"
									form="educationDataForm"
								>
									Save
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};
