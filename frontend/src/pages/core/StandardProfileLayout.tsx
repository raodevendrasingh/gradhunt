import { ProfileSidebar } from "./components/layout/ProfileSidebar";
import { Outlet } from "react-router-dom";
import HomeNavbar from "./components/layout/HomeNavbar";
import React from "react";

export default function StandardProfileLayout(): React.JSX.Element {
	return (
		<div className="flex flex-col h-screen">
			<HomeNavbar />
			<div className="flex flex-1 overflow-hidden">
				<div className="hidden xsm:flex w-20 md2:w-64 overflow-y-auto border-r">
					<ProfileSidebar />
				</div>
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
