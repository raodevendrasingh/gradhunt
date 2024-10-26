import ProfileNavbar from "./components/layout/ProfileNavbar";
import React, { useEffect, useState } from "react";
import RecruiterNavbar from "./components/layout/RecruiterNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { ProfileSidebar } from "./components/layout/ProfileSidebar";
import { RecruiterSidebar } from "./components/layout/RecruiterSidebar";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { useUser } from "@clerk/clerk-react";

export default function RecruiterLayout(): React.JSX.Element {
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

	const { data: userData } = useFetchUserDetails();

	const isCompanyAdmin = userData?.user_details?.isCompanyAdmin;

	return (
		<div className="flex flex-col h-screen">
			{isCompanyAdmin ? (
				<RecruiterNavbar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
				/>
			) : (
				<ProfileNavbar
					isSidebarOpen={isSidebarOpen}
					setIsSidebarOpen={setIsSidebarOpen}
				/>
			)}
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden md:flex sm:w-56 lg:w-64 overflow-y-auto border-r">
					{isCompanyAdmin ? (
						<RecruiterSidebar isMobile={false} />
					) : (
						<ProfileSidebar />
					)}
				</div>
				<div className="md:hidden">
					{isCompanyAdmin ? (
						<RecruiterSidebar
							isOpen={isSidebarOpen}
							onClose={() => setIsSidebarOpen(false)}
							isMobile={true}
						/>
					) : (
						<ProfileSidebar
							isOpen={isSidebarOpen}
							onClose={() => setIsSidebarOpen(false)}
							isMobile={true}
						/>
					)}
				</div>
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
