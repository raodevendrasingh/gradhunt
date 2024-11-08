import { useEffect, useRef, useState } from "react";
import { Option } from "./ComboboxAll";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobPosts } from "@/types/userTypes";
import { JobPostDeleteDialog } from "@/modal-forms/JobPostDeleteDialog";

const options: Option[] = [
	{ id: "edit", label: "Edit" },
	{ id: "archive", label: "Archive" },
	{ id: "delete", label: "Delete" },
];

interface JobCardMenuProps {
	jobPost: JobPosts;
}

export default function JobCardMenu({ jobPost }: JobCardMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [showDeleteDailog, setShowDeleteDailog] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const navigate = useNavigate();
	const { getToken } = useAuth();

	const { refetch: refetchJobPosts } = useFetchJobPosts();

	const toggleDropdown = (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const archiveJobPost = async (jobId: string) => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User not authorized!");
			}
			const archiveUrl = `/api/jobs/manage/${jobPost.jobId.toLowerCase()}`;
			const response = await axios.patch(
				archiveUrl,
				{
					isArchived: true,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response);
			refetchJobPosts();
			toast.success("Job post archived successfully!");
		} catch (error) {
			console.log(error);
		}
	};

	const handleOptionClick = (optionId: string) => {
		setSelectedOptions((prev) =>
			prev.includes(optionId)
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId]
		);
		if (optionId === "edit") {
			navigate(
				`/company/${jobPost.companyData.companyName.toLowerCase()}/manage-job/${jobPost.jobId.toLowerCase()}/edit`
			);
		} else if (optionId === "archive") {
			archiveJobPost(jobPost.jobId);
		} else if (optionId === "delete") {
			setShowDeleteDailog(true);
		}
		setIsOpen(false);
	};

	return (
		<div className="relative inline-block text-left">
			<div className="mt-0.5 ">
				<button ref={buttonRef} onClick={toggleDropdown}>
					<HiDotsVertical className="size-5 text-gray-700" />
				</button>
			</div>

			{isOpen && (
				<div className="origin-top-right absolute right-0 mt-1 w-28 rounded-xl shadow-lg bg-white ring-1 z-50 ring-black ring-opacity-5">
					<div
						ref={dropdownRef}
						className="p-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						{options.map((option) => (
							<button
								key={option.id}
								className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-lg"
								role="menuitem"
								onClick={() => handleOptionClick(option.id)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
			{showDeleteDailog && (
				<JobPostDeleteDialog
					jobPost={jobPost}
					setShowDeleteDailog={setShowDeleteDailog}
				/>
			)}
		</div>
	);
}
