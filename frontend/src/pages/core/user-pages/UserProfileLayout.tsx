import ProfileNavbar from "@/pages/core/components/layout/ProfileNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { ProfileSidebar } from "@/pages/core/components/layout/ProfileSidebar";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function UserProfileLayout(): JSX.Element {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { user, isSignedIn } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user && isSignedIn) {
			if (!user.username || !user.firstName || !user.lastName) {
				navigate(`/onboarding`);
			}
		}
	}, [user, isSignedIn]);

	return (
		<div className="flex flex-col h-screen">
			<ProfileNavbar
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden md:flex sm:w-56 lg:w-64 overflow-y-auto border-r">
					<ProfileSidebar />
				</div>
				<div className="md:hidden">
					<ProfileSidebar
						isOpen={isSidebarOpen}
						onClose={() => setIsSidebarOpen(false)}
						isMobile={true}
					/>
				</div>
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
