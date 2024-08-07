import { useUser } from "@clerk/clerk-react";

import { FaChevronRight } from "react-icons/fa6";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from "axios";
import { Footer } from "@/components/common/Footer";
import { Link } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import { useCitySearch } from "@/hooks/useCitySearch";

import { companyLogo, recentJobs } from "@/utils/dummyData";
import { jobCardSettings, logoSettings } from "@/utils/carouselSettings";

import { JobCard } from "@/components/layouts/JobCard";
import { SearchHeader } from "./components/layout/SearchHeader";
import { JobCategories } from "@/components/common/JobCategory";
import { JobSearchForm } from "@/components/layouts/JobSearchBar";
import { ProfileBanner } from "@/components/layouts/ProfileBanner";

interface FormData {
	position: string;
	experience: string | null;
	location: string | null;
}
export default function HomeFeed(): JSX.Element {
	const { isSignedIn, user } = useUser();

	const {
		isLoading,
		error,
		cityOptions,
		handleInputChange,
		formatOptionLabel,
		handleSelection,
	} = useCitySearch();

	const handleSearch: SubmitHandler<FormData> = async (data) => {
		const searchParams = new URLSearchParams({
			position: data.position !== null ? data.position : "",
			experience: data.experience !== null ? data.experience : "",
			location: data.location !== null ? data.location : "",
		}).toString();
		try {
			const url = `/api/job-search?${searchParams}`;
			const response = await axios.get(url);
			console.log(response.data);
		} catch (error) {
			throw new Error("Error Completing Search, Try Again!");
		}
	};

	return (
		<main className="scroll-smooth">
			<section className="mt-16 p-10 w-full pb-80 md:pb-32">
				<div className="h-64 max-w-6xl mx-auto">
					<SearchHeader />
					<JobSearchForm
						onSubmit={handleSearch}
						isLoading={isLoading}
						cityOptions={cityOptions}
						handleInputChange={handleInputChange}
						handleSelection={handleSelection}
						formatOptionLabel={formatOptionLabel}
						error={error}
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
			<Footer />
		</main>
	);
}
