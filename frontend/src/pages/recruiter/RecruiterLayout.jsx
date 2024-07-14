import { Outlet } from "react-router-dom";
import { RecruiterNavbar } from "./components/ui/RecruiterNavbar";

export const RecruiterLayout = () => {
	return (
		<div>
			<RecruiterNavbar/>
			<Outlet /> {/* This is where child routes will render */}
		</div>
	);
};
