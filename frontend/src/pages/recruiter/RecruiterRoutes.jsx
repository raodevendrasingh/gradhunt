// src/routes/recruiterRoutes.js
import { Routes, Route } from "react-router-dom";
import { RecruiterLayout } from "@/pages/recruiter/RecruiterLayout";
import { RecruiterDashboard } from "@/pages/recruiter/Dashboard";
import { JobsPosted } from "@/pages/recruiter/JobsPosted";
import { NotFound } from "../common/NotFound";
import { RecruiterView } from "./RecruiterView";

export const RecruiterRoutes = () => (
	<Routes>
		<Route element={<RecruiterLayout />}>
			<Route path="/" element={<RecruiterView />} />
			<Route path="/dashboard" element={<RecruiterDashboard />} />
			<Route path="/jobs-posted" element={<JobsPosted />} />
			<Route path="*" element={<NotFound/> } />
			{/* Add more recruiter routes as needed */}
		</Route>
	</Routes>
);
