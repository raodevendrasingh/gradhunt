import { Outlet } from "react-router-dom";
import { Header } from "@/components/common/Header";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

export default function CandidateLayout() {

	return (
		<main>
			<Header />
			<Outlet />
		</main>
	);
}
