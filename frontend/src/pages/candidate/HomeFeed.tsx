import { UsernameModal, UserDetailModal } from "@/components/common/UserModal";
import { useUser } from "@clerk/clerk-react";

export default function HomeFeed(): JSX.Element {
	const { isSignedIn, user } = useUser();


	return (
		<div className="p-24">
			job search page
		</div>
	);
}
