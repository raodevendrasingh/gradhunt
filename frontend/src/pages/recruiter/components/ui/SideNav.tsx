import React, { useState } from "react";
import { Link } from "react-router-dom";

// icons
import {
	HiOutlineChevronDoubleLeft,
	HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { RiCopperCoinFill } from "react-icons/ri";
import { GoArrowUpRight } from "react-icons/go";
import { IoMailUnread } from "react-icons/io5";
import {
	FaCircleUser,
	FaBuilding,
	FaUserGraduate,
	FaGear,
	FaBuildingUser,
	FaArrowUpRightFromSquare,
} from "react-icons/fa6";

export const Sidebar = () => {
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);

	return (
		<>
			<button
				title="Side navigation"
				type="button"
				className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-40 order-10 block h-10 w-10 self-center rounded opacity-100 lg:hidden ${
					isSideNavOpen
						? "left-64 transform -translate-y-1/2 -translate-x-1/2"
						: "left-0"
				}`}
				aria-haspopup="menu"
				aria-label="Side navigation"
				aria-expanded={isSideNavOpen ? " true" : "false"}
				aria-controls="nav-menu-2"
				onClick={() => setIsSideNavOpen(!isSideNavOpen)}
			>
				<div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
					{isSideNavOpen ? (
						<HiOutlineChevronDoubleLeft
							className="h-6 w-6 text-slate-800"
							aria-hidden="true"
						/>
					) : (
						<HiOutlineChevronDoubleRight
							className="h-6 w-6 text-slate-800"
							aria-hidden="true"
						/>
					)}
				</div>
			</button>
			{/*  <!-- Side Navigation --> */}

			<aside
				id="nav-menu-2"
				aria-label="Side navigation"
				className={` fixed top-[70px] shadow-md bottom-2 left-2 z-40 flex w-60 flex-col border border-slate-200 rounded-lg bg-white transition-transform lg:translate-x-0 ${
					isSideNavOpen ? "translate-x-0" : " -translate-x-full"
				}`}
			>
				<nav
					aria-label="side navigation"
					className="flex-1 divide-y divide-slate-100 overflow-auto"
				>
					<div>
						<ul className="flex flex-1 flex-col gap-1 py-3">
							<li className="px-3">
								<Link
									to="/dev1618"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
								>
									<FaCircleUser className="size-5" />

									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Profile
									</div>
								</Link>
							</li>

							<li className="px-3">
								<Link
									to="./company-profile"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
								>
									<FaBuildingUser className="size-5" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Company Profile
									</div>
								</Link>
							</li>
							<li className="px-3">
								<Link
									to="./experience"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
								>
									<FaBuilding className="size-5" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Experience
									</div>
								</Link>
							</li>
							<li className="px-3">
								<Link
									to="./education"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
								>
									<FaUserGraduate className="size-5" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Education
									</div>
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<ul className="flex flex-1 flex-col gap-1 py-3">
							<li className="px-3">
								<Link
									to="./updates"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
								>
									<IoMailUnread className="size-5" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Updates
									</div>
								</Link>
							</li>
						</ul>
					</div>
				</nav>
				{/* Plan details */}
				{/* <div className="m-3 h-[140px] border rounded-xl flex flex-col items-center justify-center">
					<div className="flex gap-2 items-center">
						<div className="flex w-12 items-center justify-center gap-1 p-1 border-2  border-gray-300 rounded-xl">
							<span>
								<RiCopperCoinFill className="size-5 text-yellow-400" />
							</span>
							<span className="text-rose-600">1</span>
						</div>
						<div className="w-full flex justify-center items-center gap-2 border-2 border-gray-300 rounded-xl p-2 font-medium text-xs">
							Tier-0 Plan
						</div>
					</div>

					<div className="flex flex-col  my-1 gap-1 w-[200px]">
						<Link to="#" className="w-full">
							<div className="w-full flex justify-center items-center gap-1 border-2 border-b-4 active:border-b-2 border-gray-300 rounded-xl p-2 font-medium text-xs">
								<span>Upgrade Now</span>
								<span>
									<IoIosArrowDropup className="size-4" />
								</span>
							</div>
						</Link>
						<Link to="#" className="w-full">
							<div className="w-full flex justify-center items-center gap-2 border-2 border-b-4 active:border-b-2 border-gray-300 rounded-xl p-2 font-medium text-xs">
								<span>Need Help?</span>
								<span>
									<FaArrowUpRightFromSquare className="size-3" />
								</span>
							</div>
						</Link>
					</div>
				</div> */}
				<div className="m-3 h-44 border rounded-xl flex flex-col items-center justify-center relative">
					<div className="absolute top-2 flex gap-2 items-center">
						<div className="flex w-12 items-center justify-center gap-1 p-1 border-2 border-gray-300 rounded-xl">
							<span>
								<RiCopperCoinFill className="size-3 text-yellow-400" />
							</span>
							<span className="text-rose-600 text-xs">1</span>
						</div>
						<div className="py-1 px-2 text-xs w-full flex justify-center items-center gap-2 border-2 border-gray-300 rounded-xl">
							Introductory Plan
						</div>
					</div>
                    <div className="p-3 text-[12px] leading-[15px] text-center ">You have only one coin left. Upgrade your plan to increase coins & unlock more features.</div>

					<div className="flex items-center gap-1">
						<Link to="#" className="w-[95px] absolute bottom-2 left-2">
							<div className="w-full flex justify-center items-center gap-1 border-2 border-b-4 active:border-b-2 border-gray-300 rounded-xl p-2 font-medium text-xs bg-white transition-all duration-75">
								<span>Upgrade</span>
								<span>
									<GoArrowUpRight className="size-4" />
								</span>
							</div>
						</Link>
						<Link to="#" className="w-[95px] absolute bottom-2 right-2">
							<div className="w-full flex justify-center items-center gap-2 border-2 border-b-4 active:border-b-2 border-gray-300 rounded-xl p-2 font-medium text-xs bg-white transition-all duration-75">
								<span>Help</span>
								<span>
									<FaArrowUpRightFromSquare className="size-3" />
								</span>
							</div>
						</Link>
					</div>
				</div>
				<footer className="border-t border-slate-200 p-3">
					<Link
						to="./settings"
						className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:text-green-600 "
					>
						<FaGear className="size-5" />
						<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
							Settings
						</div>
					</Link>
				</footer>
			</aside>

			{/* More common content for both user types */}
			<div
				className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
					isSideNavOpen ? "block" : "hidden"
				}`}
				onClick={() => setIsSideNavOpen(false)}
			></div>
			{/*  <!-- End Side navigation menu with content separator --> */}
		</>
	);
};
