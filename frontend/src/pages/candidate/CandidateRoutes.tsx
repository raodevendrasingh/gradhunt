// src/routes/candidateRoutes.js
import { Routes, Route } from "react-router-dom";
import CandidateLayout from "./CandidateLayout";

import { Jobs } from "@/pages/candidate/Jobs";

// import { LoginPage } from "./auth/SignInPage";
import { SignUpPage } from "./auth/SignUpPage";
import { LandingPage } from "../common/Landing";
import { NotFound } from "../common/NotFound";
import { SignInPage } from "./auth/SignInPage";
import HomeFeed from '@/pages/candidate/HomeFeed'

export const CandidateRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<CandidateLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<SignInPage />} />
                <Route path="/signup/*" element={<SignUpPage />} />
                <Route path="/feed" element={<HomeFeed />} />
                {/* <Route path="/{username}" element={<UserProfile/>} /> */}
                <Route path="/jobs" element={<Jobs />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};