import { AddProjectModal } from "@/modalForms/AddProjectModal";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export const Projects = () => {
	const [showProjectModal, setShowProjectModal] = useState<boolean>(false);

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center">
				<button
					type="button"
					onClick={() => setShowProjectModal(true)}
					className="inline-flex items-center justify-center gap-2 w-32 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0"
				>
                    <FaPlus/>
					Add Project
				</button>
			</div>
			<div className="flex flex-col items-center h-32 border rounded-lg mt-2 w-full px-3 py-2">
				<div className="flex items-center justify-between w-full">
					<span className="text-gray-700 font-medium text-base">Projects</span>
					{/* <button
						type="button"
						onClick={() => setShowProjectModal(true)}
						className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
					>
						<MdModeEdit className="size-5" />
					</button> */}
				</div>

				{showProjectModal && (
					<AddProjectModal setShowProjectModal={setShowProjectModal} />
				)}
			</div>
		</div>
	);
};
