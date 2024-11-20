import brandWordmark from "@/assets/brand/brandLogoFull.png";
import { GoBell } from "react-icons/go";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserMenuDropdown } from "@/components/common/UserMenuDropdown";
import { Button } from "@/components/ui/Button";

export default function JobSearchNavbar() {
	return (
		<nav className="bg-white border-b relative z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						{/* Logo */}
						<div className="flex-shrink-0 flex items-center">
							<Link to="/">
								<img
									className="h-10 sm:h-12 w-auto"
									src={brandWordmark}
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

						<div className="flex items-center gap-4">
							<SignedOut>
								<Button className="flex justify-center py-2.5 rounded-lg">
									<Link to="/login">Login</Link>
								</Button>
								<Button variant="secondary" className="w-20 py-2.5 rounded-lg">
									<Link to="/hire">Hire</Link>
								</Button>
							</SignedOut>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
