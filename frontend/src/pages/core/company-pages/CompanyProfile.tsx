import NotFound from "@/pages/common/NotFound";
import { CompanyTabs } from "@/utils/CompanyTabs";
import { FaCalendarCheck } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { MdLocationPin } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useFetchCompanyProfileByParams } from "@/hooks/company/useFetchCompanyProfileByParams";
import { useState } from "react";
import clsx from "clsx";

export default function CompanyProfile(): React.JSX.Element {
	const [selected, setSelected] = useState(0);

	const { data: companyProfile, isLoading } =
		useFetchCompanyProfileByParams();

	if (isLoading) {
		return (
			<div className="w-full lg2:w-[70%] h-screen flex items-center justify-center border-r">
				<LoadingBlock size={36} color="#475569" />
			</div>
		);
	}

	if (!companyProfile || companyProfile.isDraft) {
		return <NotFound />;
	}

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto border-r scrollbar-hide">
				<div className="w-full">
					{companyProfile && companyProfile.companyBanner ? (
						<img
							src={companyProfile.companyBanner}
							alt="profile"
							className=" sm:rounded-b-xl object-cover aspect-auto "
						/>
					) : (
						<div className="bg-white">
							<div className="h-32 rounded-b-xl border-b" />
						</div>
					)}
				</div>
				<div className="flex flex-col items-center w-full px-5 pt-4 pb-6">
					<div className="relative -top-16 mb-2 select-none bg-white rounded-xl">
						{companyProfile && companyProfile.companyLogo ? (
							<img
								src={companyProfile.companyLogo}
								alt="profile"
								className="h-24 w-24 sm:w-32 sm:h-32 rounded-xl object-cover border-4 border-white shadow-md"
							/>
						) : (
							<div className="size-24 sm:size-32 border-4 rounded-xl skeleton" />
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
								<span>
									Founded {companyProfile.establishedYear}
								</span>
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
								onClick={() =>
									!tab.disabled && setSelected(idx)
								}
								className={clsx(
									"px-2.5 py-1 rounded-md text-sm font-medium transition-colors",
									{
										"bg-slate-800 text-white":
											selected === idx && !tab.disabled,
										"bg-slate-100 text-gray-700 hover:bg-slate-200":
											selected !== idx && !tab.disabled,
										"bg-slate-100 text-gray-400 cursor-not-allowed opacity-70":
											tab.disabled,
									}
								)}
							>
								{tab.title}
							</button>
						))}
					</div>
				</nav>
				<main className="flex-grow w-full">
					<div>{CompanyTabs[selected].content}</div>
				</main>
			</div>
			{/* sidebar */}
			{/* <div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
				
			</div> */}
		</div>
	);
}
