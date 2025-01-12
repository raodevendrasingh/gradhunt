import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import axios from "axios";
import { Outlet } from "react-router-dom";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export default function AdminLayout() {
	const { isSignedIn, user } = useUser();

	const fetchAndRedirectUser = async () => {
		if (isSignedIn) {
			const email = user?.primaryEmailAddress?.emailAddress;
			try {
				const url = `${apiUrl}/api/get-usertype/?email=${email}`;
				const response = await axios.get(url);
				const usertype = response.data.usertype;

				const redirectMap: { [key: string]: string } = {
					recruiter: "http://recruiter.localhost:5173/",
					candidate: "http://localhost:5173/login",
				};

				if (redirectMap[usertype]) {
					window.location.href = redirectMap[usertype];
				}
			} catch (error) {
				console.error("Error fetching user type:", error);
			}
		}
	};

	useEffect(() => {
		fetchAndRedirectUser();
	}, [isSignedIn, user]);
	return (
		<div>
			<Outlet />
		</div>
	);
}
