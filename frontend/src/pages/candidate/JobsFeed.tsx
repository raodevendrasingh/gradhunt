import { JobSearchForm } from "@/components/layouts/JobSearchBar";
import { useCitySearch } from "@/hooks/useCitySearch";
import { handleSearch } from "./JobSearch";
import { FilterSideBar } from "./components/layout/FilterSideBar";
import {
    FaBuilding,
	FaClock,
	FaIndianRupeeSign,
	FaRegBookmark,
	FaStar,
} from "react-icons/fa6";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { MdWork } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { featuredCompanies, jobsData, topIndustries } from "@/utils/dummyData";

export default function JobsFeed() {
	const [jobs] = useState(jobsData);

	const {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
	} = useCitySearch();

	return (
		<>
			<div className="flex flex-col w-full h-full pb-20">
				<div className="flex items-center justify-center bg-zinc-900 pt-20">
					<JobSearchForm
						onSubmit={handleSearch}
						isLoading={isLoading}
						cityOptions={cityOptions}
						handleInputChange={handleInputChange}
						formatOptionLabel={formatOptionLabel}
						error={error || undefined}
					/>
				</div>
				<div className="flex w-full items-start gap-3 pt-10 max-w-7xl mx-auto ">
					<div className="w-[20%] flex flex-col gap-2 border bg-white rounded-xl">
						<FilterSideBar />
					</div>
					<div className="w-[60%] space-y-4">
						{jobs.map((job) => (
							<div
								key={job.id}
								className="bg-white border rounded-xl overflow-hidden"
							>
								<div className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
												{/* <img
													src={job.logo}
													alt={`${job.company} logo`}
													className="w-full h-full object-cover"
												/> */}
											</div>
											<div>
												<h2 className="text-xl font-semibold text-gray-800">
													{job.title}
												</h2>
												<p className="text-gray-600">{job.company}</p>
											</div>
										</div>
										<button className="text-zinc-800 hover:text-zinc-800 transition-colors duration-300">
											<FaRegBookmark className="w-6 h-6" />
										</button>
									</div>
									<div className="mt-4">
										<p className="text-gray-800 line-clamp-2">
											{job.description}
										</p>
									</div>
									<div className="mt-4 flex justify-between text-sm text-gray-500">
										<div className="space-y-2">
											<div className="flex items-center space-x-2">
												<FaMapMarkerAlt className="w-4 h-4" />
												<span className="text-sm text-gray-800">
													{job.location}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<MdWork className="w-4 h-4" />
												<span className="text-sm text-gray-800">
													{job.type}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<FaIndianRupeeSign className="w-4 h-4" />
												<span className="text-sm text-gray-800">
													{job.salary}
												</span>
											</div>
										</div>
										<div className="flex flex-col items-end justify-between">
											<div className="flex items-center space-x-2">
												<FaClock className="w-4 h-4" />
												<span className="text-sm text-gray-800">
													Posted {job.postedAgo}
												</span>
											</div>
											<div className="space-x-2 flex items-center">
												<button className="flex items-center justify-center gap-2 bg-zinc-800 text-white py-2 px-4 rounded-md hover:bg-zinc-700 transition-colors duration-300">
													Apply
													<HiMiniArrowUpRight className="size-5" />
												</button>
												<button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300">
													Easy Apply
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="w-[20%] space-y-4">
						<div className="border bg-white rounded-xl p-4">
							<h3 className="text-lg font-semibold mb-3 flex items-center">
								<FaStar className="text-yellow-400 mr-2" />
								Featured Companies
							</h3>
							<ul className="space-y-2">
								{featuredCompanies.map((company) => (
									<li
										key={company.id}
										className="flex justify-between items-center border border-gray-200 rounded-md px-2 py-1"
									>
										<span>{company.name}</span>
										<span className="text-sm text-gray-500">
											{company.openings} jobs
										</span>
									</li>
								))}
							</ul>
							<button className="mt-4 w-full bg-zinc-100 text-zinc-800 py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors duration-300">
								View All Companies
							</button>
						</div>

						<div className="border bg-white rounded-xl p-4">
							<h3 className="text-lg font-semibold mb-3 flex items-center">
								<FaBuilding className="text-blue-500 mr-2" />
								Top Industries
							</h3>
							<ul className="space-y-2">
								{topIndustries.map((industry) => (
									<li
										key={industry.id}
										className="flex justify-between items-center border border-gray-200 rounded-md px-2 py-1"
									>
										<span>{industry.name}</span>
										<span className="text-sm text-gray-500">
											{industry.companies} companies
										</span>
									</li>
								))}
							</ul>
							<button className="mt-4 w-full bg-zinc-100 text-zinc-800 py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors duration-300">
								Explore Industries
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
