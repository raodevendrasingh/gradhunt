import { Routes, Route } from "react-router-dom";

// pages
import CandidateLayout from "@/pages/candidate/CandidateLayout";
import JobsFeed from "@/pages/candidate/JobsFeed";
import JobSearch from "@/pages/candidate/JobSearch";
import SignUpPage from "@/pages/candidate/auth/SignUpPage";
import SignInPage from "@/pages/candidate/auth/SignInPage";
import { LandingPage } from "@/pages/common/Landing";
import { NotFound } from "@/pages/common/NotFound";
import { StandardUserProfile } from "@/pages/candidate/StandardUserProfile";
import SpecialUserProfile from "@/pages/candidate/SpecialUserProfile";

export const CandidateRoutes: React.FC = () => {
	return (
		<Routes>
			<Route element={<CandidateLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />
				<Route path="/job-search" element={<JobSearch />} />
				<Route path="/companies" element={<NotFound />} />
				<Route path="/pricing" element={<NotFound />} />
				<Route path="/job-search/:id" element={<JobsFeed />} />
				<Route path="/profile/:username" element={<StandardUserProfile />} />
				<Route path="/:username" element={<SpecialUserProfile />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
};
