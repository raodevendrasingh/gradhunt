import { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import AppLayout from "@/pages/core/AppLayout";
import LandingPage from "@/pages/common/Landing";
import SignInPage from "@/pages/core/auth/SignInPage";
import SignUpPage from "@/pages/core/auth/SignUpPage";
import NotFound from "@/pages/common/NotFound";
import JobSearchPage from "../JobSearchPage";
import JobsFeedPage from "../JobsFeedPage";

// Route Groups
import RecruiterRoutes from "./RecruiterRoutes";
import CandidateRoutes from "./CandidateRoutes";

export default function AppRoutes(): ReactNode {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />

				<Route path="job-search" element={<JobSearchPage />} />
				<Route path="job-search/:params" element={<JobsFeedPage />} />

				{/* Modularized Routes */}
				<Route path="/company/:companyname/*" element={<RecruiterRoutes />} />
				<Route path="/*" element={<CandidateRoutes />} />

				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
