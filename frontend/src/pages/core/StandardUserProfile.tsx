import { MdLocationPin } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa6";
import { HiMiniLanguage } from "react-icons/hi2";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { standardTabsData } from "@/utils/TabsData";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { ProfileCompletion } from "@/components/ui/ProgressBarComponent";
import { AddBasicDetailModal } from "@/modalForms/AddBasicDetailModal";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import NotFound from "@/pages/common/NotFound";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { getMonthYear } from "@/utils/convertTimeStamps";

export default function StandardUserProfile(): React.JSX.Element {
	const [selected, setSelected] = useState(0);

	const [showBasicDetailModal, setShowBasicDetailModal] =
		useState<boolean>(false);
	const { isSignedIn } = useUser();

	const {
		data: userDetails,
		isLoading,
		error,
		refetch: refetchUserDetails,
	} = useFetchUserDetails();

	if (isLoading) {
		return (
			<div className="w-full lg2:w-[70%] h-screen flex items-center justify-center border-r">
				<LoadingBlock size={36} color="#475569" />
			</div>
		);
	}

	if (!userDetails) {
		return <NotFound />;
	}

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide">
				<div className="bg-slate-50 h-32 w-full border-b"></div>
				<div className="flex flex-col items-center w-full px-5 pt-4 pb-6">
					<div className="relative -top-16 mb-2 select-none">
						{userDetails?.user_details?.profilePicture ? (
							<img
								src={userDetails?.user_details?.profilePicture}
								alt="profile"
								className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-md"
							/>
						) : (
							<div className="size-28 border-4 rounded-xl skeleton" />
						)}
					</div>
					<div className="flex flex-col items-center gap-3 w-full -mt-10">
						<div className="flex flex-col items-center sm:flex-row sm:justify-between w-full">
							<div className="flex flex-col items-center sm:items-start">
								<div className="flex items-center gap-2">
									<span className="text-xl font-bold">
										{userDetails?.user_details?.firstname ? (
											<span className="flex items-center gap-1">
												{userDetails?.user_details.firstname}{" "}
												{userDetails?.user_details.lastname}
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
								<span className="text-sm font-light">
									{userDetails ? (
										<>@{userDetails?.user_details?.username}</>
									) : (
										<div className="h-4 w-32 mt-1 skeleton" />
									)}
								</span>
							</div>
							<div className="mt-4 sm:mt-0 select-none">
								{isSignedIn && (
									<>
										<button
											onClick={() => setShowBasicDetailModal(true)}
											className="flex items-center justify-center hover:bg-slate-100 rounded-lg border border-gray-200 gap-2 px-3 py-1 transition-colors"
										>
											<span className="text-sm font-medium text-gray-700">
												Edit
											</span>
											<BiEditAlt className="text-gray-700" />
										</button>
										{showBasicDetailModal && (
											<AddBasicDetailModal
												setShowBasicDetailModal={setShowBasicDetailModal}
												onSave={refetchUserDetails}
											/>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start gap-3 px-5 ">
					<div className="flex items-center flex-wrap text-sm">
						{userDetails ? (
							<span>{userDetails.user_details?.bio}</span>
						) : (
							<div className="flex flex-col">
								<div className="h-5 w-1/2 skeleton" />
								{/* <div className="h-5 w-1/3 skeleton" /> */}
							</div>
						)}
					</div>
					<div className="flex flex-row flex-wrap items-center justify-start gap-5 w-fit">
						<div className="text-sm flex items-center gap-1">
							<MdLocationPin className="w-5 h-5 text-gray-700" />
							{userDetails ? (
								<span>{userDetails?.user_details?.location}</span>
							) : (
								<div className="h-5 w-36 skeleton" />
							)}
						</div>

						<div className="text-sm flex items-center gap-2">
							<FaCalendarCheck className="w-4 h-4 text-gray-700" />
							{userDetails ? (
								<span>
									Joined{" "}
									{getMonthYear(userDetails?.user_details?.createdAt as string)}
								</span>
							) : (
								<div className="h-5 w-36 skeleton" />
							)}
						</div>

						<div className="text-sm flex items-center gap-2 select-none">
							<div className="bg-gray-700 p-[1px] rounded">
								<HiMiniLanguage className="w-[14px] h-[14px] text-white" />
							</div>
							{userDetails ? (
								<>
									{userDetails.linguistics.map((item, index) => (
										<div key={index}>
											<span className="mr-1">{item.language}</span>
											{index < userDetails.linguistics.length - 1 && "|"}
										</div>
									))}
								</>
							) : (
								<div className="h-5 w-36 skeleton" />
							)}
						</div>
					</div>
				</div>
				<nav className="sticky top-0 overflow-hidden z-10 bg-white border-b mt-4 select-none">
					<div className="px-4 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
						{standardTabsData.map((tab, idx) => (
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
					<div>{standardTabsData[selected].content}</div>
				</main>
			</div>
			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4">
				<ProfileCompletion />
			</div>
		</div>
	);
}
