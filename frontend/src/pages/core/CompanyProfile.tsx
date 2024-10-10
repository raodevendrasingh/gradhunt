import { MdLocationPin } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import NotFound from "@/pages/common/NotFound";
import { GoPlus } from "react-icons/go";
import { useFetchCompanyProfile } from "@/hooks/useFetchCompanyProfile";
import { CompanyTabs } from "@/utils/CompanyTabs";
import { Link } from "react-router-dom";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { FaCalendarCheck } from "react-icons/fa6";

export default function CompanyProfile(): React.JSX.Element {
	const [selected, setSelected] = useState(0);

	const { isSignedIn, user } = useUser();

	const {
		data: companyProfile,
		isLoading,
		error,
		refetch,
	} = useFetchCompanyProfile();

	const { data: currentUser } = useFetchUserDetails();

	if (isLoading) {
		return (
			<div className="w-full lg2:w-[70%] h-screen flex items-center justify-center border-r">
				<LoadingBlock size={36} color="#475569" />
			</div>
		);
	}

	if (!companyProfile) {
		return <NotFound />;
	}

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide">
				<div className="bg-slate-50 w-full">
					{companyProfile && companyProfile.companyBanner ? (
						<img
							src={companyProfile.companyBanner}
							alt="profile"
							className="rounded-b-xl object-cover aspect-auto "
						/>
					) : (
						<div className="size-32 border-4 rounded-xl skeleton" />
					)}
				</div>
				<div className="flex flex-col items-center w-full px-5 pt-4 pb-6">
					<div className="relative -top-16 mb-2 select-none">
						{companyProfile && companyProfile.companyLogo ? (
							<img
								src={companyProfile.companyLogo}
								alt="profile"
								className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-md"
							/>
						) : (
							<div className="size-32 border-4 rounded-xl skeleton" />
						)}
					</div>
					<div className="flex flex-col items-center gap-3 w-full -mt-10">
						<div className="flex flex-col items-center sm:flex-row sm:justify-between w-full">
							<div className="flex flex-col items-center sm:items-start">
								<div className="flex items-center gap-2">
									<span className="text-xl font-bold">
										{companyProfile?.companyName ? (
											<span className="flex items-center gap-1">
												{companyProfile?.companyName}
												<RiVerifiedBadgeFill className="w-5 h-5 text-sky-700" />
											</span>
										) : (
											<div className="flex items-center gap-2">
												<div className="w-44 h-7 skeleton" />
												<div className="size-7 skeleton" />
											</div>
										)}
									</span>
								</div>
							</div>
							<div className="mt-4 sm:mt-0 select-none">
								{isSignedIn &&
									currentUser &&
									user?.username === currentUser.user_details.username && (
										<Link to="/edit-company-profile">
											<button className="flex items-center justify-center hover:bg-slate-100 rounded-lg border border-gray-200 gap-2 px-3 py-1 transition-colors">
												<span className="text-sm font-medium text-gray-700">
													Edit
												</span>
												<BiEditAlt className="text-gray-700" />
											</button>
										</Link>
									)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start gap-3 px-5 ">
					<div className="flex items-center flex-wrap text-sm">
						{companyProfile ? (
							<span>{companyProfile.tagline}</span>
						) : (
							<div className="flex items-center gap-1 bg-slate-50 text-slate-700 rounded-lg px-2 py-0.5 w-52 cursor-pointer">
								<GoPlus className="size-5" />
								<p> Add Tagline</p>
							</div>
						)}
					</div>
					<div className="flex flex-row flex-wrap items-center justify-start gap-5 w-fit">
						<div className="text-sm flex items-center gap-1">
							<MdLocationPin className="w-5 h-5 text-gray-700" />
							{companyProfile ? (
								<span>{companyProfile?.headquarters}</span>
							) : (
								<div className="flex items-center gap-1 bg-slate-50 text-slate-700 rounded-lg px-2 py-0.5 w-48 cursor-pointer">
									<GoPlus className="size-5" />
									<p> Add Headqaurters</p>
								</div>
							)}
						</div>

						<div className="text-sm flex items-center gap-2">
							<FaCalendarCheck className="w-4 h-4 text-gray-700" />
							{companyProfile ? (
								<span>Founded {companyProfile.establishedYear}</span>
							) : (
								<div className="h-5 w-36 skeleton" />
							)}
						</div>
					</div>
				</div>
				<nav className="sticky top-0 overflow-hidden z-10 bg-white border-b mt-4 select-none">
					<div className="px-4 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
						{CompanyTabs.map((tab, idx) => (
							<button
								key={idx}
								onClick={() => setSelected(idx)}
								className={`px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
									selected === idx
										? "bg-slate-800 text-white"
										: "bg-slate-100 text-gray-700 hover:bg-slate-200"
								}`}
							>
								{tab.title}
							</button>
						))}
					</div>
				</nav>
				<main className="flex-grow w-full p-5">
					<div>{CompanyTabs[selected].content}</div>
				</main>
			</div>
			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
				analytics
			</div>
		</div>
	);
}
