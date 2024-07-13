// external libs
import { useNavigate, useRoutes } from "react-router-dom";

// hooks
import { useEffect } from "react";

// context
import { useStore } from "@/store/userStore";

// componenets
import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import { UserSettings } from "@/components/layouts/UserSettings";
import { Dashboard } from "@/pages/candidate/Dashboard";
import { JobPostings } from "@/pages/recruiter/components/JobPostings";
import { CandidatesPool } from "@/pages/recruiter/components/CandidatesPool";
import { InterviewsScheduled } from "@/pages/recruiter/components/InterviewsScheduled";
import { Reports } from "@/pages/recruiter/components/Reports";
import { Inbox } from "@/pages/recruiter/components/Inbox";

export const Profile = () => {
	const { userName } = useStore();
	const navigate = useNavigate();

	let routes = useRoutes([
		{ path: "/", element: <Dashboard /> },
		{ path: "postings", element: <JobPostings /> },
		{ path: "/candidates", element: <CandidatesPool /> },
		{ path: "interviews", element: <InterviewsScheduled /> },
		{ path: "reports", element: <Reports /> },
		{ path: "inbox", element: <Inbox /> },
		{ path: "settings", element: <UserSettings /> },
	]);

	useEffect(() => {
		if (!userName) {
			navigate("/");
		}
	}, [userName, navigate]);

	return (
		<div className="bg-gray-100">
			<Header />
			<Sidebar />
			{routes}
		</div>
	);
};
