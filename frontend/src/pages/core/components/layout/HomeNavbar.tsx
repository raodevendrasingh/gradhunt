import { GoBell } from "react-icons/go";
import brandIcon from "@/assets/brand/brandIcon.png";
import { UserMenuDropdown } from "@/components/common/UserMenuDropdown";
import { Link } from "react-router-dom";

export default function HomeNavbar() {
	return (
		<nav className="bg-white border-b relative z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						{/* Logo */}
						<div className="flex-shrink-0 flex items-center">
							<img className="h-8 w-auto" src={brandIcon} alt="Logo" />
							<span className="ml-2 text-2xl font-bold text-gray-800 xs:inline">
								GradHunt
							</span>
						</div>

						{/* Explore Jobs - Only visible on larger screens */}
						<div className="hidden md:flex ml-6">
							<Link
								to="/job-search"
								className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
							>
								Explore Jobs
							</Link>
						</div>
					</div>

					{/* Navigation Items */}
					<div className="flex items-center space-x-8">
						<button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0">
							<Link to="/notifications">
								<GoBell className="h-6 w-6" />
							</Link>
						</button>
						<UserMenuDropdown />
					</div>
				</div>
			</div>
		</nav>
	);
}
