import { Outlet } from "react-router-dom";

export const RecruiterLayout = () => {
	return (
		<div>
			{/* Recruiter-specific header, nav, etc. */}
			<Outlet /> {/* This is where child routes will render */}
		</div>
	);
};
