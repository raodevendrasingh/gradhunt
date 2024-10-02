import { useFetchProjectData } from "@/hooks/useFetchProjectsData";
import { useState } from "react";
import { ContentSkeleton } from "../components/ui/ContentSkeleton";
import { useUser } from "@clerk/clerk-react";
import { MdModeEdit } from "react-icons/md";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { GoGlobe } from "react-icons/go";
import { FaGithub } from "react-icons/fa";
import { EditProjectModal } from "@/modalForms/EditProjectModal";
import { IoMdCube } from "react-icons/io";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { useFetchCertificateData } from "@/hooks/useFetchCertificateData";
import { LuDot } from "react-icons/lu";
import { EditCertificateModal } from "@/modalForms/EditCertificateModal";
import ComboboxCurriculars from "@/components/layouts/ComboboxCurriculars";
import { AddProjectModal } from "@/modalForms/AddProjectModal";
import { AddCertificateModal } from "@/modalForms/AddCertificateModal";

export const ExtraCurriculars = () => {
	const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
	const [showCertifyModal, setShowCertifyModal] = useState<boolean>(false);
	const [editingProjectId, setEditingProjectId] = useState<number>();
	const [showEditProjectModal, setShowEditProjectModal] =
		useState<boolean>(false);
	const [editingCertifyId, setEditingCertifyId] = useState<number>();
	const [showEditCertifyModal, setShowEditCertifyModal] =
		useState<boolean>(false);
	const { isSignedIn } = useUser();
	const {
		data: projectData,
		isLoading: isProjectLoading,
		refetch: refetchProjects,
		error,
	} = useFetchProjectData();

	const {
		data: certificateData,
		isLoading: isCertifyLoading,
		refetch: refetchCertificates,
	} = useFetchCertificateData();

	const handleEditProject = (id: number) => {
		setEditingProjectId(id);
		setShowEditProjectModal(true);
	};

	const handleEditCertificate = (id: number) => {
		setEditingCertifyId(id);
		setShowEditCertifyModal(true);
	};

	return (
		<div className="flex flex-col">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<ComboboxCurriculars />
				</div>
			)}

			{/* project section */}
			<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-2">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<IoMdCube />
						<span className="text-gray-700 font-semibold text-base">
							Projects
						</span>
					</div>
				</div>

				{isProjectLoading ? (
					<ContentSkeleton />
				) : (
					<>
						{projectData && projectData.length > 0 ? (
							<div className="flex flex-col gap-3 w-full">
								{projectData.map((data, index) => (
									<div
										key={index}
										className="w-full flex items-start gap-3 bg-white pt-3 rounded-lg"
									>
										<div className="flex flex-col gap-1 w-full">
											<div className="flex items-center justify-between">
												<span className="text-xl font-semibold text-gray-800">
													{data.projectName}
												</span>
												{isSignedIn && (
													<button
														type="button"
														onClick={() => handleEditProject(data.id as number)}
														className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium cursor-pointer transition-colors"
													>
														<MdModeEdit className="size-5" />
													</button>
												)}
											</div>

											<div className="flex items-center justify-start gap-2 w-full text-xs font-medium">
												{data.liveLink && (
													<Link
														to={data.liveLink}
														target="_blank"
														className="flex items-center justify-center gap-1.5 w-fit px-2 py-1 rounded-full bg-slate-50 border text-gray-600 hover:text-gray-800"
													>
														<GoGlobe /> Live Link <HiOutlineArrowUpRight />
													</Link>
												)}
												{data.sourceCodeLink && (
													<Link
														to={data.sourceCodeLink}
														target="_blank"
														className="flex items-center justify-center gap-1.5 w-fit px-2 py-1 rounded-full bg-slate-50 border text-gray-600 hover:text-gray-800"
													>
														<FaGithub /> GitHub <HiOutlineArrowUpRight />
													</Link>
												)}
											</div>

											<div className="text-xs font-medium text-gray-600">
												{data.startMonth} {data.startYear} {" - "}{" "}
												{!data.isCurrentlyWorking
													? `${data.endMonth} ${data.endYear}`
													: "Present"}
											</div>

											{data.description && (
												<div className="text-sm mt-2 text-gray-800">
													<p>{data.description}</p>
												</div>
											)}

											{data.skills && (
												<div className="flex items-center flex-wrap">
													{data.skills.map((skill, index) => (
														<span
															key={index}
															className="text-xs px-2.5 py-0.5 bg-slate-50 text-gray-700 rounded-full border m-1"
														>
															{skill}
														</span>
													))}
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
									onClick={() => setShowProjectModal(true)}
									className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 w-36 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
								>
									Add Project
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{/* certificate section */}
			<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-2">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						<AiFillSafetyCertificate />
						<span className="text-gray-700 font-semibold text-base">
							Licence and Certifications
						</span>
					</div>
				</div>

				{isCertifyLoading ? (
					<ContentSkeleton />
				) : (
					<>
						{certificateData && certificateData.length > 0 ? (
							<div className="flex flex-col gap-3 w-full">
								{certificateData.map((data, index) => (
									<div
										key={index}
										className="w-full flex items-start gap-3 bg-white pt-3 rounded-lg"
									>
										<div className="flex flex-col gap-1 w-full">
											<div className="flex items-center justify-between">
												<span className="text-xl font-semibold text-gray-800">
													{data.certificateName}
												</span>
												{isSignedIn && (
													<button
														type="button"
														onClick={() =>
															handleEditCertificate(data.id as number)
														}
														className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium cursor-pointer transition-colors"
													>
														<MdModeEdit className="size-5" />
													</button>
												)}
											</div>
											<div className="flex items-center justify-start -mt-2 w-full">
												{data.issuerOrg && (
													<div className="text-sm font-semibold text-gray-700">
														<p>{data.issuerOrg}</p>
													</div>
												)}
											</div>
											<div className="flex items-center justify-start font-medium w-full">
												{data.isValid ? (
													<span className="text-xs text-gray-600">
														Issued {data.startMonth} {data.startYear}
													</span>
												) : (
													<span className="flex items-center text-xs text-gray-600">
														<LuDot />
														Expires {data.endMonth} {data.endYear}
													</span>
												)}
											</div>
											<div className="flex items-center justify-start gap-2 w-full text-xs font-medium">
												{data.credentialUrl && (
													<Link
														to={data.credentialUrl}
														target="_blank"
														className="flex items-center justify-center gap-1.5 w-fit px-2 py-1 rounded-full bg-slate-50 border text-gray-600 hover:text-gray-800"
													>
														<GoGlobe /> Credential <HiOutlineArrowUpRight />
													</Link>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex items-center justify-center w-full min-h-32">
								<button
									type="button"
									onClick={() => setShowCertifyModal(true)}
									className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 w-44 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
								>
									Add Certifications
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{showProjectModal && (
				<AddProjectModal
					setShowProjectModal={setShowProjectModal}
					onSave={refetchProjects}
				/>
			)}

			{showEditProjectModal && (
				<EditProjectModal
					setShowEditProjectModal={setShowEditProjectModal}
					projectId={editingProjectId as number}
					onSave={refetchProjects}
				/>
			)}

			{showCertifyModal && (
				<AddCertificateModal
					setShowCertifyModal={setShowCertifyModal}
					onSave={refetchCertificates}
				/>
			)}

			{showEditCertifyModal && (
				<EditCertificateModal
					setShowEditCertifyModal={setShowEditCertifyModal}
					certificateId={editingCertifyId as number}
					onSave={refetchCertificates}
				/>
			)}
		</div>
	);
};
