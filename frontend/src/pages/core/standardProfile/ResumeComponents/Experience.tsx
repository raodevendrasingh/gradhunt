import { useFetchExperienceData } from "@/hooks/useFetchExperienceData";
import { useUser } from "@clerk/clerk-react";
import { MdModeEdit } from "react-icons/md";
import { ContentSkeleton } from "../../components/ui/ContentSkeleton";
import { BsBuildingsFill } from "react-icons/bs";
import { useState } from "react";
import { EditExpModal } from "@/modalForms/EditExpModal";

export const Experience = () => {
	const [showEditExpModal, setShowEditExpModal] = useState<boolean>(false);
	const [editingExperienceId, setEditingExperienceId] = useState<number>();

	const { isSignedIn } = useUser();
	const { experienceData, isExpLoading, refetchExp } = useFetchExperienceData();

	const handleEditClick = (id: number) => {
		setEditingExperienceId(id);
		setShowEditExpModal(true);
	};

	return (
		<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-2">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					<BsBuildingsFill />
					<span className="f text-gray-700 font-medium text-base">
						Experience
					</span>
				</div>
			</div>
			{isExpLoading ? (
				<ContentSkeleton />
			) : (
				<>
					{experienceData && experienceData.length > 0 && (
						<div className="flex flex-col gap-3 w-full">
							{experienceData.map((data, index) => (
								<div
									key={index}
									className="w-full flex items-start gap-3 bg-white pt-3 rounded-lg"
								>
									<div className="flex flex-col gap-1 w-full">
										<div className="flex items-center justify-between">
											<span className="text-xl font-semibold text-gray-800">
												{data.companyName}
											</span>
											{isSignedIn && (
												<button
													type="button"
													onClick={() => handleEditClick(data.id)}
													className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
												>
													<MdModeEdit className="size-5" />
												</button>
											)}
										</div>
										<div className="flex text-sm items-center gap-1 text-gray-800">
											<span>{data.jobTitle},</span>
											<span>{data.jobType}</span>
										</div>

										<div className="text-xs font-medium text-gray-600">
											{data.startMonth} {data.startYear} -{" "}
											{!data.isCurrentlyWorking
												? `${data.endMonth} ${data.endYear}`
												: "Present"}
										</div>

										<div className="text-xs font-medium text-gray-600">
											{data.jobLocation}
										</div>

										{data.description && (
											<div className="text-sm mt-2 text-gray-800">
												<p>{data.description}</p>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}
			{showEditExpModal && (
				<EditExpModal
					setShowEditExpModal={setShowEditExpModal}
					onSave={refetchExp}
					experienceID={editingExperienceId as number}
				/>
			)}
		</div>
	);
};
