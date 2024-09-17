import { MdLocationPin } from "react-icons/md";
import { FaCalendarCheck, FaUserPlus } from "react-icons/fa6";
import { HiMiniLanguage } from "react-icons/hi2";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { standardTabsData } from "@/utils/TabsData";
import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { ProfileCompletion } from "@/components/ui/ProgressBarComponent";
import { AddBasicDetailModal } from "@/modalForms/AddBasicDetailModal";

export default function StandardUserProfile(): React.JSX.Element {
	const [selected, setSelected] = useState(0);
	const [showBasicDetailModal, setShowBasicDetailModal] =
		useState<boolean>(false);
	const { user, isSignedIn } = useUser();
	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide">
				<div className="bg-slate-50 h-32 w-full border-b"></div>
				<div className="flex flex-col items-center w-full px-5 pt-4 pb-6">
					<div className="relative -top-16 mb-2 select-none">
						<img
							src={user?.imageUrl}
							alt="profile"
							className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-md"
						/>
					</div>
					<div className="flex flex-col items-center gap-3 w-full -mt-10">
						<div className="flex flex-col items-center sm:flex-row sm:justify-between w-full">
							<div className="flex flex-col items-center sm:items-start">
								<div className="flex items-center gap-2">
									<span className="text-xl font-bold">Jungle Singh</span>
									<RiVerifiedBadgeFill className="w-5 h-5 text-sky-700" />
								</div>
								<span className="text-sm font-light">@junglesingh</span>
							</div>
							<div className="mt-4 sm:mt-0 select-none">
								{isSignedIn ? (
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
											/>
										)}
									</>
								) : (
									<button className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 hover:shadow rounded-lg border gap-2 px-3 py-2 transition-colors">
										<span className="text-base font-medium text-white">
											Follow
										</span>
										<FaUserPlus className="w-4 h-4 text-white" />
									</button>
								)}
							</div>
						</div>
						{/* <div className="flex items-center justify-center sm:justify-start w-full gap-4 mt-2 select-none">
							<div className="flex items-center gap-1 text-sm font-normal">
								<span className="font-semibold">20</span>
								<span>Following</span>
							</div>
							<div className="flex items-center gap-1 text-sm font-normal">
								<span className="font-semibold">20</span>
								<span>Followers</span>
							</div>
						</div> */}
					</div>
				</div>
				<div className="flex flex-col justify-start gap-3 px-5">
					<div className="flex items-center flex-wrap text-sm">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo ipsa
						porro exercitationem, ex necessitatibus tenetur nulla? Provident
					</div>
					<div className="flex flex-row flex-wrap items-center justify-start gap-5 w-fit">
						<div className="text-sm flex items-center gap-1">
							<MdLocationPin className="w-5 h-5 text-gray-700" />
							<span>Jaipur, India</span>
						</div>
						<div className="text-sm flex items-center gap-2 select-none">
							<FaCalendarCheck className="w-4 h-4 text-gray-700" />
							<span>Joined February 2020</span>
						</div>
						<div className="text-sm flex items-center gap-2 select-none">
							<div className="bg-gray-700 p-[1px] rounded">
								<HiMiniLanguage className="w-[14px] h-[14px] text-white" />
							</div>
							<span>English | Hindi | Japanese</span>
						</div>
					</div>
				</div>
				<nav className="sticky top-0 overflow-hidden z-10 bg-white border-b mt-4 select-none">
					<div className="px-4 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
						{standardTabsData.map((tab, idx) => (
							<button
								key={idx}
								onClick={() => setSelected(idx)}
								className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
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
