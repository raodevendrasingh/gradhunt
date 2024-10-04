import { useFetchProjectData } from "@/hooks/useFetchProjectsData";
import { AddProjectModal } from "@/modalForms/AddProjectModal";
import { EditProjectModal } from "@/modalForms/EditProjectModal";
import { useState } from "react";
import { ContentSkeleton } from "../../components/ui/ContentSkeleton";
import { MdModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { GoGlobe } from "react-icons/go";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa6";
import { useUser } from "@clerk/clerk-react";


export const Projects = () => {
	const [showProjectModal, setShowProjectModal] = useState<boolean>(false);

	const [editingProjectId, setEditingProjectId] = useState<number>();
	const [showEditProjectModal, setShowEditProjectModal] =
		useState<boolean>(false);

    const { isSignedIn } = useUser();

	const {
		data: projectData,
		isLoading: isProjectLoading,
		refetch: refetchProjects,
		error,
	} = useFetchProjectData();

	const handleEditProject = (id: number) => {
		setEditingProjectId(id);
		setShowEditProjectModal(true);
	};
    
	return (
		<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-2">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					
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
		</div>
	);
};
