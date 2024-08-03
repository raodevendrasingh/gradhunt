import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

import axios from "axios";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/common/Header";

export default function CandidateLayout() {
	const { isSignedIn, user } = useUser();
    const {signOut} = useClerk();

	const fetchAndRedirectUser = async () => {
		if (isSignedIn) {
			const email = user?.primaryEmailAddress?.emailAddress;
			try {
				const url = `http://localhost:8000/api/get-usertype/?email=${email}`;
				const response = await axios.get(url);
				const usertype = response.data.usertype;

				const redirectMap: { [key: string]: string } = {
					recruiter: "http://recruiter.localhost:5173/",
					admin: "http://admin.localhost:5173/",
				};

				if (redirectMap[usertype]) {
                    signOut().then(() => {
                        window.location.href = redirectMap[usertype];
                    }).catch((error: any) => {
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
	}, [isSignedIn, user]);

	return (
		<main>
			<Header />
			<Outlet />
		</main>
	);
}
