import { Route, Routes } from "react-router-dom";

import { UserSettings } from "./UserSettings";
import { Experience } from "./Experience";
import { Education } from "./Education";
import { CompanyProfile } from "./CompanyProfile";
import { Updates } from "./components/layouts/Updates";
import { ProfileLayout } from "./ProfileLayout";
import { RecruiterProfileView } from "./ProfileView";

export const ProfileRoutes = () => {
	return (
		<Routes>
			<Route element={<ProfileLayout />}>
				<Route path="/" element={<RecruiterProfileView/>} />
				<Route path="company-profile" element={<CompanyProfile />} />
				<Route path="experience" element={<Experience />} />
				<Route path="education" element={<Education />} />
				<Route path="updates" element={<Updates />} />
				<Route path="settings" element={<UserSettings />} />
			</Route>
		</Routes>
	);
};
