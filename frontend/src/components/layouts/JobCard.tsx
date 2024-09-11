import { MdLocationPin } from "react-icons/md";
import { FaIndianRupeeSign, FaRegBookmark } from "react-icons/fa6";
import { HiOutlineClock } from "react-icons/hi2";

export const JobCard = ({ job }: { job: any }) => {
	return (
		<div className="p-2">
			<div className="w-full max-w-sm border bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 my-5 overflow-hidden">
				<div className="p-5 space-y-4">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
								{job.company_name.charAt(0)}
							</div>
							<div>
								<h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
									{job.position}
								</h3>
								<p className="text-sm text-gray-600">{job.company_name}</p>
							</div>
						</div>
						<button
							className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
							aria-label="Bookmark job"
						>
							<FaRegBookmark className="size-5" />
						</button>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-sm text-gray-600">
							<MdLocationPin className="size-4 mr-2 text-gray-400" />
							<span>{job.location}</span>
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<FaIndianRupeeSign className="size-4 mr-2 text-gray-400" />
							<span>{job.salary}</span>
						</div>
						<div className="flex items-center text-sm text-gray-500">
							<HiOutlineClock className="size-4 mr-2" />
							<span>Posted {job.posted}</span>
						</div>
					</div>

					<div className="pt-4 border-t border-gray-200">
						<button className="w-full py-2 px-4 bg-slate-800 hover:bg-zinc-900 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
							View Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
