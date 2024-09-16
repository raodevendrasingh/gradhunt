import { useState, useEffect } from "react";

// external packages
import { Link } from "react-router-dom";

import { SignedIn, SignedOut } from "@clerk/clerk-react";

// assets
import gradhunt from "@/assets/brand/brandLogoFull.png";

// icons
import { GoArrowUpRight } from "react-icons/go";
import { UserMenuDropdown } from "./UserMenuDropdown";

const recruiterUrl = import.meta.env.VITE_BASE_RECRUITER_URL;

interface NavLink {
	name: string;
	href: string;
}

const navLinks: NavLink[] = [
	{ name: "Explore Jobs", href: "/job-search" },
	{ name: "Companies", href: "/companies" },
	{ name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setIsMenuOpen(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="fixed top-0 left-0 right-0 bg-white bg-opacity-70 backdrop-blur-md shadow-sm z-50">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link
						id="ws"
						aria-label="logo"
						aria-current="page"
						className="flex items-center gap-2 whitespace-nowrap py-3 text-lg focus:outline-none"
						to="/"
					>
						<img src={gradhunt} alt="logo" className="aspect-auto w-44 " />
					</Link>

					{!isMobile && (
						<>
							<nav>
								<ul className="flex items-center gap-8">
									{navLinks.map((link) => (
										<li key={link.name}>
											<Link
												to={link.href}
												className="text-slate-800 hover:text-blue-800 transition-colors duration-200"
											>
												{link.name}
											</Link>
										</li>
									))}
								</ul>
							</nav>
							<div className="flex items-center justify-center gap-2 text-sm">
								<SignedIn>
									<UserMenuDropdown />
								</SignedIn>

								<SignedOut>
									<button className="flex justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
										<Link to="/login">Login</Link>
									</button>
									<button className="flex justify-center items-center gap-1 whitespace-nowrap px-3 py-2 hover:bg-sky-200 text-slate-800 rounded-lg transition-colors">
										<Link to={recruiterUrl}>Post Jobs</Link>
										<span>
											<GoArrowUpRight className="size-4" />
										</span>
									</button>
								</SignedOut>
							</div>
						</>
					)}

					{isMobile && (
						<div className="flex items-center justify-center gap-3">
							<SignedIn>
								<UserMenuDropdown />
							</SignedIn>

							<button
								className={`relative order-10 block h-10 w-10 self-center lg:hidden
                                ${
																	isMenuOpen
																		? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
																		: ""
																}
                        `}
								onClick={toggleMenu}
								aria-expanded={isMenuOpen ? "true" : "false"}
								aria-label="Toggle navigation"
							>
								<div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
									<span
										aria-hidden="true"
										className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
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
						</div>
					)}
				</div>
			</div>

			{isMobile && (
				<div
					className={`bg-white opacity-95 !backdrop-blur-md transition-all duration-300 ease-in-out ${
						isMenuOpen
							? "max-h-96 shadow-sm"
							: "max-h-0 opacity-0 overflow-hidden"
					}`}
				>
					<nav className="container mx-auto px-4 py-4">
						<ul className="flex flex-col items-center justify-center space-y-6">
							{navLinks.map((link) => (
								<li key={link.name}>
									<Link // Changed from <a> to <Link>
										to={link.href}
										className="block text-gray-600 hover:text-blue-500 transition-colors duration-200"
										onClick={() => setIsMenuOpen(false)} // Close menu on click
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
						<div className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-4 w-full">
							<SignedOut>
								<button className="flex justify-center w-1/2 px-3 py-[9px] bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
									<Link to="/login" onClick={() => setIsMenuOpen(false)}>
										Login
									</Link>
									{/* Close menu on click */}
								</button>
								<button className="flex justify-center w-1/2 items-center gap-1 whitespace-nowrap px-3 py-2 hover:bg-sky-200 text-slate-800 border border-slate-800 rounded-lg transition-colors">
									<Link to={recruiterUrl} onClick={() => setIsMenuOpen(false)}>
										Post Jobs
									</Link>
									{/* Close menu on click */}
									<span>
										<GoArrowUpRight className="size-4" />
									</span>
								</button>
							</SignedOut>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
