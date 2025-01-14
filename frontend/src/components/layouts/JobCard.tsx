import { MdLocationPin } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi2";
import { JobPosts } from "@/types/userTypes";
import { timesAgo } from "@/utils/DaysAgo";
import { Link } from "react-router-dom";

export const JobCard = ({ job }: { job: JobPosts }) => {
	return (
		<div className="p-2">
			<div className="w-full max-w-sm border bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 my-5 overflow-hidden">
				<div className="p-5 space-y-4">
					<div className="flex items-start ">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-gray-100 rounded-xl border flex-shrink-0 overflow-hidden">
								<img
									src={job.companyData.companyLogo}
									alt={`${job.companyData} logo`}
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
									{job.jobTitle}
								</h3>
								<p className="text-sm text-gray-600">
									{job.companyData.companyName}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-sm text-gray-600">
							<MdLocationPin className="size-4 mr-2 text-gray-400" />
							<span>{job.jobLocation}</span>
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<span className="font-semibold text-base ml-1 mr-2 text-gray-400">
								{job.currency}
							</span>
							<span>
								{job.lowestSalary + " - " + job.highestSalary}
							</span>
						</div>
						<div className="flex items-center text-sm text-gray-500">
							<HiOutlineClock className="size-4 mr-2" />
							<span>Posted {timesAgo(job.postedDate)}</span>
						</div>
					</div>

					<div className="pt-4 border-t border-gray-200">
						<Link
							to={`company/${job.companyData.companySlug}/job/${job.jobId.toLowerCase()}`}
						>
							<button className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
								View Details
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
