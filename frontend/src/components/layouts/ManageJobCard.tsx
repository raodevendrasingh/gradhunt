import React from "react";
import { JobPosts } from "@/types/userTypes";
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { timesAgo } from "@/utils/DaysAgo";
import { Link } from "react-router-dom";
import JobCardMenu from "./JobCardMenu";
import { FaMoneyBill1Wave } from "react-icons/fa6";

export interface JobCardProps {
	jobPost: JobPosts;
}

export const ManageJobCard: React.FC<JobCardProps> = ({ jobPost }) => {
	return (
		<div className="border border-gray-200 rounded-2xl p-6 mb-4 bg-gradient-to-br from-gray-50 to-white relative">
			<div className="absolute top-4 right-4">
				<JobCardMenu
					editUrl={`/company/${jobPost.companyData.companyName.toLowerCase()}/manage-job/${jobPost.jobId.toLowerCase()}/edit`}
					archiveUrl={`/api/jobs/manage/${jobPost.jobId.toLowerCase()}`}
				/>
			</div>

			<h2 className="text-2xl font-bold text-gray-800 mb-2">
				{jobPost.jobTitle}
			</h2>

			<div className="flex flex-wrap gap-2 mb-3">
				<span className="text-xs font-medium text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
					{jobPost.jobType}
				</span>
				<span className="text-xs font-medium text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
					{jobPost.workType}
				</span>
			</div>

			<p
				className="text-gray-700 text-sm mb-4 line-clamp-2"
				dangerouslySetInnerHTML={{
					__html:
						jobPost.jobDescription.split(" ").slice(0, 15).join(" ") +
						(jobPost.jobDescription.split(" ").length > 15 ? "..." : ""),
				}}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
				<div className="flex items-center text-gray-600">
					<FaMapMarkerAlt className="mr-2 text-gray-400" />
					<span>{jobPost.jobLocation}</span>
				</div>
				<div className="flex items-center text-gray-600">
					<FaMoneyBill1Wave className="mr-2 text-gray-400" />
					<span>
						{jobPost.currency} {jobPost.lowestSalary} - {jobPost.highestSalary}
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center text-gray-500 text-xs">
					<FaRegClock className="mr-2 mt-[1px]" />
					<span>Posted {timesAgo(jobPost.postedDate)}</span>
				</div>
				<Link
					to={`/company/${jobPost.companyData.companyName.toLowerCase()}/manage-job/${jobPost.jobId.toLowerCase()}`}
				>
					<button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
						View Details
					</button>
				</Link>
			</div>
		</div>
	);
};
