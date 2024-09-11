import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import clsx from "clsx";

import {
	FaDev,
	FaMedium,
	FaDribbble,
	FaHashnode,
	FaYoutube,
	FaUserCheck,
	FaLinkedinIn,
	FaGithub,
	FaXTwitter,
} from "react-icons/fa6";
import {
	HiOutlinePlusCircle,
	HiOutlinePlus,
	HiOutlineCamera,
	HiMiniLanguage,
	HiShare,
} from "react-icons/hi2";
import { HiLockClosed } from "react-icons/hi";
import { PiConfettiFill } from "react-icons/pi";
import { SiLeetcode, SiGmail } from "react-icons/si";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdOutlineEdit, MdLocationPin } from "react-icons/md";

import { Chip } from "./components/ui/Chips";

import { Overview } from "./profile/Overview";
import { AppliedJobs } from "./profile/AppliedJobs";
import { SavedJobs } from "./profile/SavedJobs";
import { Analytics } from "./profile/Analytics";
import { Posts } from "./profile/Posts";

// assets
import noUser from "@/assets/avatar/noUser.png";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CardStack } from "./components/ui/CardStack";
import { Featured } from "./profile/Featured";
import { AddBasicDetailModal } from "@/modalForms/AddBasicDetailModal";
import { EditImageModal } from "@/modalForms/ImageEditModal";

const tabsData = [
	{
		title: "Overview",
		content: <Overview />,
	},
	{
		title: "Featured",
		content: <Featured />,
	},
	{
		title: "Jobs Applied",
		content: <AppliedJobs />,
	},
	{
		title: "Saved Jobs",
		content: <SavedJobs />,
	},
	{
		title: "Posts",
		content: <Posts />,
	},
	{
		title: "Analytics",
		content: <Analytics />,
	},
];

