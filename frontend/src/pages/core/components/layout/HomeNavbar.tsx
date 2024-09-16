import { useState } from "react";
import { GoBell, GoSearch, GoX } from "react-icons/go";
import { HiOutlineMenu } from "react-icons/hi";
import brandIcon from "@/assets/brand/brandIcon.png";
import { UserMenuDropdown } from "@/components/common/UserMenuDropdown";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeNavbar() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<nav className="bg-white border-b relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0 flex items-center">
						<img className="h-8 w-auto" src={brandIcon} alt="Logo" />
						<span className="ml-2 text-2xl font-bold text-gray-800 hidden xs:inline">
							GradHunt
						</span>
					</div>

					{/* hide the search bar on jobsearch page */}

					{/* Search bar - hidden on mobile, visible on larger screens */}
					<div className="hidden md:block flex-1 max-w-md mx-4">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<GoSearch className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 sm:text-sm"
								placeholder="Search"
							/>
						</div>
					</div>

					{/* Navigation Items - hidden on mobile, visible on larger screens */}
					<div className="hidden md:flex md:items-center space-x-4">
						<button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0">
							<GoBell className="h-6 w-6" />
						</button>

						{/* Profile dropdown */}
						<UserMenuDropdown />
					</div>

					{/* Mobile navigation */}
					<div className="flex items-center md:hidden space-x-4">
						<button
							onClick={() => setIsSearchOpen(!isSearchOpen)}
							className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0"
						>
							<GoSearch className="h-6 w-6" />
						</button>
						<button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0 ">
							<GoBell className="h-6 w-6" />
						</button>
						<UserMenuDropdown />
					</div>
				</div>
			</div>

			{/* Search overlay for mobile */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            mass: 1.5,
                            velocity: 2
                          }}
						className="absolute left-0 right-0 bg-white border-b border-x z-10 rounded-b-3xl md:hidden"
					>
						<div className="p-4">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<GoSearch className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="text"
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 sm:text-sm"
									placeholder="Search"
									autoFocus
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
