import { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";

// pages
import SignUpPage from "@/pages/core/auth/SignUpPage";
import SignInPage from "@/pages/core/auth/SignInPage";
import LandingPage from "@/pages/common/Landing";
import StandardProfileLayout from "./StandardProfileLayout";
import StandardUserProfile from "./StandardUserProfile";
import JobSearchPage from "./JobSearchPage";
import JobsFeedPage from "./JobsFeedPage";
import NotFound from "@/pages/common/NotFound";
import SpecialUserProfile from "@/pages/core/SpecialUserProfile";
import FeedPostsPage from "./FeedPostsPage";
import ProjectShowcasePage from "./ProjectShowcasePage";
import NewsFeedPage from "./NewsFeedPage";
import AppLayout from "@/pages/core/AppLayout";

export default function AppRoutes(): ReactNode {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login/*" element={<SignInPage />} />
				<Route path="/signup/*" element={<SignUpPage />} />
				<Route path="/*" element={<StandardProfileLayout />}>
					<Route path="posts" element={<FeedPostsPage />} />
					<Route path="job-search" element={<JobSearchPage />} />
					<Route path="job-search/:params" element={<JobsFeedPage />} />
					<Route path="news-feed" element={<NewsFeedPage />} />
					<Route path="showcase" element={<ProjectShowcasePage />} />
					<Route path="p/:username" element={<StandardUserProfile />} />
				</Route>
				<Route path="/s/:username" element={<SpecialUserProfile />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
