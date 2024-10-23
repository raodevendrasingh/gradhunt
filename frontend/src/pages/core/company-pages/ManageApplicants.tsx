import { JobApplicantCard } from "@/components/layouts/JobApplicantCard";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobCardSkeleton } from "../components/ui/JobCardSkeleton2";

export default function ManageApplicants() {
	const { data: jobPosts, isLoading } = useFetchJobPosts();

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto border-r scrollbar-hide p-5">
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
								<JobApplicantCard key={jobPost.id} jobPost={jobPost} />
							))
					) : (
						<div className="w-full min-h-64">
							<div className="border rounded-2xl p-5 flex items-center justify-center">
								<h1 className="text-lg font-semibold text-gray-600">
									No Job Posted Yet
								</h1>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
