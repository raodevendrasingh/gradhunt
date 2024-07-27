// src/routes/candidateRoutes.js
import { Routes, Route } from "react-router-dom";
import { CandidateLayout } from "./CandidateLayout";

import { Jobs } from "@/pages/candidate/Jobs";

import { LoginPage } from "./auth/LoginPage";
import { SignUpPage } from "./auth/SignUpPage";
import { LandingPage } from "../common/Landing";
import { NotFound } from "../common/NotFound";

export const CandidateRoutes = () => (
	<Routes>
		<Route element={<CandidateLayout />}>
			<Route path="/" element={<LandingPage />} />
			<Route path="/jobs" element={<Jobs />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<NotFound/> } />
			{/* Add more candidate routes as needed */}
		</Route>
	</Routes>
);
