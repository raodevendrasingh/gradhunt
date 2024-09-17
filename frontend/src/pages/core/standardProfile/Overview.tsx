import CustomCombobox from "@/components/layouts/CustomCombobox";
import ReorderButton from "@/components/layouts/ReorderButton";
import { UserAboutModal } from "@/modalForms/UserDescriptionModal";
import { MdModeEdit } from "react-icons/md";
import { useState } from "react";

export const Overview = () => {
	const [showAboutModal, setAboutModal] = useState<boolean>(false);

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center">
				<CustomCombobox />
				<ReorderButton />
			</div>
			<div className="flex flex-col items-center h-32 border rounded-lg mt-2 w-full px-3 py-1">
				<div className="flex items-center justify-between w-full">
					<span className="text-gray-700 font-medium text-base">About</span>
					<button
						type="button"
						onClick={() => setAboutModal(true)}
						className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
					>
                        <MdModeEdit className="size-5" />
                    </button>
				</div>
				<button
					type="button"
					onClick={() => setAboutModal(true)}
					className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
				>
					Add About
				</button>
				{showAboutModal && <UserAboutModal setAboutModal={setAboutModal} />}
			</div>
		</div>
	);
};
