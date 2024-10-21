import { useUser } from "@clerk/clerk-react";
import { HiPlus } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { BiBriefcase, BiSort } from "react-icons/bi";
import { JobPostCard } from "@/components/layouts/JobPostCard";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobCardSkeleton } from "../../components/ui/JobCardSkeleton";

export const Opportunities = () => {
	const { isSignedIn, user } = useUser();

	const { data: jobPosts, isLoading } = useFetchJobPosts();

	return (
		<div className="flex flex-col p-5">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2">
						<button className="inline-flex justify-center items-center gap-2 w-40 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
							<BiBriefcase className="size-5" />
							Jobs Posted: {jobPosts?.length}
						</button>
					</div>
					<div className="flex items-center gap-2">
						<Link to="#">
							<button className="inline-flex justify-center items-center gap-2 w-24 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
								<BiSort className="size-5" />
								Sort
							</button>
						</Link>
						<Link to="post-job">
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
					jobPosts.map((jobPost) => (
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
