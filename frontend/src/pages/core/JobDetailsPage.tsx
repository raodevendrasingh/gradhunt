import React, { useEffect, useState, useRef, ReactNode } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useFetchJobDetails } from "@/hooks/useFetchJobDetails";
import { useParams } from "react-router-dom";
import NotFound from "../common/NotFound";
import { Button } from "@/components/ui/Button";
import {
	LuArrowUpRight,
	LuBriefcase,
	LuCalendar,
	LuClock,
	LuMapPin,
} from "react-icons/lu";
import { BsArrowLeftCircle } from "react-icons/bs";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import JobCardMenu from "@/components/layouts/JobCardMenu";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { HiOutlineUsers } from "react-icons/hi2";
import { formatDate } from "@/utils/FormatDate";
import { timesAgo } from "@/utils/DaysAgo";
import { LoadingBlock } from "@/components/ui/LoadingBlock";

export const JobDetailsPage: React.FC = () => {
	const contentRef = useRef<HTMLDivElement>(null);
	const { jobId } = useParams<{ jobId: string }>();

	if (!jobId) {
		return <NotFound />;
	}

	const { data, isLoading } = useFetchJobDetails({ jobId });

	if (!data || isLoading) {
		return (
			<div className="w-full lg2:w-[70%] h-screen flex items-center justify-center border-r">
				<LoadingBlock size={36} color="#475569" />
			</div>
		);
	}

	const handleBackClick = () => {
		localStorage.setItem("selectedTab", "1");
		window.history.back();
	};

	return (
		<div className="flex h-full">
			<div className="relative flex flex-col w-full lg2:w-[70%] overflow-hidden border-r">
				<div className="sticky top-0 left-0 right-0 z-40 bg-slate-50 px-4 pt-4">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center justify-start">
							<button
								onClick={handleBackClick}
								className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
							>
								<BsArrowLeftCircle
									className="text-gray-600 hover:text-gray-800"
									size={24}
								/>
							</button>
							<div className="flex items-center pl-2">
								<h1 className="text-xl font-bold text-gray-800 pr-4 truncate">
									{data.jobTitle}
								</h1>
								<div className="flex items-center gap-2 ">
									<span className="px-2.5 py-1 bg-white rounded-md text-gray-600 text-sm border border-gray-100">
										JobID: {data.jobId}
									</span>
								</div>
							</div>
						</div>
						<JobCardMenu editUrl="edit" />
					</div>
				</div>
				<div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide">
					<div className="p-6 bg-gradient-to-b from-slate-50 to-white">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
							<InfoItem
								icon={<LuClock size={20} />}
								title="Posted"
								text={timesAgo(data.postedDate)}
							/>
							<InfoItem
								icon={<HiOutlineUsers size={20} />}
								title="Applicants"
								text={data.applicants.toString()}
							/>
							<InfoItem
								icon={<HiOutlineUsers size={20} />}
								title="Openings"
								text={data.openings.toString()}
							/>
							<InfoItem
								icon={<LuMapPin size={20} />}
								title="Location"
								text={data.jobLocation}
							/>
							<InfoItem
								icon={<LuBriefcase size={20} />}
								title="Job Type"
								text={data.jobType}
							/>
							<InfoItem
								icon={<LuMapPin size={20} />}
								title="Work Type"
								text={data.workType}
							/>
							<InfoItem
								icon={<LuClock size={20} />}
								title="Experience"
								text={`${data.experience} years`}
							/>
							<InfoItem
								icon={<LiaMoneyBillWaveAltSolid size={20} />}
								title="Salary"
								text={`${data.currency} ${data.lowestSalary} - ${data.highestSalary}`}
							/>
							<InfoItem
								icon={<LuCalendar size={20} />}
								title="Application Deadline"
								text={formatDate(data.applicationDeadline)}
							/>
						</div>
					</div>

					<div className="p-6 bg-slate-50">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">
							Required Skills
						</h2>
						<div className="flex flex-wrap gap-3">
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
											className="flex items-center justify-center text-sm px-4 py-1.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 transition-colors duration-200"
										>
											<img
												src={skill.image}
												alt={skill.label}
												className="w-4 h-4 mr-2"
											/>
											{skill.label}
										</div>
									))}
						</div>
					</div>

					<div className="p-6 bg-white">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">
							Job Description
						</h2>
						<div
							dangerouslySetInnerHTML={{ __html: data.jobDescription }}
							className="text-gray-700 prose max-w-none"
							style={{ lineHeight: "1.6" }}
						/>
					</div>
					<div className=" sticky bottom-0 flex items-center justify-end bg-white border-t p-3 space-x-4">
						{data.applyWithUs && data.applyLink ? (
							<>
								<Button
									variant="primary"
									className="flex w-full items-center gap-2 rounded-lg py-2.5"
								>
									Easy Apply
									<IoPaperPlaneOutline size={18} />
								</Button>
								<Button
									variant="secondary"
									className="flex w-full items-center gap-2 rounded-lg py-2.5"
									onClick={() =>
										window.open(data.applyLink, "_blank", "noopener,noreferrer")
									}
								>
									Apply
									<LuArrowUpRight size={18} />
								</Button>
							</>
						) : (
							<>
								{data.applyWithUs && (
									<Button
										variant="primary"
										className="flex w-44 items-center gap-2 rounded-lg py-2.5"
									>
										Easy Apply
										<IoPaperPlaneOutline size={18} />
									</Button>
								)}
								{data.applyLink && (
									<Button
										variant="secondary"
										className="flex w-44 items-center gap-2 rounded-lg py-2.5"
										onClick={() =>
											window.open(
												data.applyLink,
												"_blank",
												"noopener,noreferrer"
											)
										}
									>
										Apply
										<LuArrowUpRight size={18} />
									</Button>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const InfoItem: React.FC<{
	icon: React.ReactNode;
	title: string;
	text: string;
}> = ({ icon, title, text }) => (
	<div className="flex items-start p-2.5 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
		<div className="flex items-center justify-center w-8 h-8 bg-slate-50 rounded-full mr-4 mt-1">
			<span className="text-gray-600">{icon}</span>
		</div>
		<div className="flex flex-col">
			<span className="text-sm font-medium text-gray-500 mb-1">{title}</span>
			<span className="text-gray-800 font-medium">{text}</span>
		</div>
	</div>
);
