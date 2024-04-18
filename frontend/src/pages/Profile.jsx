import { useRoutes } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Profile/Sidebar";
import { UserSettings } from '../components/Profile/UserSettings';
import { Dashboard } from '../components/Profile/Dashboard';
import { JobPostings } from '../components/Profile/manager/JobPostings';
import { CandidatesPool } from '../components/Profile/manager/CandidatesPool';
import { InterviewsScheduled } from '../components/Profile/manager/InterviewsScheduled';
import { Reports } from '../components/Profile/manager/Reports';
import { Inbox } from '../components/Profile/Inbox';

export const Profile = () => {
    let routes = useRoutes([
        { path: '/', element: <Dashboard/> },
        { path: 'postings', element: <JobPostings/>},
        { path: '/candidates', element: <CandidatesPool/>},
        { path: 'interviews', element: <InterviewsScheduled/>},
        { path: 'reports', element: <Reports/>},
        { path: 'inbox', element: <Inbox/> },
        { path: 'settings', element: <UserSettings/> },
        // ... other routes
    ]);
	return (
		<>
			<Navbar />
			<Sidebar />
            {routes}
		</>
	);
};
