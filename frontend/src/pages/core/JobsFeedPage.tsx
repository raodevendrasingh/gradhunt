import { JobSearchForm } from "@/components/layouts/JobSearchBar";
import { useCitySearch } from "@/hooks/useCitySearch";
import { FilterSideBar } from "./components/layout/FilterSideBar";
import { FaClock, FaIndianRupeeSign, FaRegBookmark } from "react-icons/fa6";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { MdWork } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { jobsData } from "@/utils/dummyData";
import { ProfileBanner } from "@/components/layouts/ProfileBanner";
import { TextInput } from "@/components/ui/TextInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiBriefcase, FiSearch } from "react-icons/fi";
import { SearchParams } from "@/types/userTypes";
import { SelectInput, selectStyles } from "@/components/ui/SelectInput";
import { BsBriefcase } from "react-icons/bs";
import { experience } from "@/utils/selectObjects";
import { GoBriefcase, GoSearch } from "react-icons/go";
import { citySelectStyles, LocationSelect } from "@/helpers/LocationSelect2";
import { Button } from "@/components/ui/Button";
import { CSSObjectWithLabel } from "react-select";
import axios from "axios";
import { encodeSearchParams } from "@/utils/encodeSearchParams";

export default function JobsFeedPage() {
	const [jobs] = useState(jobsData);

	const {
		register,
		control,
		handleSubmit,
	} = useForm<SearchParams>();

    const onSubmit: SubmitHandler<SearchParams> = async (data) => {
		const searchParams = encodeSearchParams(data);
        console.log(data)
		try {
			const url = `/api/jobs/query?${searchParams}`;
			const response = await axios.get(url);
			console.log(response.data);
		} catch (error) {
			throw new Error("Error Completing Search, Try Again!");
		}
	};

	return (
		<div className="flex h-full">
			<div className="flex flex-col w-[70%] pb-20 overflow-y-auto scrollbar-hide">
				<div className="flex items-center justify-center w-full p-5">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col w-full"
					>
						<div className="flex flex-col lg:flex-row items-center gap-2 w-full rounded-xl py-2">
							<div className="flex w-full lg:w-1/3">
								<TextInput
									name="position"
									placeholder="Positions / skills / companies"
									register={register}
									icon={<GoSearch className="h-5 w-5" />}
									className="py-3 bg-white focus:ring-0"
								/>
							</div>

							<div className="flex flex-col md:flex-row gap-2 w-full lg:w-2/3 ">
								<div className="flex w-full items-center md:w-1/2 gap-2 ">
									<SelectInput
										placeholder="Experience"
										name="experience"
										options={experience}
										control={control}
										icon={<GoBriefcase className="h-5 w-5" />}
										styles={{
											...selectStyles,
											control: (base: CSSObjectWithLabel, state: any) => ({
												...selectStyles.control?.(base, state),
												paddingTop: "0.2rem",
												paddingBottom: "0.2rem",
												backgroundColor: "white",
												
											}),
										}}
									/>
								</div>

								<div className="flex w-full md:w-1/2 gap-2 ">
									<LocationSelect
										control={control}
										name="location"
										placeholder="Location"
										styles={{
											...selectStyles,
											control: (base: CSSObjectWithLabel, state: any) => ({
												...citySelectStyles.control?.(base, state),
												paddingTop: "0.2rem",
												paddingBottom: "0.2rem",
												backgroundColor: "white",
												
											}),
										}}
									/>
								</div>
							</div>
						</div>
						<div className="w-full flex justify-end">
							<Button type="submit" className="w-fit rounded-lg">
								Search
							</Button>
						</div>
					</form>
				</div>
				<div className="flex w-full items-start gap-3 pt-10 px-5 ">
					<div className="space-y-4 w-full">
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
						))}
					</div>
					{/* <div className="w-[20%] space-y-4">
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
					</div> */}
				</div>
				{/* <ProfileBanner /> */}
			</div>
			{/* sidebar */}
			<div className="flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
				<FilterSideBar />
			</div>
		</div>
	);
}
