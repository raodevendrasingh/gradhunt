import AppLayout from '@/pages/core/AppLayout';
import CandidateRoutes from '@/pages/core/routes/CandidateRoutes';
import JobSearchPage from '@/pages/core/JobSearchPage';
import JobsFeedPage from '@/pages/core/JobsFeedPage';
import LandingPage from '@/pages/common/Landing';
import NotFound from '@/pages/common/NotFound';
import OnboardingPage from '@/pages/core/OnboardingPage';
import RecruiterRoutes from '@/pages/core/routes/RecruiterRoutes';
import SignInPage from '@/pages/core/auth/SignInPage';
import SignUpPage from '@/pages/core/auth/SignUpPage';
import { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';

export default function AppRoutes(): ReactNode {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />
				<Route path="/onboarding" element={<OnboardingPage />} />

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
