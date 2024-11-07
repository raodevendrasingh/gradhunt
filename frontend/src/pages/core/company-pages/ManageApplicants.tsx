import { JobApplicantCard } from "@/components/layouts/JobApplicantCard";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { JobApplicationCardSkeleton2 } from "@/pages/core/components/ui/JobApplicationCardSkeleton2";
import { IoPaperPlaneOutline } from "react-icons/io5";

export default function ManageApplicants() {
	const { data: jobPosts, isLoading } = useFetchJobPosts();

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="flex flex-col gap-5">
					<JobApplicationCardSkeleton2 />
					<JobApplicationCardSkeleton2 />
					<JobApplicationCardSkeleton2 />
				</div>
			);
		}

		if (!jobPosts?.length) {
			return (
				<div className="relative h-full">
					<div className="flex flex-col items-center justify-center gap-2 h-full select-none">
						<IoPaperPlaneOutline className="w-16 h-16 text-gray-500" />
						<h2 className="text-2xl font-semibold text-gray-600 mb-2">
							No Jobs Posted Yet
						</h2>
						<p className="text-gray-500">
							Create Job Posts to manage applicants here!
						</p>
					</div>
				</div>
			);
		}
		return (
			<div className="space-y-4">
				{jobPosts
					.filter((jobPost) => !jobPost.isArchived)
					.map((jobPost) => (
						<JobApplicantCard key={jobPost.id} jobPost={jobPost} />
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
