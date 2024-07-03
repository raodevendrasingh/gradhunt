import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/userStore";
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	Squares2X2Icon,
} from "@heroicons/react/24/solid";
import { TbTablePlus } from "react-icons/tb";
import {
	FaAward,
	FaTrophy,
	FaBell,
	FaInbox,
	FaGear,
	FaUsers,
	FaUserGear,
	FaNewspaper,
	FaLaptopCode,
	FaChartColumn,
	FaGraduationCap,
	FaBuilding,
	FaRankingStar,
} from "react-icons/fa6";

export const Sidebar = () => {
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const { userType } = useStore();

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
						<ChevronDoubleLeftIcon
							className="h-6 w-6 text-slate-800"
							aria-hidden="true"
						/>
					) : (
						<ChevronDoubleRightIcon
							className="h-6 w-6 text-slate-800"
							aria-hidden="true"
						/>
					)}
				</div>
			</button>
			{/*  <!-- Side Navigation --> */}
			{userType === "recruiter" && (
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
										to="/profile"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<Squares2X2Icon className="h-5 w-5" />

										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Dashboard
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="./postings"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
										// aria-current="page"
									>
										<TbTablePlus className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Job Postings
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="./candidates"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaUsers className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Candidate Pool
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="./interviews"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaLaptopCode className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Interviews
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="./reports"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaChartColumn className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Reports
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<ul className="flex flex-1 flex-col gap-1 py-3">
								<li className="px-3">
									<Link
										to="./notifications"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaInbox className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Inbox
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</nav>
					<footer className="border-t border-slate-200 p-3">
						<Link
							to="./settings"
							className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:text-green-600 "
						>
							<FaGear className="h-5 w-5" />
							<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
								Settings
							</div>
						</Link>
					</footer>
				</aside>
			)}
			{/*  <!-- Side Navigation --> */}
			{userType === "candidate" && (
				<aside
					id="nav-menu-2"
					aria-label="Side navigation"
					className={`fixed shadow-md top-[70px] bottom-0 left-0 z-40 flex w-72 flex-col border-r border-r-slate-200 bg-white transition-transform lg:translate-x-0 ${
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
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<Squares2X2Icon className="h-5 w-5" />

										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Dashboard
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
										aria-current="page"
									>
										<FaGraduationCap className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Education
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaRankingStar className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Skills
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaAward className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Certifications
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaBuilding className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Experience
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaTrophy className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Achievements
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaNewspaper className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Applications
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<ul className="flex flex-1 flex-col gap-1 py-3">
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaInbox className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Inbox
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaBell className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Notifications
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</nav>
					<footer className="border-t border-slate-200 p-3">
						<Link
							to="#"
							className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:text-green-600 "
						>
							<FaGear className="h-5 w-5" />
							<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
								Settings
							</div>
						</Link>
					</footer>
				</aside>
			)}

			{userType === "admin" && (
				<aside
					id="nav-menu-2"
					aria-label="Side navigation"
					className={`fixed shadow-md top-[70px] bottom-0 left-0 z-40 flex w-72 flex-col border-r border-r-slate-200 bg-white transition-transform lg:translate-x-0 ${
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
										to="/profile"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<Squares2X2Icon className="h-5 w-5" />

										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Dashboard
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
										aria-current="page"
									>
										<TbTablePlus className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Job Postings
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaUsers className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Users
										</div>
									</Link>
								</li>
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaChartColumn className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Reports
										</div>
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<ul className="flex flex-1 flex-col gap-1 py-3">
								<li className="px-3">
									<Link
										to="#"
										className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-green-100 hover:text-green-600 focus:bg-green-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-green-600 "
									>
										<FaBell className="h-5 w-5" />
										<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
											Notifications
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</nav>
					<footer className="border-t border-slate-200 p-3">
						<Link
							to="./settings"
							className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:text-green-600 "
						>
							<FaUserGear className="h-5 w-5" />
							<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
								Settings
							</div>
							{/* add export daya option in admin settings */}
						</Link>
					</footer>
				</aside>
			)}
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
