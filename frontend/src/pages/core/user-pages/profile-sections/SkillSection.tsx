import React, { useEffect, useState } from "react";
import { useFetchSkillData } from "@/hooks/useFetchSkillsData";
import { useUser } from "@clerk/clerk-react";
import { MdModeEdit } from "react-icons/md";
import { AddSkillModal } from "@/modal-forms/AddSkillModal";
import { toast } from "sonner";

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
				) : skillData &&
				  skillData.length > 0 &&
				  skillData[0] &&
				  skillData[0].skills_list &&
				  skillData[0].skills_list.length > 0 ? (
					<div className="w-full">
						<div className="flex flex-wrap text-sm w-full">
							{skillData[0].skills_list.map((skill) => (
								<div
									key={skill.value}
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
				) : (
					<div className="flex items-center justify-center w-full min-h-32">
						<button
							type="button"
							onClick={() => setShowSkillModal(true)}
							className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 w-36 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
						>
							Add Skills
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
