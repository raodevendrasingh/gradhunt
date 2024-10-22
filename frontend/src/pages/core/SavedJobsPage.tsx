import { useFetchSavedJobs } from "@/hooks/useFetchSavedJobs";
import { GoBookmark } from "react-icons/go";
import { JobCardSkeleton } from "./components/ui/JobCardSkeleton2";
import { useFetchJobsList } from "@/hooks/useFetchJobsList";
import { JobSearchCard } from "./components/layout/JobSearchCard";

export default function SavedJobsPage() {
	const { data: savedJobs, isLoading: isLoadingSaved } = useFetchSavedJobs();
	const { data: jobPosts, isLoading: isLoadingJobs } = useFetchJobsList();

	const isLoading = isLoadingSaved || isLoadingJobs;

	const savedJobPosts = jobPosts?.filter((jobPost) =>
		savedJobs?.some((savedJob) => savedJob.jobPosting === jobPost.id)
	);

	const renderContent = () => {
		if (isLoading) {
			return <JobCardSkeleton />;
		}
		if (!savedJobs?.length) {
			<div className="relative h-full">
				<div className="flex flex-col items-center justify-center gap-2 h-full select-none">
					<GoBookmark className="w-16 h-16 text-gray-500" />
					<h2 className="text-2xl font-semibold text-gray-600 mb-2">
						No saved jobs yet
					</h2>
					<p className="text-gray-500">Start saving jobs to see them here!</p>
				</div>
			</div>;
		}
		return (
			<div className="space-y-4">
				{savedJobPosts?.map((jobPost) => (
					<JobSearchCard key={jobPost.id} jobPost={jobPost} />
				))}
			</div>
		);
	};

	return (
		<div className="flex h-full">
			<div className="w-full lg:w-[70%] overflow-y-auto border-r scrollbar-hide p-5">
				{renderContent()}
			</div>
		</div>
	);
}
