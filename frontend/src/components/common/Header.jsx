// hooks
import { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

// assets
import avatar from "@/assets/avatar/noUserBlank.png";
import gradhunt from "@/assets/brand/brandLogoFull.png";

import {
	UserIcon,
	ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const recruiterUrl =
	import.meta.env.NODE_ENV === "production"
		? "https://recruiter.gradhunt.com"
		: "http://recruiter.localhost:5173";

export const Header = () => {
	const { logout, isAuthenticated } = useKindeAuth();

	const [isToggleOpen, setIsToggleOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<header className=" fixed top-0 z-20 w-full border-b-1 border-b border-slate-200 bg-white/90 shadow-md shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
				<div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl">
					<nav
						aria-label="main navigation"
						className="flex h-16 items-stretch justify-between font-medium text-slate-800"
						role="navigation"
					>
						{/* Brand logo */}
						<Link
							id="ws"
							aria-label="logo"
							aria-current="page"
							className="flex items-center gap-2 whitespace-nowrap py-3 text-lg focus:outline-none"
							to="/"
						>
							<img src={gradhunt} alt="logo" className="aspect-auto w-44 " />
						</Link>
						{/* Mobile trigger */}
						<button
							className={`relative order-10 block h-10 w-10 self-center lg:hidden
                                    ${
																			isToggleOpen
																				? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
																				: ""
																		}
                            `}
							onClick={() => setIsToggleOpen(!isToggleOpen)}
							aria-expanded={isToggleOpen ? "true" : "false"}
							aria-label="Toggle navigation"
						>
							<div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900   transition-all duration-300"
								></span>
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
								></span>
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
								></span>
							</div>
						</button>
						{/* Navigation links */}
						<ul
							role="menubar"
							aria-label="Select page"
							className={`flex flex-col lg:flex-row justify-center items-center  absolute top-0 left-0 z-[-1] h-[28.5rem] w-full overflow-hidden overflow-y-auto overscroll-contain bg-white/90 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0  lg:z-0 lg:h-full lg:w-auto lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0  lg:pt-0 lg:opacity-100 ${
								isToggleOpen
									? "visible opacity-100 backdrop-blur-sm"
									: "invisible opacity-0"
							}`}
						>
							<li role="none" className="flex items-center ">
								<Link
									role="menuitem"
									aria-haspopup="false"
									className="flex items-center gap-2 py-4 transition-colors duration-100 hover:text-green-700  focus:outline-none focus-visible:outline-none lg:px-8"
									to="#"
								>
									Talent
								</Link>
							</li>
							<li role="none" className="flex items-center">
								<Link
									role="menuitem"
									// aria-current="page"
									aria-haspopup="false"
									className="flex items-center gap-2 py-4 transition-colors duration-100 hover:text-green-700 focus:outline-none focus-visible:outline-none lg:px-8"
									to="#"
								>
									Jobs
								</Link>
							</li>
							<li role="none" className="flex items-center">
								<Link
									role="menuitem"
									aria-haspopup="false"
									className="flex items-center gap-2 py-4 transition-colors duration-100 hover:text-green-700 focus:outline-none focus-visible:outline-none lg:px-8"
									to="#"
								>
									Companies
								</Link>
							</li>
						</ul>

						<div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
							{isAuthenticated ? (
								<>
									<Link
										to="#"
										className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
										onClick={(e) => {
											e.preventDefault();
											setIsOpen(!isOpen);
										}}
									>
										<img
											src={avatar}
											alt="user name"
											title="user name"
											width="40"
											height="40"
											className="max-w-full rounded-full"
										/>
									</Link>
									{isOpen && (
										<div className="absolute right-0 top-16 w-28 mr-1 rounded-md shadow-lg transition">
											<div className="rounded-md bg-gray-100 shadow-xs">
												<div className="p-1">
													<Link
														to="/profile"
														className="flex gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
													>
														<UserIcon
															className="h-5 w-5 text-gray-800"
															aria-hidden="true"
														/>
														Profile
													</Link>
													<Link
														to="#"
														onClick={() =>
															logout({ returnTo: window.location.origin })
														}
														className="flex gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-50 rounded"
													>
														<ArrowLeftStartOnRectangleIcon
															className="h-5 w-5 text-red-700"
															aria-hidden="true"
														/>
														Logout
													</Link>
												</div>
											</div>
										</div>
									)}
								</>
							) : (
								<div className="flex items-center justify-center gap-5">
									<Link to="/login">
										<button
											type="button"
											className="bg-green-700 rounded-full text-sm text-white px-3 py-2"
										>
											Log In
										</button>
									</Link>

									<Link to={recruiterUrl}>
                                    <button className="px-3 py-1.5 flex text-sm items-center gap-2 rounded-full bg-green-100 text-green-700 border-2 border-b-4 active:border-2 border-green-700">
										Post Jobs
                                        <span>
                                            <FaArrowUpRightFromSquare/>
                                        </span>
									</button>
									</Link>

                                    

									{/* <Dropdown
										title={"For Recruiter"}
										options={employerOptions}
										width={48}
									/> */}
								</div>
							)}
						</div>
					</nav>
				</div>
			</header>
		</>
	);
};
