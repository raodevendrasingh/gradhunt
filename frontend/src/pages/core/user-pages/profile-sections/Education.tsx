import { useFetchEducationData } from "@/hooks/academia/useFetchEducationData";
import { useUser } from "@clerk/clerk-react";
import { FaGraduationCap } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { ContentSkeleton } from "@/pages/core/components/ui/ContentSkeleton";
import { EditEduModal } from "@/modal-forms/education/EditEduModal";
import { useState } from "react";
import { AddEduModal } from "@/modal-forms/education/AddEduModal";
import { useFetchUserDetails } from "@/hooks/profile/useFetchUserDetails";

export const Education = () => {
	const [showEditEduModal, setShowEditEduModal] = useState<boolean>(false);
	const [showEduModal, setShowEduModal] = useState<boolean>(false);
	const [editingEducationId, setEditingEducationId] = useState<number>();
	const { isSignedIn, user } = useUser();
	const { data: userDetails } = useFetchUserDetails();
	const {
		data: educationData,
		isLoading: isEduLoading,
		refetch: refetchEdu,
	} = useFetchEducationData();

	const handleEditClick = (id: number) => {
		setEditingEducationId(id);
		setShowEditEduModal(true);
	};

	return (
		<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-2">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					<FaGraduationCap />
					<span className="text-gray-700 font-medium text-base">
						Education
					</span>
				</div>
			</div>

			{isEduLoading ? (
				<div className="flex flex-col gap-3 w-full">
					<ContentSkeleton />
					<ContentSkeleton />
				</div>
			) : (
				<>
					{educationData && educationData.length > 0 ? (
						<div className="flex flex-col gap-3 w-full">
							{educationData.map((data, index) => (
								<div
									key={index}
									className="w-full flex items-start gap-3 bg-white pt-3 rounded-lg"
								>
									<div className="flex flex-col gap-1 w-full">
										<div className="flex items-center justify-between">
											<span className="text-xl font-semibold text-gray-800">
												{data.instituteName}
											</span>
											{isSignedIn &&
												user.username ===
													userDetails?.user_details
														?.username && (
													<button
														type="button"
														onClick={() =>
															handleEditClick(
																data.id
															)
														}
														className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium cursor-pointer transition-colors"
													>
														<MdModeEdit className="size-5" />
													</button>
												)}
										</div>
										<div className="flex text-sm items-center gap-1 text-gray-800">
											<span>{data.degreeTitle},</span>
											<span>{data.studyField}</span>
										</div>

										<div className="text-xs font-medium text-gray-600">
											{data.startMonth} {data.startYear} -{" "}
											{data.endMonth} {data.endYear}
										</div>

										<div className="text-xs font-medium text-gray-600">
											{data.instituteLocation}
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
								onClick={() => setShowEduModal(true)}
								className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 w-36 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
							>
								Add Education
							</button>
						</div>
					)}
				</>
			)}
			{showEduModal && (
				<AddEduModal
					setShowEduModal={setShowEduModal}
					onSave={refetchEdu}
				/>
			)}

			{showEditEduModal && (
				<EditEduModal
					setShowEditEduModal={setShowEditEduModal}
					educationId={editingEducationId as number}
					onSave={refetchEdu}
				/>
			)}
		</div>
	);
};
