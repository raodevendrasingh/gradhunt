import { Outlet } from "react-router-dom";

import RecruiterNavbar from "./components/ui/RecruiterNavbar";

export default function RecruiterLayout() {
	return (
		<div>
			<RecruiterNavbar />
			<Outlet />
		</div>
	);
}
