import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

import axios from "axios";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/common/Header";
import { useStore } from "@/store/userStore";
import { UserDetailModal, UsernameModal } from "@/components/common/UserModal";

export default function CandidateLayout() {
	const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
	const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
	const { isSignedIn, user } = useUser();
	const signInUser = useStore((state) => state.signInUser);

	const { signOut } = useClerk();

	const fetchAndRedirectUser = async () => {
		if (isSignedIn) {
			const username = user.username || "";
			const email = user?.primaryEmailAddress?.emailAddress;
			try {
				const url = `/api/get-usertype/?email=${email}`;
				const response = await axios.get(url);
				const usertype = response.data.usertype;

				signInUser(username, usertype); // load username and usertype in local storage

                // redirect user to respective sign in page if the usertype dont match
				const redirectMap: { [key: string]: string } = {
					recruiter: import.meta.env.VITE_BASE_RECRUITER_URL,
					admin: import.meta.env.VITE_BASE_ADMIN_URL
				};

				if (redirectMap[usertype]) {
					signOut()
						.then(() => {
							window.location.href = redirectMap[usertype];
						})
						.catch((error: any) => {
							console.error("Error signing out:", error);
						});
				}
			} catch (error) {
				console.error("Error fetching user type:", error);
			}
		}
	};

	useEffect(() => {
		fetchAndRedirectUser();
		if (isSignedIn) {
			if (!user.username) {
				setIsUsernameModalOpen(true);
			} else if (!user.firstName || !user.lastName) {
				setIsUserDetailModalOpen(true);
			}
		}
	}, [isSignedIn, user]);

	return (
		<main>
			<Header />
			<Outlet />
			<div>
				<UserDetailModal
					isUserDetailModalOpen={isUserDetailModalOpen}
					setIsUserDetailModalOpen={setIsUserDetailModalOpen}
				/>
				<UsernameModal
					isUsernameModalOpen={isUsernameModalOpen}
					setIsUsernameModalOpen={setIsUsernameModalOpen}
				/>
			</div>
		</main>
	);
}
