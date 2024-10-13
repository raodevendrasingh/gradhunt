import React, { useEffect, useState, useRef } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useFetchJobDetails } from "@/hooks/useFetchJobDetails";
import { useParams } from "react-router-dom";
import NotFound from "../common/NotFound";
import { Button } from "@/components/ui/Button";
import {
	LuArrowUpRight,
	LuBriefcase,
	LuCalendarClock,
	LuClock,
	LuIndianRupee,
	LuMapPin,
	LuPencil,
} from "react-icons/lu";
import { BsArrowLeftCircle } from "react-icons/bs";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export const JobDetailsPage: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (contentRef.current) {
				const isScrolled = contentRef.current.scrollTop > 0;
				setScrolled(isScrolled);
			}
		};

		const currentRef = contentRef.current;
		if (currentRef) {
			currentRef.addEventListener("scroll", handleScroll, { passive: true });
		}

		return () => {
			if (currentRef) {
				currentRef.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	const { jobId } = useParams<{ jobId: string }>();

	if (!jobId) {
		return <NotFound />;
	}

	const { data, isLoading } = useFetchJobDetails({ jobId });

	if (!data) {
		return <div>Loading...</div>;
	}

	const handleBackClick = () => {
		localStorage.setItem("selectedTab", "1");
		window.history.back();
	};

	const handleEditClick = () => {
		// Implement edit functionality
		console.log("Edit clicked");
	};
	return (
		<div className="flex h-full">
			<div className="relative flex flex-col w-full lg2:w-[70%] overflow-hidden border-r">
				<ScrollableHeader
					title={data.jobTitle}
					isScrolled={scrolled}
					onBackClick={handleBackClick}
					onEditClick={handleEditClick}
				/>
				<div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide">
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-5 bg-slate-50">
						<InfoItem icon={<LuMapPin size={20} />} text={data.jobLocation} />
						<InfoItem icon={<LuBriefcase size={20} />} text={data.jobType} />
						<InfoItem icon={<LuMapPin size={20} />} text={data.workType} />
						<InfoItem
							icon={<LuClock size={20} />}
							text={`${data.experience} years`}
						/>
						<InfoItem
							icon={<LuIndianRupee size={20} />}
							text={data.salaryRange}
						/>
						<InfoItem
							icon={<LuCalendarClock size={20} />}
							text={`Apply by: ${new Date(data.applicationDeadline).toLocaleDateString()}`}
						/>
					</div>

					<div className="p-5">
						<h2 className="text-xl font-semibold mb-2 text-gray-800">
							Required Skills
						</h2>
						<div className="flex flex-wrap gap-2">
							{isLoading
								? [...Array(8)].map((_, index) => (
										<div
											key={index}
											className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
										/>
									))
								: data.requiredSkills.map((skill) => (
										<div
											key={skill.value}
											className="flex items-center justify-center text-sm px-2.5 py-[3px] bg-slate-50 text-gray-700 rounded-full border m-1 cursor-context-menu"
										>
											<img
												src={skill.image}
												alt={skill.label}
												className="size-4 mr-2"
											/>
											{skill.label}
										</div>
									))}
						</div>
					</div>

					<div className="p-5">
						<h2 className="text-xl font-semibold mb-2 text-gray-800">
							Job Description
						</h2>
						<div
							dangerouslySetInnerHTML={{ __html: data.jobDescription }}
							className="text-gray-700 prose max-w-none"
							style={{ lineHeight: "1.5" }}
						/>
					</div>

					<div className="flex items-center justify-between border-t p-5 space-x-4">
						{data.applyWithUs && (
							<Button
								variant="secondary"
								fullWidth
								className="flex items-center gap-2"
							>
								Apply Now
								<IoPaperPlaneOutline size={18} />
							</Button>
						)}
						{data.applyLink && (
							<Button
								variant="primary"
								fullWidth
								className="flex items-center gap-2"
								onClick={() =>
									window.open(data.applyLink, "_blank", "noopener,noreferrer")
								}
							>
								Apply on Company Site
								<LuArrowUpRight size={18} />
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const InfoItem: React.FC<{ icon: React.ReactNode; text: string }> = ({
	icon,
	text,
}) => (
	<div className="flex items-center text-gray-800">
		<span className="text-gray-500 mr-2">{icon}</span>
		<span>{text}</span>
	</div>
);

interface ScrollableHeaderProps {
	title: string;
	isScrolled: boolean;
	onBackClick: () => void;
	onEditClick: () => void;
}

export const ScrollableHeader: React.FC<ScrollableHeaderProps> = ({
	title,
	isScrolled,
	onBackClick,
	onEditClick,
}) => {
	const transition = { duration: 0.2, ease: "easeInOut" };

	return (
		<motion.div
			className={clsx(
				"sticky top-0 left-0 right-0 z-40 transition-all",
				isScrolled ? "bg-white border-b" : "bg-gray-100"
			)}
			animate={{ height: isScrolled ? 60 : 130 }}
			transition={transition}
		>
			<div
				className={clsx(
					"flex items-center h-full w-full p-4",
					isScrolled ? "justify-between" : "justify-between flex-col"
				)}
			>
				<div
					className={clsx(
						"flex items-center",
						isScrolled ? "gap-5" : "w-full justify-between mb-2"
					)}
				>
					<BsArrowLeftCircle
						className="cursor-pointer text-gray-600"
						size={24}
						onClick={onBackClick}
					/>
					<motion.h1
						initial={false}
						animate={{
							opacity: isScrolled ? 1 : 0,
							x: isScrolled ? 0 : -20,
							position: isScrolled ? "relative" : "absolute",
						}}
						transition={transition}
						className="text-xl font-bold text-gray-800 w-80"
					>
						{title}
					</motion.h1>
					<motion.div
						initial={false}
						animate={{
							opacity: isScrolled ? 0 : 1,
							scale: isScrolled ? 0.8 : 1,
							position: isScrolled ? "absolute" : "relative",
							right: isScrolled ? 16 : 0,
						}}
						transition={transition}
					>
						<Button variant="outline" onClick={onEditClick}>
							Edit
						</Button>
					</motion.div>
				</div>
				<motion.h1
					initial={false}
					animate={{
						opacity: isScrolled ? 0 : 1,
						y: isScrolled ? -20 : 0,
						height: isScrolled ? 0 : "auto",
						marginTop: isScrolled ? 0 : 8,
					}}
					transition={transition}
					className="text-2xl font-bold text-gray-800 w-full overflow-hidden"
				>
					{title}
				</motion.h1>
				<motion.div
					initial={false}
					animate={{
						opacity: isScrolled ? 1 : 0,
						scale: isScrolled ? 1 : 0.8,
						position: isScrolled ? "relative" : "absolute",
						right: isScrolled ? 0 : 16,
					}}
					transition={transition}
				>
					<Button variant="outline" onClick={onEditClick}>
						Edit
					</Button>
				</motion.div>
			</div>
		</motion.div>
	);
};
