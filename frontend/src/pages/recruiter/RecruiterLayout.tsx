import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import axios from "axios";
import { Outlet } from "react-router-dom";

import { RecruiterNavbar } from "./components/ui/RecruiterNavbar";

export default function RecruiterLayout() {
	const { isSignedIn, user } = useUser();
    
	const fetchAndRedirectUser = async () => {
		if (isSignedIn) {
			const email = user?.primaryEmailAddress?.emailAddress;
			try {
				const url = `http://localhost:8000/api/get-usertype/?email=${email}`;
				const response = await axios.get(url);
				const usertype = response.data.usertype;

                const redirectMap: { [key: string]: string } = {
					admin: "http://admin.localhost:5173/",
                    candidate: "http://localhost:5173/login"
				};

				if (redirectMap[usertype]) {
					window.location.href = redirectMap[usertype];
				}

			} catch (error) {
				console.error("Error fetching user type:", error);
			}
		}
	};

	// useEffect(() => {
	// 	fetchAndRedirectUser();
	// }, [isSignedIn, user]);

	return (
		<div>
			<RecruiterNavbar />
			<Outlet />
		</div>
	);
}
