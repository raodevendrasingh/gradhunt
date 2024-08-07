import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

// pages
import CandidateLayout from "./CandidateLayout";
import { Jobs } from "@/pages/candidate/Jobs";
import { SignUpPage } from "./auth/SignUpPage";
import { LandingPage } from "../common/Landing";
import { NotFound } from "../common/NotFound";
import { SignInPage } from "./auth/SignInPage";
import HomeFeed from '@/pages/candidate/HomeFeed'
import UserProfile from "./UserProfile";

export const CandidateRoutes: React.FC = () => {
    const { isSignedIn, user } = useUser();

    const profilePath = isSignedIn ? user?.username : "user"

    return (
        <Routes>
            <Route element={<CandidateLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<SignInPage />} />
                <Route path="/signup/*" element={<SignUpPage />} />
                <Route path="/feed" element={<HomeFeed />} />
                <Route path={`/${profilePath}`} element={<UserProfile />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};