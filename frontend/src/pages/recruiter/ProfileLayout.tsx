//* base page of the recruiter profile

import { Outlet } from "react-router-dom";
import { RecruiterNavbar } from "./components/ui/RecruiterNavbar";
import { Sidebar } from "./components/ui/SideNav";

export const ProfileLayout = () => {
	return (
		<div className="bg-gray-100 w-full h-[100vh]">
			<RecruiterNavbar />
			<Sidebar />
			<Outlet />
		</div>
	);
};
