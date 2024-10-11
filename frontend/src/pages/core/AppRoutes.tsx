import { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";

// pages
import AppLayout from "@/pages/core/AppLayout";
import LandingPage from "@/pages/common/Landing";
import SignInPage from "@/pages/core/auth/SignInPage";
import SignUpPage from "@/pages/core/auth/SignUpPage";
import StandardUserProfile from "./StandardUserProfile";
import JobSearchPage from "./JobSearchPage";
import JobsFeedPage from "./JobsFeedPage";
import JobApplicationsPage from "./JobApplicationPage";
import SavedJobsPage from "./SavedJobsPage";
import StandardProfileLayout from "./StandardProfileLayout";
import SettingsPage from "./SettingsPage";
import SpecialUserProfile from "@/pages/core/SpecialUserProfile";
import NotFound from "@/pages/common/NotFound";
import OnboardingPage from "./OnboardingPage";
import SalariesPage from "./SalariesPage";
import CompanyProfileForm from "./CompanyProfileForm";
import CompanyProfile from "./CompanyProfile";
import { JobPostingForm } from "./JobPostingForm";

export default function AppRoutes(): ReactNode {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />
				<Route path="/onboarding" element={<OnboardingPage />} />
				<Route path="/*" element={<StandardProfileLayout />}>
					<Route path="job-search" element={<JobSearchPage />} />
					<Route path="job-search/:params" element={<JobsFeedPage />} />
					<Route path="job-applications" element={<JobApplicationsPage />} />
					<Route path="jobs-saved" element={<SavedJobsPage />} />
					<Route path="salaries" element={<SalariesPage />} />
					<Route path="p/:username" element={<StandardUserProfile />} />
					<Route path="create-company-profile" element={<CompanyProfileForm />} />
					<Route path="create-job-post" element={<JobPostingForm/>} />
					<Route path="company/:companyname" element={<CompanyProfile />} />
					<Route path="settings" element={<SettingsPage />} />
				</Route>
				<Route path="/s/:username" element={<SpecialUserProfile />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
