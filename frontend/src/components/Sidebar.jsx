import { useState } from "react";
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	AcademicCapIcon,
	Squares2X2Icon,
    InboxIcon,
    BellIcon,
    BoltIcon,
    BuildingOffice2Icon,
    Cog6ToothIcon,
    TrophyIcon,
    StarIcon,
} from "@heroicons/react/24/solid";
import { FaAward, FaGear } from "react-icons/fa6";

export const Sidebar = () => {
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);

	return (
		<>
			<button
				title="Side navigation"
				type="button"
				className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-40 order-10 block h-10 w-10 self-center rounded opacity-100 lg:hidden ${
					isSideNavOpen
						? "left-[300px] transform -translate-y-1/2 -translate-x-1/2"
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
							className="h-6 w-6 text-slate-400"
							aria-hidden="true"
						/>
					) : (
						<ChevronDoubleRightIcon
							className="h-6 w-6 text-slate-400"
							aria-hidden="true"
						/>
					)}
				</div>
			</button>

			{/*  <!-- Side Navigation --> */}
			<aside
				id="nav-menu-2"
				aria-label="Side navigation"
				className={`fixed top-[90px] bottom-0 left-0 z-40 flex w-72 flex-col border-r border-r-slate-200 bg-white transition-transform lg:translate-x-0 ${
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
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<Squares2X2Icon className="h-6 w-6" />
									
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Dashboard
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
									aria-current="page"
								>
									<AcademicCapIcon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Education
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<BoltIcon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Skills
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
                                    <FaAward className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Certifications
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<BuildingOffice2Icon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Experience
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<TrophyIcon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Achievements
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<TrophyIcon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Applications
									</div>
								</a>
							</li>
							
							
						</ul>
					</div>
					<div>
						<ul className="flex flex-1 flex-col gap-1 py-3">
                        <li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<InboxIcon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Inbox
									</div>
								</a>
							</li>
							<li className="px-3">
								<a
									href="#"
									className="flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-500 focus:bg-emerald-50 aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-500 "
								>
									<BellIcon className="h-6 w-6" />
									<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
										Notifications
									</div>
								</a>
							</li>
							
						</ul>
					</div>
				</nav>
				<footer className="border-t border-slate-200 p-3">
					<a
						href="#"
						className="flex items-center gap-3 rounded p-3 text-slate-900 transition-colors hover:text-emerald-500 "
					>
						<Cog6ToothIcon className="h-6 w-6" />
						<div className="flex w-full flex-1 flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm font-medium">
							Settings
						</div>
					</a>
				</footer>
			</aside>

			{/*  <!-- Backdrop --> */}
			<div
				className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
					isSideNavOpen ? "block" : "hidden"
				}`}
				onClick={() => setIsSideNavOpen(false)}
			></div>
			{/*  <!-- End Side navigation menu with content separator --> */}
		</>
	);
}
