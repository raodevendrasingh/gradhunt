import React, { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { HiArrowsUpDown } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";

interface Option {
	id: string;
	label: string;
}

const initialOptions: Option[] = [
	{ id: "experience", label: "Experience" },
	{ id: "education", label: "Education" },
	{ id: "certifications", label: "Certifications" },
	{ id: "achievements", label: "Achievements" },
];

export default function ReorderButton() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [options, setOptions] = useState<Option[]>(initialOptions);
	const [draggedItem, setDraggedItem] = useState<Option | null>(null);

	const openDialog = () => setIsDialogOpen(true);
	const closeDialog = () => setIsDialogOpen(false);

	const onDragStart = (e: React.DragEvent<HTMLLIElement>, option: Option) => {
		setDraggedItem(option);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
		e.currentTarget.style.opacity = "0.4";
	};

	const onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
		e.currentTarget.style.opacity = "1";
		setDraggedItem(null);
	};

	const onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const onDrop = (e: React.DragEvent<HTMLLIElement>, targetOption: Option) => {
		e.preventDefault();
		if (!draggedItem) return;

		const newOptions = options.filter((option) => option.id !== draggedItem.id);
		const targetIndex = newOptions.findIndex(
			(option) => option.id === targetOption.id
		);
		newOptions.splice(targetIndex, 0, draggedItem);

		setOptions(newOptions);
		setDraggedItem(null);
	};

	return (
		<>
			<button
				className="inline-flex justify-center items-center gap-2 w-32 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0"
				onClick={openDialog}
			>
				<HiArrowsUpDown className="size-5" />
				Reorder
			</button>

			{isDialogOpen && (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer "
					>
						<motion.div
							initial={{ scale: 0.9, rotate: "0deg" }}
							animate={{ scale: 1, rotate: "0deg" }}
							exit={{ scale: 0, rotate: "0deg" }}
							onClick={(e) => e.stopPropagation()}
							className="bg-white p-4 rounded-2xl sm:mx-auto w-80 shadow-xl cursor-default relative overflow-hidden"
						>
							<div className="relative z-10 ">
								<div className="flex flex-col items-start justify-between">
									<h3 className="text-xl font-semibold text-gray-800 mt-1 pb-2">
										Reorder Sections
									</h3>
									<div className="flex flex-col w-full">
										<ul className="space-y-2">
											{options.map((option) => (
												<li
													key={option.id}
													draggable
													onDragStart={(e) => onDragStart(e, option)}
													onDragEnd={onDragEnd}
													onDragOver={onDragOver}
													onDrop={(e) => onDrop(e, option)}
													className="flex items-center p-2 bg-gray-100 rounded cursor-move"
												>
													<MdDragIndicator className="size-5 mr-3 text-gray-700" />
													{option.label}
												</li>
											))}
										</ul>
										<button
											className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-800 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-0 sm:text-sm"
											onClick={closeDialog}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}
		</>
	);
}
