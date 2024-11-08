import { useUser } from "@clerk/clerk-react";
import { BiBriefcase } from "react-icons/bi";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobCardSkeleton } from "@/pages/core/components/ui/JobCardSkeleton";
import { ManageJobCard } from "@/components/layouts/ManageJobCard";

export default function ArchivedPostings() {
	const { isSignedIn } = useUser();
	const { data: jobPosts, isLoading } = useFetchJobPosts();

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide border-r p-4">
				{isSignedIn && (
					<div className="flex justify-start items-center">
						<div className="flex items-center gap-2">
							<button className="inline-flex justify-center items-center gap-2 w-44 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
								<BiBriefcase className="size-5" />
								<span>Archived Jobs: </span>
								{jobPosts?.filter((jobPost) => jobPost.isArchived).length}
							</button>
						</div>
					</div>
				)}
				<div className="w-full mt-3">
					{isLoading ? (
						<>
							<JobCardSkeleton />
							<JobCardSkeleton />
							<JobCardSkeleton />
						</>
					) : jobPosts && jobPosts.length > 0 ? (
						jobPosts.filter((jobPost) => jobPost.isArchived).length > 0 ? (
							jobPosts
								.filter((jobPost) => jobPost.isArchived)
								.map((jobPost) => (
									<ManageJobCard key={jobPost.id} jobPost={jobPost} />
								))
						) : (
							<div className="w-full min-h-64">
								<div className="border rounded-2xl p-5 flex items-center justify-center">
									<h1 className="text-lg font-semibold text-gray-600">
										No Archived Job Posts
									</h1>
								</div>
							</div>
						)
					) : null}
				</div>
			</div>
		</div>
	);
}
