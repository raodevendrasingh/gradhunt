import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

import { UserOnboardingModal } from "@/modalForms/OnboardingModal";
import Navbar from "@/components/common/Navbar";

export default function CandidateLayout() {
	const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
	const { isSignedIn, user } = useUser();

	useEffect(() => {
		if (isSignedIn) {
			if (!user.username || !user.firstName || !user.lastName) {
				setIsOnboardingModalOpen(true);
			}
		}
	}, [isSignedIn, user]);

	return (
		<main>
			<Navbar />
			<Outlet />
			<div>
				<UserOnboardingModal
					isOnboardingModalOpen={isOnboardingModalOpen}
					setIsOnboardingModalOpen={setIsOnboardingModalOpen}
				/>
			</div>
		</main>
	);
}
