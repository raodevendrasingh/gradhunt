import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
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
} from "react-icons/lu";
import { BsArrowLeftCircle } from "react-icons/bs";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import JobCardMenu from "@/components/layouts/JobCardMenu";

export const JobDetailsPage: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const { jobId } = useParams<{ jobId: string }>();

	if (!jobId) {
		return <NotFound />;
	}

	const checkScroll = () => {
		if (contentRef.current) {
			const isScrolled = contentRef.current.scrollTop > 0;
			setScrolled(isScrolled);
		}
	};

	useEffect(() => {
		// Check scroll position after initial render
		checkScroll();

		// Set up mutation observer to detect when content is fully loaded
		const observer = new MutationObserver(() => {
			checkScroll();
		});

		if (contentRef.current) {
			observer.observe(contentRef.current, { childList: true, subtree: true });
		}

		const handleScroll = () => {
			checkScroll();
		};

		const currentRef = contentRef.current;
		if (currentRef) {
			currentRef.addEventListener("scroll", handleScroll, { passive: true });
		}

		return () => {
			if (currentRef) {
				currentRef.removeEventListener("scroll", handleScroll);
			}
			observer.disconnect();
		};
	}, []);

	const { data, isLoading } = useFetchJobDetails({ jobId });

	if (!data) {
		return <div>Loading...</div>;
	}

	const handleBackClick = () => {
		localStorage.setItem("selectedTab", "1");
		window.history.back();
	};

	return (
		<div className="flex h-full">
			<div className="relative flex flex-col w-full lg2:w-[70%] overflow-hidden border-r">
				<ScrollableHeader
					title={data.jobTitle}
					isScrolled={scrolled}
					onBackClick={handleBackClick}
				/>
				<div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide">
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-5 bg-slate-100 rounded-b-2xl">
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
}

export const ScrollableHeader: React.FC<ScrollableHeaderProps> = ({
	title,
	isScrolled,
	onBackClick,
}) => {
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setAnimate(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const transition = { duration: 0, ease: "easeInOut" };

	return (
		<motion.div
			className={clsx(
				"sticky top-0 left-0 right-0 z-40 transition-all",
				isScrolled
					? "bg-white bg-opacity-20 backdrop-blur-md border-b"
					: "bg-slate-200"
			)}
			animate={{ height: animate ? (isScrolled ? 60 : 130) : 130 }}
			transition={transition}
		>
			<div className="flex flex-col content-center h-full w-full py-4">
				<div className="flex justify-between items-center px-4">
					<BsArrowLeftCircle
						className="cursor-pointer text-gray-600"
						size={24}
						onClick={onBackClick}
					/>
					<JobCardMenu editUrl="edit" />
				</div>

				<div className="flex-grow flex items-center px-4">
					<AnimatePresence initial={false} mode="wait">
						{isScrolled ? (
							<motion.h1
								key="scrolled-title"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: -30 }}
								exit={{ opacity: 0, y: 20 }}
								transition={transition}
								className="text-xl ml-12 font-bold text-gray-800 truncate w-fit"
							>
								{title}
							</motion.h1>
						) : (
							<motion.h1
								key="full-title"
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 15 }}
								exit={{ opacity: 0, y: 15 }}
								transition={transition}
								className="text-2xl font-bold text-gray-800 truncate flex-grow"
							>
								{title}
							</motion.h1>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
};
