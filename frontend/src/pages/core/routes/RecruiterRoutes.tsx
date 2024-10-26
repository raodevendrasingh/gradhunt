import { Route, Routes } from "react-router-dom";
import RecruiterLayout from "@/pages/core/RecruiterLayout";
import CompanyProfile from "@/pages/core/company-pages/CompanyProfile";
import { JobDetailsPage } from "@/pages/core/JobDetailsPage";
import { JobPostingForm } from "@/pages/core/JobPostingForm";
import { SuccessJobPage } from "@/pages/core/company-pages/SuccessJobPage";
import ManageJobPost from "@/pages/core/company-pages/ManageJobPostings";
import { ManageJobDetails } from "@/pages/core/ManageJobDetails";
import ManageApplicants from "@/pages/core/company-pages/ManageApplicants";
import JobApplicantsPage from "@/pages/core/company-pages/JobApplicants";
import ArchivedPostings from "@/pages/core/company-pages/ArchivedPostings";
import AnalyticsPage from "@/pages/core/company-pages/Analytics";
import TeamsPage from "@/pages/core/company-pages/TeamsPage";
import Integrations from "@/pages/core/company-pages/Integrations";
import Settings from "@/pages/core/company-pages/SettingsPage";
import NotFound from "@/pages/common/NotFound";

export default function RecruiterRoutes() {
	return (
		<Routes>
			<Route element={<RecruiterLayout />}>
				<Route path="" element={<CompanyProfile />} />
				<Route path="job/:jobId" element={<JobDetailsPage />} />
				<Route path="manage-jobs/post" element={<JobPostingForm />} />
				<Route path="manage-jobs/post/success" element={<SuccessJobPage />} />
				<Route path="manage-jobs" element={<ManageJobPost />} />
				<Route path="manage-job/:jobId" element={<ManageJobDetails />} />
				<Route path="manage-job/:jobId/edit" element={<ManageJobDetails />} />
				<Route path="applicants" element={<ManageApplicants />} />
				<Route path="applicants/:jobId" element={<JobApplicantsPage />} />
				<Route path="archived" element={<ArchivedPostings />} />
				<Route path="analytics" element={<AnalyticsPage />} />
				<Route path="team" element={<TeamsPage />} />
				<Route path="integrations" element={<Integrations />} />
				<Route path="settings" element={<Settings />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
