import { UsernameModal, UserDetailModal } from "@/components/common/UserModal";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function HomeFeed(): JSX.Element {
	const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
	const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
	const { isSignedIn, user } = useUser();

	useEffect(() => {
		if (isSignedIn) {
			const username = user.username;
			const firstname = user.firstName;
			const lastname = user.lastName;
			console.log("username: ",username);
			console.log('firstname :', firstname);
			console.log('lastname :', lastname);

			if (username == null) {
				setIsUsernameModalOpen(true);
			} else if (firstname == null || lastname == null) {
				setIsUserDetailModalOpen(true);
			}
		}
	}, [isSignedIn, user]);

	return (
		<div className="p-24">
			<UserDetailModal
				isUserDetailModalOpen={isUserDetailModalOpen}
				setIsUserDetailModalOpen={setIsUserDetailModalOpen}
			/>
			<UsernameModal
				isUsernameModalOpen={isUsernameModalOpen}
				setIsUsernameModalOpen={setIsUsernameModalOpen}
			/>
			Home Feed - You are seeing this because you are signed in
			<div className="flex flex-col">
				<span>username: {user?.username}</span>
				<span>firstname: {user?.firstName}</span>
				<span>primary-email: {user?.primaryEmailAddress?.toString()}</span>
			</div>
		</div>
	);
}
