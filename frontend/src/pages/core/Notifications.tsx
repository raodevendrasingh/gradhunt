import { useUser } from "@clerk/clerk-react";
import NotFound from "@/pages/common/NotFound";

export default function NotificationsPage() {
	const { isSignedIn } = useUser();

	if (!isSignedIn) return <NotFound />;

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto border-r scrollbar-hide p-4">
				Notifications will appear here
			</div>
		</div>
	);
}
