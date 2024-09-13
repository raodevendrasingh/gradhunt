/* eslint-disable react-hooks/exhaustive-deps */
import { FiPlus } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";
import { AddExperienceModal } from "./modalForms/AddExperienceModal";
import { EditExperienceModal } from "./modalForms/EditExperienceModal";
import { useFetchExperienceData } from "../../hooks/useFetchExperienceData";
import { useCallback, useState } from "react";
import { AddExpModal } from "@/modalForms/AddExpModal";

export const Experience = () => {
	const [showExpModal, setShowExpModal] = useState<boolean>(false);
	const { experienceData, refetch } = useFetchExperienceData();

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<div className="w-full pt-20 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto flex flex-col mb-3 gap-3 px-3">
					<section className="bg-white px-2 p-2 border rounded-xl shadow">
						<div className="flex justify-between items-center pb-1">
							<span className="font-semibold text-lg pl-1 text-gray-800">
								Experience
							</span>
							<button type="button" onClick={() => setShowExpModal(true)}>
								<MdOutlineEdit className="size-9 hover:bg-gray-100 rounded-full p-2" />
							</button>
							{showExpModal && (
								<AddExpModal
									setShowExpModal={setShowExpModal}
									onSave={handleRefresh}
								/>
							)}
						</div>
						{/* fetch experience data */}
						{experienceData && experienceData.length > 0 && (
							<div className="flex flex-col gap-3">
								{experienceData.map((data, index) => (
									<div
										key={data.experienceId}
										className="w-full flex items-start gap-3 border border-gray-50 bg-gray-100 p-3 pt-1 rounded-xl"
									>
										<div className="w-full">
											<div className="flex items-center justify-between">
												<span className="text-xl font-semibold text-gray-800">
													{data.companyName}
												</span>

												<EditExperienceModal
													experienceId={data.experienceId}
													onSave={handleRefresh}
												/>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-gray-800">
													{data.jobTitle}
												</span>

												<div className="flex gap-2 text-xs text-gray-700">
													<span className="px-1.5 py-0.5 bg-gray-300/70 rounded-full">
														{data.jobType}
													</span>
													<span className="px-1.5 py-0.5 bg-gray-300/70 rounded-full">
														{data.locationType}
													</span>
												</div>
											</div>
											<div className="text-xs text-gray-600">
												{data.startMonth} {data.startYear} -{" "}
												{!data.isCurrentlyWorking
													? `${data.endMonth} ${data.endYear}`
													: "Present"}
											</div>

											{data.locationType === "Remote" ? (
												""
											) : (
												<div className="text-xs text-gray-600">
													{data.jobLocation}
												</div>
											)}

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
