import ReorderButton from "@/components/layouts/ReorderButton";
import { UserAboutModal } from "@/modalForms/UserDescriptionModal";
import { MdModeEdit } from "react-icons/md";
import { useState } from "react";
import ComboboxAll from "@/components/layouts/ComboboxAll";
import { useFetchAboutSection } from "@/hooks/useFetchAboutData";
import { useUser } from "@clerk/clerk-react";
import { FaRegTrashCan } from "react-icons/fa6";
import { SkillSection } from "./ResumeComponents/SkillSection";
import FileUploadSection from "./FileUploadSection";
import { BsTrash } from "react-icons/bs";
import { ResumeDeleteModal } from "@/modalForms/ResumeDeleteModal";

export const Overview = () => {
	const [showAboutModal, setAboutModal] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

	const { userDesc, isLoading, refetch, error } = useFetchAboutSection();
	const { isSignedIn } = useUser();

	return (
		<div className="flex flex-col">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<ComboboxAll />
					<ReorderButton />
				</div>
			)}
			<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-1">
				<div className="flex items-center justify-between w-full">
					<span className="text-gray-700 font-medium text-base">About</span>
					{isSignedIn && (
						<button
							type="button"
							onClick={() => setAboutModal(true)}
							className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
						>
							<MdModeEdit className="size-5" />
						</button>
					)}
				</div>
				<div className="flex items-center justify-start w-full">
					{isLoading ? (
						<div className="flex flex-col w-full gap-2">
							<div className="h-4 w-full skeleton" />
							<div className="h-4 w-full skeleton" />
							<div className="h-4 w-1/2 skeleton" />
						</div>
					) : (
						<div className="flex flex-wrap text-sm">
							{userDesc?.description}
						</div>
					)}
				</div>
				{!isLoading && !userDesc && (
					<div className="flex items-center justify-center w-full min-h-32">
						<button
							type="button"
							onClick={() => setAboutModal(true)}
							className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
						>
							Add About
						</button>
					</div>
				)}

				{showAboutModal && <UserAboutModal setAboutModal={setAboutModal} />}
			</div>
			<SkillSection />
			<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-1">
				<div className="flex items-center justify-between w-full">
					<span className="text-gray-700 font-medium text-base">Resume</span>
					{isSignedIn && (
						<button
							type="button"
							onClick={() => setShowDeleteModal(true)}
							className="p-2 rounded-full text-gray-600 bg-white hover:bg-slate-50 hover:text-red-500 text-sm font-medium  cursor-pointer transition-colors"
						>
							<BsTrash className="size-5" />
						</button>
					)}
				</div>
                
				<FileUploadSection />
                {showDeleteModal && <ResumeDeleteModal setShowDeleteModal={setShowDeleteModal} />}
			</div>
		</div>
	);
};
