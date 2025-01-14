import NotFound from "@/pages/common/NotFound";
import { BsArrowLeftCircle } from "react-icons/bs";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/FormatDate";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { timesAgo } from "@/utils/DaysAgo";
import { useFetchJobDetails } from "@/hooks/jobs/useFetchJobDetails";
import { useParams } from "react-router-dom";
import {
	LuArrowUpRight,
	LuBriefcase,
	LuCalendar,
	LuCheck,
	LuClock,
	LuMapPin,
} from "react-icons/lu";
import { GoLightBulb } from "react-icons/go";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import { useFetchAppliedJobs } from "@/hooks/jobs/useFetchAppliedJobs";
import { useFetchProfileCompletion } from "@/hooks/profile/useFetchCompletionPercentage";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";
import { SignInMessageDialog } from "@/modal-forms/account/SignInMessageDialog";
import clsx from "clsx";

export const JobDetailsPage: React.FC = () => {
	const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);
	const [isAppliying, setIsAppliying] = useState<boolean>(false);
	const { jobId } = useParams<{ jobId: string }>();
	const { isSignedIn } = useUser();
	const { getToken } = useAuth();

	const { data: progressPercentage } = useFetchProfileCompletion();
	const profilePercentage = progressPercentage?.completion_percentage;

	if (!jobId) {
		return <NotFound />;
	}

	const { data: jobPost, isLoading } = useFetchJobDetails({ jobId });
	const { data: appliedJobs, refetch: refetchAppliedJob } =
		useFetchAppliedJobs();

	if (!jobPost || isLoading) {
		return (
			<div className="w-full lg2:w-[70%] h-screen flex items-center justify-center border-r">
				<LoadingBlock size={36} color="#475569" />
			</div>
		);
	}

	const handleBackClick = () => {
		localStorage.setItem("selectedTab", "1");
		window.history.back();
	};

	const handleJobApplication = async () => {
		if (!isSignedIn) {
			setShowAuthDialog(true);
			return;
		}

		if (profilePercentage !== 100) {
			toast.error("Unable to apply", {
				description: "Complete your profile to apply for jobs",
			});
			return;
		}

		setIsAppliying(true);

		try {
			const token = await getToken();
			if (!token) {
				return "User Unauthorized!";
			}

			const url = `${apiUrl}/api/jobs/apply/${jobPost.jobId}`;
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
			toast.success("Applied Successfully", {
				description:
					jobPost.jobTitle + " at " + jobPost.companyData.companyName,
			});
			refetchAppliedJob();
		} catch (error) {
			console.log(error);
			toast.error("An Error Occured While Applying!");
		}
	};

	const isApplied = appliedJobs?.some(
		(appliedJob) => appliedJob.jobPosting == jobPost.id
	);

	const renderApplyButton = () => {
		if (isApplied) {
			return (
				<Button
					variant="secondary"
					className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 font-semibold text-blue-700 border-2 border-blue-600 rounded-lg w-1/2"
				>
					Applied
					<LuCheck size={18} />
				</Button>
			);
		}

		return (
			<Button
				variant="primary"
				className="flex w-1/2 items-center gap-2 rounded-lg py-2.5"
				onClick={handleJobApplication}
			>
				{isAppliying ? (
					<Spinner size={16} color="#fff" />
				) : isApplied ? (
					"Applied"
				) : (
					<span className="flex items-center gap-2">
						<span>Easy Apply</span>
						<IoPaperPlaneOutline size={18} />
					</span>
				)}
			</Button>
		);
	};

	return (
		<>
			<div className="flex h-full">
				<div
					className={clsx(
						"relative flex mx-auto flex-col w-full lg2:w-[70%] overflow-hidden border-x",
						isSignedIn ? "ml-0 border-l-0" : "ml-14"
					)}
				>
					<div className="sticky top-0 left-0 right-0 z-40 bg-slate-50 px-4 pt-4">
						<div className="flex justify-start items-center mb-4">
							<div className="flex items-center justify-start">
								<button
									onClick={handleBackClick}
									className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
								>
									<BsArrowLeftCircle
										className="text-gray-600 hover:text-gray-800"
										size={24}
									/>
								</button>
								<div className="flex items-center pl-2">
									<h1 className="text-xl font-bold text-gray-800 pr-4 truncate">
										{jobPost.jobTitle}
									</h1>
									<div className="flex items-center gap-2 ">
										<span className="px-2.5 py-1 bg-white rounded-md text-gray-600 text-sm border border-gray-100">
											JobID: {jobPost.jobId}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto scrollbar-hide">
						<div className="p-6 bg-gradient-to-b from-slate-50 to-white">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
								<InfoItem
									icon={<LuClock size={20} />}
									title="Posted"
									text={timesAgo(jobPost.postedDate)}
								/>
								<InfoItem
									icon={<HiOutlineUsers size={20} />}
									title="Openings"
									text={jobPost.openings.toString()}
								/>
								<InfoItem
									icon={<HiOutlineUsers size={20} />}
									title="Applicants"
									text={jobPost.applicants.toString()}
								/>
								<InfoItem
									icon={<LuMapPin size={20} />}
									title="Location"
									text={jobPost.jobLocation}
								/>
								<InfoItem
									icon={<LuBriefcase size={20} />}
									title="Job Type"
									text={jobPost.jobType}
								/>
								<InfoItem
									icon={<LuMapPin size={20} />}
									title="Work Type"
									text={jobPost.workType}
								/>
								<InfoItem
									icon={<LuClock size={20} />}
									title="Experience"
									text={`${jobPost.experience} years`}
								/>
								<InfoItem
									icon={
										<LiaMoneyBillWaveAltSolid size={20} />
									}
									title="Salary"
									text={`${jobPost.currency} ${jobPost.lowestSalary} - ${jobPost.highestSalary}`}
								/>
								<InfoItem
									icon={<LuCalendar size={20} />}
									title="Application Deadline"
									text={formatDate(
										jobPost.applicationDeadline
									)}
								/>
							</div>
						</div>

						{isApplied && (
							<div className="flex items-center mx-3 my-5 p-5 m border border-blue-100 rounded-2xl bg-blue-50">
								<span className="w-12">
									<GoLightBulb className="h-9 w-9 text-blue-600 bg-blue-100 p-2 rounded-full" />
								</span>
								<p className="text-sm text-gray-600 flex items-center flex-wrap">
									To see the status of the application, head
									over to the
									<span className="inline-flex items-center gap-2 px-1.5">
										<IoPaperPlaneOutline className="h-5 w-5" />
										Applications
									</span>
									tab .
								</p>
							</div>
						)}

						<div className="p-6 bg-slate-50">
							<h2 className="text-xl font-semibold mb-4 text-gray-800">
								Required Skills
							</h2>
							<div className="flex flex-wrap gap-3">
								{isLoading
									? [...Array(8)].map((_, index) => (
											<div
												key={index}
												className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
											/>
										))
									: jobPost.requiredSkills.map((skill) => (
											<div
												key={skill.value}
												className="flex items-center justify-center text-sm px-4 py-1.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-gray-300 transition-colors duration-200"
											>
												<img
													src={skill.image}
													alt={skill.label}
													className="w-4 h-4 mr-2"
												/>
												{skill.label}
											</div>
										))}
							</div>
						</div>

						<div className="p-6 bg-white">
							<h2 className="text-xl font-semibold mb-4 text-gray-800">
								Job Description
							</h2>
							<div
								dangerouslySetInnerHTML={{
									__html: jobPost.jobDescription,
								}}
								className="text-gray-700 prose max-w-none"
								style={{ lineHeight: "1.6" }}
							/>
						</div>

						<div className=" sticky bottom-0 flex items-center justify-end bg-white border-t p-3 space-x-4">
							{jobPost.applyWithUs && renderApplyButton()}
							{jobPost.applyLink && (
								<Button
									variant="secondary"
									className="flex w-1/2 items-center gap-2 rounded-lg py-2.5"
									onClick={() =>
										window.open(
											jobPost.applyLink,
											"_blank",
											"noopener,noreferrer"
										)
									}
								>
									Apply
									<LuArrowUpRight size={18} />
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
			{showAuthDialog && (
				<SignInMessageDialog setShowAuthDialog={setShowAuthDialog} />
			)}
		</>
	);
};

const InfoItem: React.FC<{
	icon: React.ReactNode;
	title: string;
	text: string;
}> = ({ icon, title, text }) => (
	<div className="flex items-start p-2.5 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
		<div className="flex items-center justify-center w-8 h-8 bg-slate-50 rounded-full mr-4 mt-1">
			<span className="text-gray-600">{icon}</span>
		</div>
		<div className="flex flex-col">
			<span className="text-sm font-medium text-gray-500 mb-1">
				{title}
			</span>
			<span className="text-gray-800 font-medium">{text}</span>
		</div>
	</div>
);
