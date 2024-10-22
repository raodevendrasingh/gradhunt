import { useFetchAppliedJobs } from "@/hooks/useFetchAppliedJobs";
import { useFetchJobsList } from "@/hooks/useFetchJobsList";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { JobSearchCard } from "./components/layout/JobSearchCard";
import { JobCardSkeleton } from "./components/ui/JobCardSkeleton2";

export default function JobApplicationsPage() {
	const { data: appliedJobs, isLoading: isLoadingApplied } =
		useFetchAppliedJobs();
	const { data: jobPosts, isLoading: isLoadingJobs } = useFetchJobsList();

	const isLoading = isLoadingApplied || isLoadingJobs;

	const appliedJobPosts = jobPosts?.filter((jobPost) =>
		appliedJobs?.some((appliedJob) => appliedJob.jobPosting === jobPost.id)
	);

	const renderContent = () => {
		if (isLoading) {
			return <JobCardSkeleton />;
		}

		if (!appliedJobs?.length) {
			return (
				<div className="relative h-full">
					<div className="flex flex-col items-center justify-center gap-2 h-full select-none">
						<IoPaperPlaneOutline className="w-16 h-16 text-gray-500" />
						<h2 className="text-2xl font-semibold text-gray-600 mb-2">
							No applied jobs yet
						</h2>
						<p className="text-gray-500">
							Start applying to jobs to see them here!
						</p>
					</div>
				</div>
			);
		}
		return (
			<div className="space-y-4">
				{appliedJobPosts?.map((jobPost) => (
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
