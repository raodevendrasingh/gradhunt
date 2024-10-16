import { useFetchSavedJobs } from "@/hooks/useFetchSavedJobs";
import { GoBookmark } from "react-icons/go";
import { JobCardSkeleton } from "./components/ui/JobCardSkeleton2";
import { useFetchJobsList } from "@/hooks/useFetchJobsList";
import { JobSearchCard } from "./components/layout/JobSearchCard";

export default function SavedJobsPage() {
	const { data: savedJobs, isLoading } = useFetchSavedJobs();
	const { data: jobPosts } = useFetchJobsList();

	const savedJobPosts = jobPosts?.filter((jobPost) =>
		savedJobs?.some((savedJob) => savedJob.jobPosting === jobPost.id)
	);

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				{isLoading ? (
					<JobCardSkeleton />
				) : savedJobs && savedJobs.length > 0 ? (
					<div className="space-y-4">
						{savedJobPosts?.map((jobPost) => (
							<JobSearchCard key={jobPost.id} jobPost={jobPost} />
						))}
					</div>
				) : savedJobs && savedJobs.length == 0 ? (
					<div className="relative h-full">
						<div className="flex flex-col items-center justify-center gap-2 h-full select-none">
							<GoBookmark className="w-16 h-16 text-gray-500" />
							<h2 className="text-2xl font-semibold text-gray-600 mb-2">
								No saved jobs yet
							</h2>
							<p className="text-gray-500">
								Start saving jobs to see them here!
							</p>
						</div>
					</div>
				) : null}
			</div>
			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4"></div>
		</div>
	);
}
