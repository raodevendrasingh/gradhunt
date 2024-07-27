import { BrowserRouter } from "react-router-dom";
import { CandidateRoutes } from "@/pages/candidate/CandidateRoutes";
import { RecruiterRoutes } from "@/pages/recruiter/RecruiterRoutes";
import { AdminRoutes } from "@/pages/admin/AdminRoutes";

const App = () => {
	const host = window.location.hostname;

	let subdomain: string;
	const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);

	if (arr.length > 0) subdomain = arr[0];

	const getRoutes = () => {
		switch (subdomain) {
			case "recruiter":
				return <RecruiterRoutes />;
			case "admin":
				return <AdminRoutes />;
			default:
				return <CandidateRoutes />;
		}
	};
	return (
		<>
			<BrowserRouter>{getRoutes()}</BrowserRouter>
		</>
	);
};

export default App;
