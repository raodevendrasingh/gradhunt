import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { RecruiterSidebar } from "./components/layout/RecruiterSidebar";
import RecruiterNavbar from "./components/layout/RecruiterNavbar";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { ProfileSidebar } from "./components/layout/ProfileSidebar";
import ProfileNavbar from "./components/layout/ProfileNavbar";

export default function RecruiterLayout(): React.JSX.Element {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const { data: userData, isLoading: isUserDataLoading } =
		useFetchUserDetails();

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
