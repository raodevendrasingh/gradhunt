import brandIcon from "@/assets/brand/brandIcon.png";
import brandWordmark from "@/assets/brand/brandLogoFull.png";
import { GoBell } from "react-icons/go";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserMenuDropdown } from "@/components/common/UserMenuDropdown";

interface JobFeedNavbarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (value: boolean) => void;
}

export default function JobFeedNavbar({
	isSidebarOpen,
	setIsSidebarOpen,
}: JobFeedNavbarProps) {
	return (
		<nav className="bg-white border-b relative z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						{/* Menu Button - Only visible on mobile */}
						<button
							className={`relative block h-10 w-10 mr-4 md:hidden ${
								isSidebarOpen
									? `visible opacity-100 [&_span:nth-child(1)]:w-6
                                     [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45
                                     [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 `
									: ""
							}`}
							aria-expanded={isSidebarOpen ? "true" : "false"}
							aria-label="Toggle navigation"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						>
							<div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-gray-600
                   transition-all duration-300"
								></span>
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-6 transform rounded-full bg-gray-600 transition
                   duration-300"
								></span>
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full
                   bg-gray-600 transition-all duration-300"
								></span>
							</div>
						</button>

						{/* Logo */}
						<div className="flex-shrink-0 flex items-center">
							<Link to="/">
								<img
									className="hidden sm:block h-12 w-auto"
									src={brandWordmark}
									alt="Logo"
								/>
								<img
									className="sm:hidden h-10 w-auto"
									src={brandIcon}
									alt="Logo"
								/>
							</Link>
						</div>
					</div>

					{/* Navigation Items */}
					<div className="flex items-center space-x-8">
						<SignedIn>
							<button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0">
								<Link to="/notifications">
									<GoBell className="h-6 w-6" />
								</Link>
							</button>
							<UserMenuDropdown />
						</SignedIn>

						<SignedOut>
							<button className="flex justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
								<Link to="/login">Login</Link>
							</button>
						</SignedOut>
					</div>
				</div>
			</div>
		</nav>
	);
}
