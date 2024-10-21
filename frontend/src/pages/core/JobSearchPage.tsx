import { FaChevronRight } from "react-icons/fa6";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import { useCitySearch } from "@/hooks/useCitySearch";

import { companyLogo, recentJobs } from "@/utils/dummyData";
import { jobCardSettings, logoSettings } from "@/utils/carouselSettings";

import { JobCard } from "@/components/layouts/JobCard";
import { SearchHeader } from "./components/layout/SearchHeader";
import { JobCategories } from "@/components/common/JobCategory";
import { JobSearchForm } from "@/components/layouts/JobSearchBar";
import { ProfileBanner } from "@/components/layouts/ProfileBanner";
import { FormData } from "@/components/layouts/JobSearchBar";
import React from "react";
import { encodeSearchParams } from "@/utils/encodeSearchParams";
import HomeNavbar from "./components/layout/HomeNavbar";

export default function JobSearchPage(): React.JSX.Element {
	const {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
	} = useCitySearch();

	const navigate = useNavigate();

	const handleSearch: SubmitHandler<FormData> = async (data) => {
		const searchParams = encodeSearchParams(data);
		try {
			navigate(`/job-search/query?${searchParams}`);
			const url = `/api/jobs/query?${searchParams}`;
			await axios.get(url);
		} catch (error) {
			throw new Error("Error Completing Search, Try Again!");
		}
	};

	return (
		<>
			<HomeNavbar />
			<main className="max-w-screen-2xl mx-auto overflow-hidden scroll-smooth">
				<section className="p-10 w-full pb-20">
					<div className="max-w-6xl mx-auto">
						<SearchHeader />
						<JobSearchForm
							onSubmit={handleSearch}
							isLoading={isLoading}
							cityOptions={cityOptions}
							handleInputChange={handleInputChange}
							formatOptionLabel={formatOptionLabel}
							error={error || undefined}
						/>
					</div>
				</section>
				<section className="rounded-t-[40px] border-t h-auto w-full bg-gray-50">
					{/* logo carousel */}
					<div className="px-14 pt-10">
						<Slider {...logoSettings}>
							{companyLogo.map((logo) => (
								<div
									key={logo.company}
									className="flex justify-center items-center h-32 w-44 text-xl font-bold text-gray-600"
								>
									{logo.company}
								</div>
							))}
						</Slider>
					</div>

					<JobCategories />

					<div className="flex flex-col justify-center w-full max-w-xs sm:max-w-2xl lg:max-w-5xl mx-auto py-10">
						<div className="text-2xl font-semibold text-zinc-800 text-center pb-10">
							Recently Posted Jobs
						</div>
						<Slider {...jobCardSettings}>
							{recentJobs.map((job) => (
								<JobCard key={job.jobId} job={job} />
							))}
						</Slider>

						<div className="flex justify-center items-center max-w-6xl mx-auto pt-10">
							<Link to="#">
								<button className="px-4 py-3 flex justify-center items-center gap-3 text-zinc-800 rounded-full border border-zinc-800">
									<span>Explore All Jobs</span>
									<span>
										<FaChevronRight className="size-3" />
									</span>
								</button>
							</Link>
						</div>
					</div>

					<ProfileBanner />
				</section>
			</main>
		</>
	);
}
