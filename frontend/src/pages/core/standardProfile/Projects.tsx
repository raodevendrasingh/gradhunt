import { useFetchProjectData } from "@/hooks/useFetchProjectsData";
import { AddProjectModal } from "@/modalForms/AddProjectModal";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
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

export const Projects = () => {
	const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
	const [editingProjectId, setEditingProjectId] = useState<number>();
	const [showEditProjectModal, setShowEditProjectModal] =
		useState<boolean>(false);
	const { isSignedIn } = useUser();
	const { projectData, isProjectLoading, refetch, error } =
		useFetchProjectData();

	const {
		certificateData,
		isCertifyLoading,
		certifyError,
		refetchCertificates,
	} = useFetchCertificateData();

	const handleEditClick = (id: number) => {
		setEditingProjectId(id);
		setShowEditProjectModal(true);
	};

	return (
		<div className="flex flex-col">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<button
						type="button"
						onClick={() => setShowProjectModal(true)}
						className="inline-flex items-center justify-center gap-2 w-32 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0"
					>
						<FaPlus />
						Add Project
					</button>
				</div>
			)}
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
						{projectData && projectData.length > 0 && (
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
														onClick={() => handleEditClick(data.id as number)}
														className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
													>
														<MdModeEdit className="size-5" />
													</button>
												)}
											</div>

											<div className="flex items-center justify-start gap-2 w-full text-xs font-medium ">
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
						)}
					</>
				)}
			</div>

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
						{certificateData && certificateData.length > 0 && (
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
														onClick={() => handleEditClick(data.id as number)}
														className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
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
												{data.isValid && (
													<span className="text-xs text-gray-600">
														Issued {data.startMonth} {data.startYear}
													</span>
												)}
												{!data.isValid && (
													<span className="flex items-center text-xs text-gray-600">
														<LuDot />
														Expires {data.endMonth} {data.endYear}
													</span>
												)}
											</div>

											<div className="flex items-center justify-start gap-2 w-full text-xs font-medium ">
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
						)}
					</>
				)}
			</div>

			{showProjectModal && (
				<AddProjectModal setShowProjectModal={setShowProjectModal} />
			)}

			{showEditProjectModal && (
				<EditProjectModal
					setShowEditProjectModal={setShowEditProjectModal}
					projectId={editingProjectId as number}
					onSave={refetch}
				/>
			)}
		</div>
	);
};
