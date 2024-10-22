import ProfileNavbar from './components/layout/ProfileNavbar';
import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from './components/layout/ProfileSidebar';
import { useState } from 'react';

export default function StandardProfileLayout(): JSX.Element {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
