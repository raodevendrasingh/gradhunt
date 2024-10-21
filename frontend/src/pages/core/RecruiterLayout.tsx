import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { RecruiterSidebar } from "./components/layout/RecruiterSidebar";
import RecruiterNavbar from "./components/layout/RecruiterNavbar";

export default function RecruiterLayout(): React.JSX.Element {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex flex-col h-screen">
			<RecruiterNavbar
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<div className="flex flex-1 overflow-hidden">
				<RecruiterSidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					isMobile={true}
				/>
				<RecruiterSidebar isMobile={false} />
				<div className="flex-1 overflow-y-auto border-l scrollbar-hide">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
