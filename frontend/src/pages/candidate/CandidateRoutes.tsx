import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// pages
import CandidateLayout from "./CandidateLayout";
import JobsFeed from "@/pages/candidate/JobsFeed";
import UserProfile from "./UserProfile";
import JobSearch from "@/pages/candidate/JobSearch";
import { SignUpPage } from "./auth/SignUpPage";
import { LandingPage } from "../common/Landing";
import { NotFound } from "../common/NotFound";
import { SignInPage } from "./auth/SignInPage";

export const CandidateRoutes: React.FC = () => {
	const { isSignedIn, user } = useUser();

	const profilePath = isSignedIn ? user?.username : "user";

	return (
		<Routes>
			<Route element={<CandidateLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />
				<Route path="/search" element={<JobSearch />} />
				<Route path={`/${profilePath}`} element={<UserProfile />} />
				<Route path="/jobs" element={<JobsFeed />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
};