export default function UserProfile(): JSX.Element {
	const [selected, setSelected] = useState(0);
	const [isDisabled, setIsDisabled] = useState(true);
	const [showBasicDetailModal, setShowBasicDetailModal] =
		useState<boolean>(false);
	const [showImageEditModal, setShowImageEditModal] = useState<boolean>(false);
	const { isSignedIn, user } = useUser();
	const [refresh, setRefresh] = useState(false);

	const handleRefresh = () => {
		setRefresh(!refresh);
	};
	return (
		<div className="flex flex-col min-h-screen ">
			<main className="flex-grow">
				<div className="flex-grow lg:max-w-6xl mx-auto pt-16">
					<div className="p-2 w-full">
						{/* header*/}
						<section
							className={clsx(
								"bg-gray-50 border flex flex-col gap-1 mb-2 mx-auto rounded-2xl",
								{ "pt-0": isSignedIn, "pt-10": !isSignedIn }
							)}
						>
							{isSignedIn && (
								<div className="flex justify-end pr-2 pt-2">
									<button
										type="button"
										onClick={() => setShowBasicDetailModal(true)}
									>
										<MdOutlineEdit className="size-9 hover:bg-gray-100 rounded-full p-2" />
									</button>
									{showBasicDetailModal && (
										<AddBasicDetailModal
											setShowBasicDetailModal={setShowBasicDetailModal}
											onSave={handleRefresh}
										/>
									)}
								</div>
							)}
							<div className=" bg-gray-50 w-full flex flex-col sm:flex-row justify-center items-center gap-1 mb-2 mx-auto pb-8 sm:px-10">
								{/* profile pic  */}
								<div className="w-full sm:w-[25%] flex justify-center items-center">
									<div className="size-40 flex flex-col mx-2 mb-2 justify-center items-center rounded-full">
										<div className="relative flex justify-center items-center size-36 sm:size-[175px]">
											{/* progress bar */}
											<CircularProgressbar
												value={30}
												strokeWidth={4}
												styles={buildStyles({
													pathColor: "#2bb550",
													trailColor: "#d6d6d6",
													strokeLinecap: "round",
												})}
											/>
											{/* profile picture */}
											<img
												src={noUser}
												className="absolute size-32 sm:size-40 rounded-full object-cover"
												alt="User"
											/>
											{/* completion percentage */}
											{/* <div className="absolute bottom-4 mb-[-20px] flex justify-center items-center w-10 h-5 bg-gray-400 text-slate-800 rounded-full">
												<span className="text-xs text-white font-semibold">
													30%
												</span>
											</div> */}
										</div>
										{isSignedIn && (
											<div className="relative -top-10 left-[55px]">
												<button
													type="button"
													onClick={() => setShowImageEditModal(true)}
												>
													<HiOutlineCamera className="size-6 sm:size-7 text-gray-100 bg-gray-700 border border-gray-700 rounded-full p-1" />
												</button>
												{showImageEditModal && (
													<EditImageModal
														setShowImageEditModal={setShowImageEditModal}
														onSave={handleRefresh}
														apiUrl={"/api/upload-profile-image"}
													/>
												)}
											</div>
										)}
									</div>
								</div>
								{/* user details */}
								<div className=" flex flex-col md:flex-row w-full sm:w-[75%] px-5">
									<div className=" flex flex-col px-5 py-5 gap-3 w-full flex-grow justify-center items-center sm:justify-center sm:items-start">
										{/* name and country */}
										<div className="leading-3">
											<div className="flex gap-2 items-center justify-center">
												<span className="text-center sm:text-start text-5xl font-semibold pb-1">
													John Smith
												</span>
											</div>
										</div>

										{/* bio */}
										<div className="text-center sm:text-start text-lg">
											Software Dev | Recent Grad | Looking for Opportunities
										</div>
										<div className="flex flex-col items-center xs:flex-row xs:items-start gap-2 text-sm">
											<span className="flex gap-1 items-center">
												<FaUserCheck />
												Joined July 2024
											</span>
											<span className="flex gap-1 items-center">
												<MdLocationPin />
												Based in Osaka, Japan
											</span>
										</div>
										{/* social Links */}

										<div className="flex items-center gap-2">
											<div className="flex gap-1 items-center text-sm text-gray-800">
												<HiMiniLanguage />
												Speaks
											</div>
											<div className="flex gap-1 text-xs">
												<span className="px-2 py-1 rounded-md bg-gray-200">
													Hindi
												</span>
												<span className="px-2 py-1 rounded-md bg-gray-200">
													English
												</span>
												<span className="px-2 py-1 rounded-md bg-gray-200">
													Japanese
												</span>
											</div>
										</div>
									</div>
									{/* social icons */}
									<div className=" w-full md:w-[20%] flex flex-col md:justify-center items-center ">
										<div className="flex w-full sm:justify-start sm:pl-5 md:pl-0 justify-center flex-row md:flex-col items-center gap-2">
											<span className="p-2 rounded-full border border-zinc-800 hover:text-zinc-100 hover:bg-slate-800 transition-colors cursor-pointer ">
												<SiGmail className="size-4" />
											</span>
											<span className="p-2 rounded-full border border-zinc-800 hover:text-zinc-100 hover:bg-slate-800 transition-colors cursor-pointer ">
												<FaLinkedinIn className="size-4" />
											</span>
											<span className="p-2 rounded-full border border-zinc-800 hover:text-zinc-100 hover:bg-slate-800 transition-colors cursor-pointer ">
												<FaGithub className="size-4" />
											</span>
											<span className="p-2 rounded-full border border-zinc-800 hover:text-zinc-100 hover:bg-slate-800 transition-colors cursor-pointer ">
												<SiLeetcode className="size-4" />
											</span>
											<span className="p-2 rounded-full border border-zinc-800 hover:text-zinc-100 hover:bg-slate-800 transition-colors cursor-pointer ">
												<FaXTwitter className="size-4" />
											</span>
											{/* <span className="flex justify-center items-center gap-2 px-2 py-1.5 border rounded-full hover:bg-gray-700 bg-slate-800 text-gray-100 transition-colors cursor-pointer">
									<HiShare className="size-[14px]" />
									<span className="text-sm">Share</span>
								</span> */}
										</div>
									</div>
								</div>
							</div>
						</section>
						{/* Tabs section */}
						<main className="sticky top-[64px] overflow-hidden z-10">
							<div className="px-4 py-3 bg-gray-50 border rounded-lg flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
								{tabsData.map((tab, idx) => (
									<Chip
										key={idx}
										index={idx}
										text={tab.title}
										selected={selected === idx}
										setSelected={setSelected}
									/>
								))}
							</div>
						</main>
						{/* content */}
						<section className="flex h-full mt-2">
							<main className="flex-grow w-full md:w-[75%]">
								<div>{tabsData[selected].content}</div>
							</main>
							{/* sidebar */}
							<aside className="hidden md:block w-[25%]">
								<div className="sticky top-[118px] ml-2 ">
									<div className=" flex flex-col gap-2">
										{/*  container */}
										<div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-lg border border-gray-300 ">
											{/* recomendations */}
											<CardStack />
											{/* publish button */}
											<button
												disabled={isDisabled}
												className="w-full mt-32 px-3 py-2 rounded-md bg-slate-800 text-white disabled:bg-black/60"
											>
												{isDisabled ? (
													<span className="flex items-center justify-center gap-2 cursor-not-allowed">
														Publish <HiLockClosed />
													</span>
												) : (
													<span className="flex items-center justify-center gap-2 cursor-pointer">
														Publish <PiConfettiFill className="text-rose-400" />
													</span>
												)}
											</button>
										</div>
										{/* integrations */}
										<div className="flex flex-col gap-2 px-3 py-4 rounded-lg border bg-gray-50">
											<span className="text-lg font-medium">
												Feature Your Content
											</span>

											{/* github */}
											<button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-slate-50 border border-zinc-300 hover:ring-4 hover:ring-gray-200 group">
												<div className="flex justify-between items-center gap-3">
													<span className="">
														<FaGithub className="size-5" />
													</span>
													<span className="">GitHub</span>
												</div>
												<span className="group-hover:hidden">
													<HiOutlinePlus className="size-5" />
												</span>
												<span className="hidden group-hover:block">
													<BsFillPlusCircleFill className="size-5" />
												</span>
											</button>

											{/* Youtube */}
											<button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-slate-50 border border-zinc-300 hover:ring-4 hover:ring-gray-200 group">
												<div className="flex justify-between items-center gap-3">
													<span className="">
														<FaYoutube className="size-5 text-rose-600" />
													</span>
													<span className="">Youtube</span>
												</div>
												<span className="group-hover:hidden">
													<HiOutlinePlus className="size-5" />
												</span>
												<span className="hidden group-hover:block">
													<BsFillPlusCircleFill className="size-5" />
												</span>
											</button>

											{/* dev.to */}
											<button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-slate-50 border border-zinc-300 hover:ring-4 hover:ring-gray-200 group">
												<div className="flex justify-between items-center gap-3">
													<span className="">
														<FaDev className="size-5" />
													</span>
													<span className="">Dev</span>
												</div>
												<span className="group-hover:hidden">
													<HiOutlinePlus className="size-5" />
												</span>
												<span className="hidden group-hover:block">
													<BsFillPlusCircleFill className="size-5" />
												</span>
											</button>

											{/* medium */}
											<button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-slate-50 border border-zinc-300 hover:ring-4 hover:ring-gray-200 group">
												<div className="flex justify-between items-center gap-3">
													<span className="">
														<FaMedium className="size-5" />
													</span>
													<span className="">Medium</span>
												</div>
												<span className="group-hover:hidden">
													<HiOutlinePlus className="size-5" />
												</span>
												<span className="hidden group-hover:block">
													<BsFillPlusCircleFill className="size-5" />
												</span>
											</button>

											{/* hashnode */}
											<button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-slate-50 border border-zinc-300 hover:ring-4 hover:ring-gray-200 group">
												<div className="flex justify-between items-center gap-3">
													<span className="">
														<FaHashnode className="size-5 text-blue-700 " />
													</span>
													<span className="">Hashnode</span>
												</div>
												<span className="group-hover:hidden">
													<HiOutlinePlus className="size-5" />
												</span>
												<span className="hidden group-hover:block">
													<BsFillPlusCircleFill className="size-5" />
												</span>
											</button>

											{/* dribbble */}
											<button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-slate-50 border border-zinc-300 hover:ring-4 hover:ring-gray-200 group">
												<div className="flex justify-between items-center gap-3">
													<span className="">
														<FaDribbble className="size-5 text-pink-600 " />
													</span>
													<span className="">Dribbble</span>
												</div>
												<span className="group-hover:hidden">
													<HiOutlinePlus className="size-5" />
												</span>
												<span className="hidden group-hover:block">
													<BsFillPlusCircleFill className="size-5" />
												</span>
											</button>
										</div>
									</div>
								</div>
							</aside>
						</section>
					</div>
				</div>
			</main>
			{/* Footer */}

			<footer className="px-2 w-full max-w-6xl mx-auto mt-auto">
				<div className="lg:max-w-6xl bg-gray-50 border mx-auto rounded-t-2xl py-5">
					<div className="flex flex-col gap-2 xs:flex-row justify-center mx-5 items-center  text-zinc-800">
						<p className="text-sm">&copy; 2024 Made by GradHunt.</p>
						<p className="text-sm"> All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
