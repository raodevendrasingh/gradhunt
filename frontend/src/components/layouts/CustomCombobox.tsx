import { AddCertificateModal } from "@/modalForms/AddCertificateModal";
import { AddEduModal } from "@/modalForms/AddEduModal";
import { AddExpModal } from "@/modalForms/AddExpModal";
import React, { useState } from "react";
import { FaPlus, FaChevronUp, FaChevronDown } from "react-icons/fa6";

interface Option {
	id: string;
	label: string;
}

const options: Option[] = [
	{ id: "experience", label: "Experience" },
	{ id: "education", label: "Education" },
	{ id: "certifications", label: "Certifications" },
	{ id: "achievements", label: "Achievements" },
];

export default function CustomCombobox() {
	const [isOpen, setIsOpen] = useState(false);

	const [showExpModal, setShowExpModal] = useState<boolean>(false);
	const [showEduModal, setShowEduModal] = useState<boolean>(false);
	const [showCertifyModal, setShowCertifyModal] = useState<boolean>(false);
	const [showAchieveModal, setShowAchieveModal] = useState<boolean>(false);

	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleOptionClick = (optionId: string) => {
		setSelectedOptions((prev) =>
			prev.includes(optionId)
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId]
		);
		// You can add your modal opening logic here
		console.log(`Selected option: ${optionId}`);
		if (optionId === "experience") {
			setShowExpModal(true);
		} else if (optionId === "education") {
			setShowEduModal(true);
			<AddEduModal setShowEduModal={setShowEduModal} />;
		} else if (optionId === "certifications") {
			setShowCertifyModal(true);
		} else if (optionId === "achievements") {
			setShowAchieveModal(true);
		}
	};

	return (
		<div className="relative inline-block text-left">
			{showEduModal && <AddEduModal setShowEduModal={setShowEduModal} />}
			{showExpModal && <AddExpModal setShowExpModal={setShowExpModal} />}
			{showCertifyModal && (
				<AddCertificateModal setShowCertifyModal={setShowCertifyModal} />
			)}
			{/* {showAchieveModal && <AddAchievementModal setShowAchieveModal={setShowAchieveModal} />} */}
			<div>
				<button
					type="button"
					className="inline-flex items-center justify-center gap-2 w-32 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0"
					onClick={toggleDropdown}
				>
					Add Section
					{isOpen ? <FaChevronUp /> : <FaChevronDown />}
				</button>
			</div>

			{isOpen && (
				<div className="origin-top-right absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
					<div
						className="p-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						{options.map((option) => (
							<button
								key={option.id}
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md"
								role="menuitem"
								onClick={() => handleOptionClick(option.id)}
							>
								<FaPlus className="mr-3 size-4" />
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
