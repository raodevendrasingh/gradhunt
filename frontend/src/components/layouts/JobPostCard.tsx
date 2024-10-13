import { JobPosts } from "@/types/userTypes";
import { LuMapPin, LuCalendarClock } from "react-icons/lu";
import { timesAgo } from "@/utils/DaysAgo";
import { Link } from "react-router-dom";
import MenuBox from "./MenuBox";
import { LuIndianRupee } from "react-icons/lu";

interface JobCardProps {
	jobPost: JobPosts;
}

export const JobPostCard = ({ jobPost }: JobCardProps) => {
	return (
		<div className="bg-slate-50 border rounded-2xl p-4 mb-4 w-full relative">
			<div className="absolute top-4 right-4">
				<MenuBox jobId={jobPost.jobId} />
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-1">
				{jobPost.jobTitle}
			</h2>

			<div className="flex gap-2 mb-4">
				<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
					{jobPost.jobType}
				</span>
				<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
					{jobPost.workType}
				</span>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 mb-2 text-sm">
				<div className="flex items-center text-gray-600">
					<LuMapPin size={18} className="mr-1" />
					<span>{jobPost.jobLocation}</span>
				</div>
				<div className="flex items-center text-gray-600">
					<LuIndianRupee size={16} className="mr-1" />
					<span>{jobPost.salaryRange}</span>
				</div>
			</div>

			<div className="flex  gap-2 justify-between">
				<div className="flex items-center text-gray-600 text-sm">
					<LuCalendarClock size={18} className="mr-2" />
					<span>Posted {timesAgo(jobPost.postedDate)}</span>
				</div>
				<Link
					to={`job/${jobPost.jobId.toLowerCase()}`}
					className="px-4 py-1.5 text-gray-600 hover:bg-slate-700 hover:text-white font-medium rounded-xl border-2 border-gray-400 hover:border-gray-700 transition-colors"
				>
					Details
				</Link>
			</div>
		</div>
	);
};
