import axios from "axios";
import { Button } from "@/components/ui/Button";
import { FaClock, FaMoneyBill1Wave } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { JobCardProps } from "@/components/layouts/JobPostCard";
import { Link } from "react-router-dom";
import { SavedJobsType } from "@/types/userTypes";
import { timesAgo } from "@/utils/DaysAgo";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useFetchAppliedJobs } from "@/hooks/useFetchAppliedJobs";
import { useFetchSavedJobs } from "@/hooks/useFetchSavedJobs";
import { useState } from "react";

export const JobSearchCard = ({ jobPost }: JobCardProps) => {
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null);
	const [optimisticApplied, setOptimisticApplied] = useState<boolean | null>(
		null
	);

	const { isSignedIn } = useUser();
	const { getToken } = useAuth();

	const {
		data: savedJobs,
		refetch: refetchSavedJob,
		isLoading: isSavedJobLoading,
	} = useFetchSavedJobs();

	const {
		data: appliedJobs,
		refetch: refetchAppliedJob,
		isLoading: isAppliedJobLoading,
	} = useFetchAppliedJobs();

	const handleJobApplication = async () => {
		if (!isSignedIn) {
			setShowLoginModal(true);
			return;
		}
		setOptimisticApplied(true);

		try {
			const token = await getToken();
			if (!token) {
				setOptimisticApplied(false);
				return "User Unauthorized!";
			}
			const url = `/api/jobs/apply/${jobPost.jobId}`;
			await axios.post(
				url,
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			refetchAppliedJob();
			console.log("Job Applied");
		} catch (error) {
			setOptimisticApplied(false);
			console.log(error);
			toast.error("Error Saving Job");
		}
	};

	const handleSaveJob = async () => {
		if (!isSignedIn) {
			setShowLoginModal(true);
			return;
		}

		const isCurrentlySaved = savedJobs?.some(
			(savedJob: SavedJobsType) => savedJob.jobPosting === jobPost.id
		) as boolean;
		setOptimisticSaved(!isCurrentlySaved);

		try {
			const token = await getToken();
			if (!token) {
				return "User Unauthorized!";
			}
			const url = `/api/jobs/save/${jobPost.jobId}`;
			await axios.post(
				url,
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			refetchSavedJob();
		} catch (error) {
			setOptimisticSaved(isCurrentlySaved);
			console.log(error);
			toast.error("Error Saving Job");
		}
	};

	const isSaved =
		optimisticSaved !== null
			? optimisticSaved
			: savedJobs &&
				savedJobs.some((savedJob) => savedJob.jobPosting === jobPost.id);

	const isApplied =
		optimisticApplied !== null
			? optimisticApplied
			: appliedJobs?.some((appliedJob) => appliedJob.jobPosting === jobPost.id);

	const renderApplyButton = () => {
		if (isAppliedJobLoading) {
			return <div className="h-10 w-32 skeleton" />;
		}

		if (isApplied) {
			return (
				<Button
					variant="secondary"
					className="bg-sky-100 hover:bg-sky-200 font-semibold text-blue-700 border border-blue-600 rounded-lg w-1/2 md:w-fit"
				>
					Applied
				</Button>
			);
		}

		return (
			<Button
				variant="primary"
				className="rounded-lg w-1/2 md:w-fit whitespace-nowrap"
				onClick={handleJobApplication}
			>
				Easy Apply
			</Button>
		);
	};

	return (
		<div
			key={jobPost.id}
			className="bg-white border rounded-xl overflow-hidden"
		>
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
							<img
								src={jobPost.companyData.companyLogo}
								alt={`${jobPost.companyData} logo`}
								className="w-full h-full object-cover border rounded-xl"
							/>
						</div>
						<div>
							<Link
								to={`/company/${jobPost.companyData.companyName.toLowerCase()}/job/${jobPost.jobId.toLowerCase()}`}
							>
								<h2 className="text-xl font-semibold text-gray-800 hover:underline decoration-gray-800 decoration-1 transition-all duration-1000">
									{jobPost.jobTitle}
								</h2>
							</Link>
							<Link
								to={`/company/${jobPost.companyData.companyName.toLowerCase()}`}
							>
								<p className="text-gray-600 hover:underline decoration-gray-600  decoration-1 transition-all duration-1000">
									{jobPost.companyData.companyName}
								</p>
							</Link>
						</div>
					</div>
					<button
						onClick={handleSaveJob}
						className="text-zinc-800 hover:text-zinc-800 transition-colors duration-300"
					>
						{isSavedJobLoading ? (
							<div className="size-8 skeleton" />
						) : isSaved ? (
							<GoBookmarkFill className="w-6 h-6" />
						) : (
							<GoBookmark className="w-6 h-6" />
						)}
					</button>
				</div>
				<div className="mt-4">
					<p
						className="text-gray-800 line-clamp-2 text-sm"
						dangerouslySetInnerHTML={{
							__html:
								jobPost.jobDescription.split(" ").slice(0, 10).join(" ") +
								(jobPost.jobDescription.split(" ").length > 10 ? "..." : ""),
						}}
					></p>
				</div>
				<div className="mt-2 flex flex-col gap-2 md:flex-row justify-between text-sm text-gray-500">
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<div className="flex items-center gap-4">
								<span className="text-sm text-gray-800 px-2 py-0.5 border border-gray-300 bg-slate-50 rounded-full">
									{jobPost.jobType}
								</span>
								<span className="text-sm text-gray-800 px-2 py-0.5 border border-gray-300 bg-slate-50 rounded-full">
									{jobPost.workType}
								</span>
							</div>
						</div>
						<div className="flex md:flex-col gap-5 md:gap-2">
							<div className="flex items-center space-x-2">
								<FaMapMarkerAlt className="w-4 h-4" />
								<span className="text-sm text-gray-800">
									{jobPost.jobLocation}
								</span>
							</div>

							<div className="flex items-center space-x-2">
								<FaMoneyBill1Wave className="w-4 h-4" />
								<span className="text-sm text-gray-800">
									{jobPost.currency +
										" " +
										jobPost.lowestSalary +
										" - " +
										jobPost.highestSalary}
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-start md:items-end gap-5 md:gap-2 justify-between">
						<div className="flex items-center space-x-2">
							<FaClock className="w-4 h-4" />
							<span className="text-sm text-gray-800">
								Posted {timesAgo(jobPost.postedDate)}
							</span>
						</div>
						<div className="space-x-2 flex justify-end w-full">
							{jobPost.applyLink && (
								<Button
									variant="secondary"
									className="rounded-lg w-1/2 md:w-fit"
									onClick={() => window.open(jobPost.applyLink, "_blank")}
								>
									Apply
									<HiMiniArrowUpRight className="size-5" />
								</Button>
							)}
							{jobPost.applyWithUs && renderApplyButton()}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
