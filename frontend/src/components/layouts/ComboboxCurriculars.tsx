import { useState } from "react";
import { FaPlus, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { Option } from "./ComboboxAll";
import { AddProjectModal } from "@/modal-forms/project/AddProjectModal";
import { AddCertificateModal } from "@/modal-forms/certificate/AddCertificateModal";
import { useFetchProjectData } from "@/hooks/academia/useFetchProjectsData";
import { useFetchCertificateData } from "@/hooks/academia/useFetchCertificateData";

const options: Option[] = [
	{ id: "projects", label: "Projects" },
	{ id: "certifications", label: "Certifications" },
];
// { id: "achievements", label: "Achievements" },

export default function ComboboxCurriculars() {
	const [isOpen, setIsOpen] = useState(false);
	const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
	const [showCertifyModal, setShowCertifyModal] = useState<boolean>(false);
	const [showAchieveModal, setShowAchieveModal] = useState<boolean>(false);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	const { refetch: refetchProjects } = useFetchProjectData();
	const { refetch: refetchCertificates } = useFetchCertificateData();

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleOptionClick = (optionId: string) => {
		setSelectedOptions((prev) =>
			prev.includes(optionId)
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId]
		);

		if (optionId === "certifications") {
			setShowCertifyModal(true);
		} else if (optionId === "projects") {
			setShowProjectModal(true);
		} else if (optionId === "achievements") {
			setShowAchieveModal(true);
		}
		setIsOpen(false);
	};

	return (
		<div className="relative inline-block text-left">
			{showProjectModal && (
				<AddProjectModal
					setShowProjectModal={setShowProjectModal}
					onSave={refetchProjects}
				/>
			)}
			{showCertifyModal && (
				<AddCertificateModal
					setShowCertifyModal={setShowCertifyModal}
					onSave={refetchCertificates}
				/>
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
				<div className="origin-top-right absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 z-10 ring-black ring-opacity-5">
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
