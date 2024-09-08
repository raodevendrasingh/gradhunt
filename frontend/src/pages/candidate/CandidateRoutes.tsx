import { Routes, Route } from "react-router-dom";

// pages
import CandidateLayout from "./CandidateLayout";
import JobsFeed from "@/pages/candidate/JobsFeed";
import UserProfile from "./UserProfile";
import JobSearch from "@/pages/candidate/JobSearch";
import SignUpPage from "./auth/SignUpPage";
import SignInPage from "./auth/SignInPage";
import { LandingPage } from "../common/Landing";
import { NotFound } from "../common/NotFound";

export const CandidateRoutes: React.FC = () => {

	return (
		<Routes>
			<Route element={<CandidateLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />
				<Route path="/job-search" element={<JobSearch />} />
				<Route path="/job-search/:id" element={<JobsFeed />} />
				<Route path="/:username" element={<UserProfile />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
};
