import { useUser } from "@clerk/clerk-react";
import { BiBriefcase } from "react-icons/bi";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobCardSkeleton } from "@/pages/core/components/ui/JobCardSkeleton";
import { ManageJobCard } from "@/components/layouts/ManageJobCard";
import { GoArchive } from "react-icons/go";

export default function ArchivedPostings() {
	const { isSignedIn } = useUser();
	const { data: jobPosts, isLoading } = useFetchJobPosts();

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-5">
					<JobCardSkeleton />
					<JobCardSkeleton />
					<JobCardSkeleton />
				</div>
			);
		}

		if (!jobPosts?.length) {
			return (
				<div className="relative h-full">
					<div className="flex flex-col items-center justify-center gap-2 h-full select-none">
						<GoArchive className="w-16 h-16 text-gray-500" />
						<h2 className="text-2xl font-semibold text-gray-600 mb-2">
							No Archived Job Posts
						</h2>
						<p className="text-gray-500">
							Archived Job Posts will appear here!
						</p>
					</div>
				</div>
			);
		}
		return (
			<div className="space-y-4">
				{jobPosts
					.filter((jobPost) => jobPost.isArchived)
					.map((jobPost) => (
						<ManageJobCard key={jobPost.id} jobPost={jobPost} />
					))}
			</div>
		);
	};

	return (
		<div className="flex h-full">
			<div className="w-full lg:w-[70%] overflow-y-auto border-r scrollbar-hide p-5">
				{isSignedIn && (
					<div className="flex justify-start items-center pb-3">
						<div className="flex items-center gap-2">
							<button className="inline-flex justify-center items-center gap-2 w-44 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0">
								<BiBriefcase className="size-5" />
								<span>Archived Jobs: </span>
								{jobPosts?.filter((jobPost) => jobPost.isArchived).length}
							</button>
						</div>
					</div>
				)}
				{renderContent()}
			</div>
		</div>
	);
}
