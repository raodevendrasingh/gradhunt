import { useFetchExperienceData } from "@/hooks/useFetchExperienceData";
import { useUser } from "@clerk/clerk-react";
import { MdModeEdit } from "react-icons/md";
import { ContentSkeleton } from "@/pages/core/components/ui/ContentSkeleton";
import { BsBuildingsFill } from "react-icons/bs";
import { useState } from "react";
import { EditExpModal } from "@/modal-forms/EditExpModal";
import { AddExpModal } from "@/modal-forms/AddExpModal";
import { GoUnverified, GoVerified } from "react-icons/go";
import { VerifyEmploymentModal } from "@/modal-forms/VerifyEmploymentModal";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";

export const Experience = () => {
	const [showEditExpModal, setShowEditExpModal] = useState<boolean>(false);
	const [showExpModal, setShowExpModal] = useState<boolean>(false);
	const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
	const [editingExperienceId, setEditingExperienceId] = useState<number>();
	const { isSignedIn, user } = useUser();
	const { data: userDetails } = useFetchUserDetails();
	const {
		data: experienceData,
		isLoading: isExpLoading,
		refetch: refetchExp,
	} = useFetchExperienceData();

	const handleEditClick = (id: number) => {
		setEditingExperienceId(id);
		setShowEditExpModal(true);
	};

	const handleVerifyEmployment = () => {
		setShowVerifyModal(true);
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
					{experienceData && experienceData.length > 0 ? (
						<div className="flex flex-col gap-3 w-full">
							{experienceData.map((data, index) => (
								<div
									key={index}
									className="w-full flex items-start gap-3 bg-white pt-3 rounded-lg"
								>
									<div className="flex flex-col gap-1 w-full">
										<div className="flex items-center justify-between group">
											<span className="text-xl font-semibold text-gray-800">
												{data.companyName}
											</span>
											{isSignedIn && (
												<span className="flex items-center gap-2">
													{data.isVerified ? (
														<GoVerified className="text-sky-500 size-5" />
													) : (
														<button onClick={handleVerifyEmployment}>
															<GoUnverified className="text-gray-400 transition-colors cursor-pointer size-5 opacity-0 group-hover:opacity-100" />
														</button>
													)}
													{user.username ===
														userDetails?.user_details?.username && (
														<button
															type="button"
															onClick={() => handleEditClick(data.id)}
															className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium cursor-pointer transition-colors"
														>
															<MdModeEdit className="size-5" />
														</button>
													)}
												</span>
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
					) : (
						<div className="flex items-center justify-center w-full min-h-32">
							<button
								type="button"
								onClick={() => setShowExpModal(true)}
								className="px-3 py-2 rounded-lg text-gray-700 w-36 bg-white hover:bg-slate-50 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
							>
								Add Experience
							</button>
						</div>
					)}
				</>
			)}

			{showExpModal && (
				<AddExpModal setShowExpModal={setShowExpModal} onSave={refetchExp} />
			)}
			{showEditExpModal && (
				<EditExpModal
					setShowEditExpModal={setShowEditExpModal}
					onSave={refetchExp}
					experienceId={editingExperienceId as number}
				/>
			)}
			{showVerifyModal && (
				<VerifyEmploymentModal setShowVerifyModal={setShowVerifyModal} />
			)}
		</div>
	);
};
