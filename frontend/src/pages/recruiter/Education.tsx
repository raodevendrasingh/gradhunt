import { FiPlus } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";
import { AddEducationModal } from "./modalForms/AddEducationModal";
import { useCallback, useState } from "react";
import { useFetchEducationData } from "../../hooks/useFetchEducationData";
import { EditEducationModal } from "./modalForms/EditEducationModal";
import { AddEduModal } from "@/modalForms/AddEduModal";

export const Education = () => {
	const [showEduModal, setShowEduModal] = useState<boolean>(false);
	const { educationData, refetch } = useFetchEducationData();

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<div className="w-full pt-20 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto flex flex-col mb-3 gap-3 px-3">
					<section className="bg-white px-2 p-2 border rounded-xl shadow">
						<div className="flex justify-between items-center">
							<span className="font-semibold text-lg pl-1 text-gray-800">
								Education
							</span>
							<button
								type="button"
								onClick={() => setShowEduModal(true)}
							>
								<MdOutlineEdit className="size-9 hover:bg-gray-100 rounded-full p-2" />
							</button>
							{showEduModal && (
								<AddEduModal
									setShowEduModal={setShowEduModal}
									onSave={handleRefresh}
								/>
							)}
						</div>
						{/* fetch experience data */}
						{educationData && educationData.length > 0 && (
							<div className="flex flex-col gap-3">
								{educationData.map((data, index) => (
									<div
										key={data.educationId}
										className="w-full flex items-start gap-3 border border-gray-50 bg-gray-100 p-3 pt-1 rounded-xl"
									>
										<div className="w-full">
											<div className="flex items-center justify-between">
												<span className="text-xl font-semibold text-gray-800">
													{data.instituteName}
												</span>

												<EditEducationModal
													educationId={data.educationId}
													onSave={handleRefresh}
												/>
											</div>
											<div className="flex text-sm items-center gap-1 text-gray-800">
												<span>{data.degreeTitle},</span>

												<span>{data.studyField}</span>
											</div>
											<div className="text-xs text-gray-600">
												{data.startMonth} {data.startYear} - {data.endMonth}{" "}
												{data.endYear}
											</div>

											<div className="text-xs text-gray-600">
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
						)}
					</section>
				</div>
			</div>
		</div>
	);
};
