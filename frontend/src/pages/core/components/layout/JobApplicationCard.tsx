import { JobCardProps } from "@/components/layouts/JobPostCard";
import { Link } from "react-router-dom";
import { timesAgo } from "@/utils/DaysAgo";
import { useUser } from "@clerk/clerk-react";
import { useFetchAppliedJobs } from "@/hooks/useFetchAppliedJobs";
import NotFound from "@/pages/common/NotFound";
import { formatLocation } from "../../company-pages/JobApplicants";
import { LuDot } from "react-icons/lu";

export const JobApplicationCard = ({ jobPost }: JobCardProps) => {
	const { isSignedIn } = useUser();

	if (!isSignedIn) {
		return <NotFound />;
	}

	const { data: appliedJobs } = useFetchAppliedJobs();

	const renderStatus = () => {
		if (appliedJobs) {
			const currentApplication = appliedJobs.find(
				(appliedJob) => appliedJob.jobPosting === jobPost.id
			);

			if (currentApplication) {
				switch (currentApplication.status) {
					case "applied":
						return (
							<p className="text-sm font-medium text-slate-600">Applied</p>
						);
					case "shortlisted":
						return (
							<p className="text-sm font-medium text-orange-500">Shortlisted</p>
						);
					case "interviewScheduled":
						return (
							<p className="text-sm font-medium text-blue-600">
								Scheduled for Interview
							</p>
						);
					case "matched":
						return (
							<p className="text-sm font-medium text-green-500">Matched 🎉</p>
						);
					case "rejected":
						return (
							<p className="text-sm font-medium text-gray-600">Not Moving Forward</p>
						);
					default:
						return null;
				}
			}
		}
		return null;
	};

	return (
		<div
			key={jobPost.id}
			className="border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white"
		>
			<div className="p-6">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 bg-gray-100 rounded-xl border flex-shrink-0 overflow-hidden">
							<img
								src={jobPost.companyData.companyLogo}
								alt={`${jobPost.companyData} logo`}
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<Link
								to={`/company/${jobPost.companyData.companyName.toLowerCase()}/job/${jobPost.jobId.toLowerCase()}`}
							>
								<h2 className="text-lg font-bold text-gray-800 hover:text-gray-600 transition-colors duration-300">
									{jobPost.jobTitle}
								</h2>
							</Link>
							<Link
								to={`/company/${jobPost.companyData.companyName.toLowerCase()}`}
							>
								<p className="text-gray-600 hover:text-gray-500 transition-colors duration-300">
									{jobPost.companyData.companyName}
								</p>
							</Link>
						</div>
					</div>
					<div className="hidden xs:flex h-full flex-col sm:flex-row sm:gap-0 sm:items-center">
						<div className="flex items-center text-sm text-neutral-600">
							<span className="text-neutral-500 mr-1">Posted</span>
							{jobPost ? (
								<span>{timesAgo(jobPost.postedDate)}</span>
							) : (
								<div className="h-4 w-20 skeleton" />
							)}
						</div>
						<LuDot className=" hidden sm:flex size-8 text-slate-600" />
						<div className="flex items-center text-sm text-neutral-600">
							<span className="text-neutral-500 mr-1">Applied</span>
							{jobPost ? (
								appliedJobs &&
								appliedJobs
									.filter((job) => job.jobPosting === jobPost.id)
									.map((job) => (
										<span key={job.id} className="">
											{timesAgo(job.appliedDate)}
										</span>
									))
							) : (
								<div className="h-4 w-20 skeleton" />
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center">
					{jobPost ? (
						<div className="flex justify-start w-full flex-col xs:flex-row xs:items-center ">
							<div className="flex items-center">
								<span className="text-sm text-neutral-600">
									{jobPost.jobType}
								</span>
								<LuDot className="flex sm:size-8 text-slate-600" />
								<span className="text-sm text-neutral-600">
									{jobPost.workType}
								</span>
							</div>
							<LuDot className=" hidden xs:flex size-8 text-slate-600" />
							<span className="text-sm text-neutral-600">
								{formatLocation(jobPost.jobLocation)}
							</span>
						</div>
					) : (
						<div className="flex justify-start gap-2 w-full flex-col sm:flex-row sm:items-center ">
							<span className="h-4 w-20 skeleton" />
							<span className="h-4 w-20 skeleton" />
							<span className="h-4 w-20 skeleton" />
						</div>
					)}
				</div>
				<div className="flex text-sm text-gray-600">
					<div className="flex items-center gap-1.5 xs:mt-0 mt-1 w-full">
						<span>Status: </span>
						<span>{renderStatus()}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
