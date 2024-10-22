import { JobPostCard } from "@/components/layouts/JobPostCard";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobCardSkeleton } from "@/pages/core//components/ui/JobCardSkeleton";

export const Opportunities = () => {
	const { data: jobPosts, isLoading } = useFetchJobPosts();

	return (
		<div className="flex flex-col p-5">
			<div className="w-full">
				{isLoading ? (
					<>
						<JobCardSkeleton />
						<JobCardSkeleton />
						<JobCardSkeleton />
					</>
				) : jobPosts && jobPosts.length > 0 ? (
					jobPosts
						.filter((jobPost) => !jobPost.isArchived)
						.map((jobPost) => (
							<JobPostCard key={jobPost.id} jobPost={jobPost} />
						))
				) : (
					<div className="w-full min-h-64">
						<div className="border rounded-2xl p-5 flex items-center justify-center">
							<h1 className="text-lg font-semibold text-gray-600">
								No Job Opportunities Open Yet
							</h1>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
