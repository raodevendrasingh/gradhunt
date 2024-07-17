// base page of the recruiter profile

// external libs
import { useNavigate, Outlet } from "react-router-dom";

// componenets
import { RecruiterNavbar } from "./components/ui/RecruiterNavbar";
import { Sidebar } from "./components/ui/SideNav";

export const ProfileLayout = () => {
	return (
		<div className="bg-gray-100 w-full h-[100vh]">
			<RecruiterNavbar />
			<Sidebar />
			<Outlet />
		</div>
	);
};

// hooks
// import { useEffect } from "react";

// // context
// import { useStore } from "@/store/userStore";

// const { userName } = useStore();
// 	const navigate = useNavigate();

// let routes = useRoutes([
// 	{ path: "/", element: <RecruiterProfile /> },
// 	{ path: "postings", element: <JobPostings /> },
// 	{ path: "candidates", element: <CandidatesPool /> },
// 	{ path: "interviews", element: <InterviewsScheduled /> },
// 	{ path: "reports", element: <Reports /> },
// 	{ path: "inbox", element: <Inbox /> },
// 	{ path: "settings", element: <UserSettings /> },
// ]);

// useEffect(() => {
// 	if (!userName) {
// 		navigate("/");
// 	}
// }, [userName, navigate]);
