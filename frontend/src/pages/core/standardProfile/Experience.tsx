import ComboboxWork from "@/components/layouts/ComboboxWork";
import { AddExpModal } from "@/modalForms/AddExpModal";
import React, { useState } from "react";

export const Experience = () => {
	const [showExpModal, setShowExpModal] = useState<boolean>(false);

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center">
				<ComboboxWork />
			</div>
			<div className="flex flex-col items-center h-32 border rounded-lg mt-2 w-full px-3 py-2">
				<div className="flex items-center justify-between w-full">
					<span className="text-gray-700 font-medium text-base">
						Experience
					</span>
					{/* <button
						type="button"
						onClick={() => setShowExpModal(true)}
						className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
					>
						<MdModeEdit className="size-5" />
					</button> */}
				</div>

				{showExpModal && <AddExpModal setShowExpModal={setShowExpModal} />}
			</div>
		</div>
	);
};
