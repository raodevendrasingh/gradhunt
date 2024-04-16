import { useRoutes } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { UserSettings } from './UserSettings';

export const Profile = () => {
    let routes = useRoutes([
        { path: '/', element: <div >Profile</div> },
        { path: 'settings', element: <UserSettings/> },
        { path: 'notifications', element: <div>Notifications</div> },
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
