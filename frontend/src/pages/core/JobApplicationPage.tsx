import { useFetchAppliedJobs } from "@/hooks/useFetchAppliedJobs";
import { useFetchJobsList } from "@/hooks/useFetchJobsList";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { JobSearchCard } from "./components/layout/JobSearchCard";
import { JobCardSkeleton } from "./components/ui/JobCardSkeleton2";

export default function JobApplicationsPage() {
	const { data: appliedJobs, isLoading } = useFetchAppliedJobs();
	const { data: jobPosts } = useFetchJobsList();

	const appliedJobPosts = jobPosts?.filter((jobPost) =>
		appliedJobs?.some((appliedJob) => appliedJob.jobPosting === jobPost.id)
	);

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				{isLoading ? (
					<JobCardSkeleton />
				) : appliedJobs && appliedJobs.length > 0 ? (
					<div className="space-y-4">
						{appliedJobPosts?.map((jobPost) => (
							<JobSearchCard key={jobPost.id} jobPost={jobPost} />
						))}
					</div>
				) : appliedJobs && appliedJobs.length == 0 ? (
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
				) : null}
			</div>
			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4"></div>
		</div>
	);
}
