import React, { useEffect, useState } from "react";
import { useFetchSkillData } from "@/hooks/useFetchSkillsData";
import { useUser } from "@clerk/clerk-react";
import { MdModeEdit } from "react-icons/md";
import { Skill } from "@/types/userTypes";
import { AddSkillModal } from "@/modalForms/AddSkillModal";
import { toast } from "sonner";

type GroupedSkills = {
	[key: string]: Skill[];
};

export const SkillSection: React.FC = () => {
	const [showSkillModal, setShowSkillModal] = useState<boolean>(false);
	const { isSignedIn } = useUser();
	const {
		data: skillData,
		isLoading: isSkillLoading,
		refetch,
		error,
	} = useFetchSkillData();

	useEffect(() => {
		if (error) {
			toast.error("Error fetching Skills");
		}
	}, [error]);

	const groupedSkills: GroupedSkills = skillData
		? skillData.reduce((acc: GroupedSkills, skill: Skill) => {
				if (!acc[skill.category]) {
					acc[skill.category] = [];
				}
				acc[skill.category].push(skill);
				return acc;
			}, {})
		: {};

	const sortedCategories = Object.keys(groupedSkills).sort();

	return (
		<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-1">
			<div className="flex items-center justify-between w-full pb-2">
				<span className="text-gray-700 font-medium text-base">Skills</span>
				{isSignedIn && (
					<button
						type="button"
						onClick={() => setShowSkillModal(true)}
						className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium cursor-pointer transition-colors"
					>
						<MdModeEdit className="size-5" />
					</button>
				)}
				{showSkillModal && (
					<AddSkillModal
						setShowSkillModal={setShowSkillModal}
						onUpdate={refetch}
					/>
				)}
			</div>
			<div className="flex items-center justify-start w-full">
				{isSkillLoading ? (
					<div className="flex flex-wrap w-full gap-2 p-3">
						{[...Array(12)].map((_, index) => (
							<div
								key={index}
								className={`h-6 w-${16 + (index % 5) * 4} rounded-full skeleton`}
							/>
						))}
					</div>
				) : (
					<div className="w-full">
						{/* {sortedCategories.map((category) => (
							<div key={category} className="mb-4">
								<h3 className="text-sm font-semibold mb-2 text-gray-600">
									{category}
								</h3>
								<div className="flex flex-wrap">
									{groupedSkills[category].map((skill: Skill) => (
										<div
											key={skill.id}
											className="flex items-center justify-center text-sm px-2.5 py-[3px] bg-slate-50 text-gray-700 rounded-full border m-1"
										>
											<img
												src={skill.image}
												alt={skill.label}
												className="size-3 mr-2"
											/>
											{skill.label}
										</div>
									))}
								</div>
							</div>
						))} */}
						<div className="flex flex-wrap text-sm w-full">
							{skillData &&
								skillData.map((skill) => (
									<div
										key={skill.id}
										className="flex items-center justify-center px-2.5 py-[3px] bg-slate-50 text-gray-700 rounded-full border m-1"
									>
										<img
											src={skill.image}
											alt={skill.label}
											className="size-3 mr-2"
										/>
										{skill.label}
									</div>
								))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
