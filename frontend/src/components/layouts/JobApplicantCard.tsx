import React from "react";
import { JobPosts } from "@/types/userTypes";
import { FaRegClock } from "react-icons/fa";
import { timesAgo } from "@/utils/DaysAgo";
import { Link } from "react-router-dom";

export interface JobCardProps {
	jobPost: JobPosts;
}

export const JobApplicantCard: React.FC<JobCardProps> = ({ jobPost }) => {
	return (
		<div className=" flex flex-col gap-3 border border-gray-200 rounded-xl p-5 mb-2 bg-gradient-to-br from-gray-50 to-white relative cursor-default">
			<div className="absolute top-5 right-5 flex gap-3 text-sm">
				{jobPost.isActive ? (
					<span className="text-green-600 bg-green-100 rounded-full px-3 py-0.5">
						Active
					</span>
				) : (
					<span className="text-red-600 bg-rose-100 rounded-full px-3 py-0.5">
						Inactive
					</span>
				)}
			</div>
			<div className="flex items-center gap-5">
				<h2 className="text-2xl font-bold text-gray-800">{jobPost.jobTitle}</h2>
				<h5 className="text-sm text-gray-600 ">
					<span className="text-gray-600 pr-1.5">JobId</span>
					<span className="font-medium font-mono ">{jobPost.jobId}</span>
				</h5>
			</div>

			<div className="flex flex-wrap gap-5">
				<span className="text-sm font-medium text-gray-600 px-3 py-1 border rounded-lg ">
					Openings: {jobPost.openings}
				</span>
				<span className="text-sm font-medium text-gray-600 px-3 py-1 border rounded-lg">
					Applicants: {jobPost.applicants}
				</span>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center text-gray-500 text-xs">
					<FaRegClock className="mr-2 mt-[1px]" />
					<span>Posted {timesAgo(jobPost.postedDate)}</span>
				</div>
				<Link
					to={`/company/${jobPost.companyData.companyName.toLowerCase()}/applicants/${jobPost.jobId.toLowerCase()}`}
				>
					<button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
						View Applicants
					</button>
				</Link>
			</div>
		</div>
	);
};
