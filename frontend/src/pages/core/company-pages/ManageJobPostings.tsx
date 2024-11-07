import { useUser } from "@clerk/clerk-react";
import { HiPlus } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { BiBriefcase } from "react-icons/bi";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobCardSkeleton } from "@/pages/core/components/ui/JobCardSkeleton";
import { ManageJobCard } from "@/components/layouts/ManageJobCard";

export default function ManageJobPost() {
	const { isSignedIn } = useUser();

	const { data: jobPosts, isLoading } = useFetchJobPosts();
	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide border-r p-5">
				{isSignedIn && (
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<button className="inline-flex justify-center items-center gap-2 w-40 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
								<BiBriefcase className="size-5" />
								<span>Jobs Posted: </span>
								{jobPosts?.filter((jobPost) => !jobPost.isArchived).length}{" "}
							</button>
						</div>
						<div className="flex items-center gap-2">
							<Link to="post">
								<button className="inline-flex justify-center items-center gap-2 w-28 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
									Post Job
									<HiPlus className="size-5" />
								</button>
							</Link>
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
						jobPosts
							.filter((jobPost) => !jobPost.isArchived)
							.map((jobPost) => (
								<ManageJobCard key={jobPost.id} jobPost={jobPost} />
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
		</div>
	);
}
