import { UsernameModal, UserDetailModal } from "@/components/common/UserModal";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useStore } from "@/store/userStore";

export default function HomeFeed(): JSX.Element {
	const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
	const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
	const { isSignedIn, user } = useUser();
	const signInUser = useStore((state) => state.signInUser);
	const memoizedSignInUser = useCallback(signInUser, []);

	useEffect(() => {
		if (isSignedIn && user) {
			const username = user.username || "";
			const usertype = "candidate";
			signInUser(username, usertype);
		}
	}, [isSignedIn, user, memoizedSignInUser]);

	useEffect(() => {
		if (isSignedIn) {
			if (!user.username) {
				setIsUsernameModalOpen(true);
			} else if (!user.firstName || !user.lastName) {
				setIsUserDetailModalOpen(true);
			}
		}
	}, [isSignedIn, user]);

	return (
		<div className="p-24">

            this is the home feed
			<UserDetailModal
				isUserDetailModalOpen={isUserDetailModalOpen}
				setIsUserDetailModalOpen={setIsUserDetailModalOpen}
			/>
			<UsernameModal
				isUsernameModalOpen={isUsernameModalOpen}
				setIsUsernameModalOpen={setIsUsernameModalOpen}
			/>
		</div>
	);
}
