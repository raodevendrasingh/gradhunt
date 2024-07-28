// src/routes/recruiterRoutes.js
import { Routes, Route } from "react-router-dom";
import { RecruiterLayout } from "./RecruiterLayout";
import { RecruiterDashboard } from "./RecruiterDashboard";
import { JobPostings } from "./JobPostings";
import { NotFound } from "@/pages/common/NotFound";
import { RecruiterView } from "./RecruiterView";
import { ProfileRoutes } from "./ProfileRoutes";

export const RecruiterRoutes: React.FC = () => (
	<Routes>
		<Route element={<RecruiterLayout />}>
			<Route path="/" element={<RecruiterView />} />
			<Route path="/dev1618/*" element={<ProfileRoutes />} />			{/* replace with username field, fetch on login */}
			<Route path="/dashboard" element={<RecruiterDashboard />} />
			<Route path="/jobs-posted" element={<JobPostings />} />
			<Route path="*" element={<NotFound />} />
		</Route>
	</Routes>
);
