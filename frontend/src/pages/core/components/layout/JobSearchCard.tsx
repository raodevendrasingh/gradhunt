import { JobCardProps } from "@/components/layouts/JobPostCard";
import { timesAgo } from "@/utils/DaysAgo";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaClock, FaIndianRupeeSign, FaRegBookmark } from "react-icons/fa6";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { MdWork } from "react-icons/md";

export const JobSearchCard = ({ jobPost }: JobCardProps) => {
	return (
		<div
			key={jobPost.id}
			className="bg-white border rounded-xl overflow-hidden"
		>
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
							{/* <img
								src={jobPost.company.companyLogo}
								alt={`${jobPost.company} logo`}
								className="w-full h-full object-cover"
							/> */}
						</div>
						<div>
							<h2 className="text-xl font-semibold text-gray-800">
								{jobPost.jobTitle}
							</h2>
							<p className="text-gray-600">{jobPost.company.companyName}</p>
						</div>
					</div>
					<button className="text-zinc-800 hover:text-zinc-800 transition-colors duration-300">
						<FaRegBookmark className="w-6 h-6" />
					</button>
				</div>
				<div className="mt-4">
					<p
						className="text-gray-800 line-clamp-2 text-sm"
						dangerouslySetInnerHTML={{
							__html:
								jobPost.jobDescription.split(" ").slice(0, 10).join(" ") +
								(jobPost.jobDescription.split(" ").length > 10 ? "..." : ""),
						}}
					></p>
				</div>
				<div className="mt-4 flex justify-between text-sm text-gray-500">
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<FaMapMarkerAlt className="w-4 h-4" />
							<span className="text-sm text-gray-800">
								{jobPost.jobLocation}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<MdWork className="w-4 h-4" />
							<span className="text-sm text-gray-800">{jobPost.jobType}</span>
						</div>
						<div className="flex items-center space-x-2">
							<FaIndianRupeeSign className="w-4 h-4" />
							<span className="text-sm text-gray-800">
								{jobPost.salaryRange}
							</span>
						</div>
					</div>
					<div className="flex flex-col items-end justify-between">
						<div className="flex items-center space-x-2">
							<FaClock className="w-4 h-4" />
							<span className="text-sm text-gray-800">
								Posted {timesAgo(jobPost.postedDate)}
							</span>
						</div>
						<div className="space-x-2 flex items-center">
							<button className="flex items-center justify-center gap-2 bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition-colors duration-300">
								Apply
								<HiMiniArrowUpRight className="size-5" />
							</button>
							<button className="bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition-colors duration-300">
								Easy Apply
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
