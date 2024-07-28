// from react
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";

// external packages
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

// local imports
import { AdminRoutes } from "./pages/admin/AdminRoutes";
import { RecruiterRoutes } from "./pages/recruiter/RecruiterRoutes";
import { CandidateRoutes } from "./pages/candidate/CandidateRoutes";
import { NotFound } from "./pages/common/NotFound";

declare global {
	interface ImportMeta {
		env: {
			VITE_CLERK_PUBLISHABLE_KEY: string;
            NODE_ENV: string;
		};
	}
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

const subdomain = window.location.hostname.split(".")[0];
let routes : RouteObject[];

if (subdomain === "localhost") {
    routes = [{ path: "/*", element: <CandidateRoutes /> }];
} else if (subdomain === "admin") {
    routes = [{ path: "/*", element: <AdminRoutes /> }];
} else if (subdomain === "recruiter") {
    routes = [{ path: "/*", element: <RecruiterRoutes /> }];
} else {
    routes = [{ path: "*", element: <NotFound /> }];
}

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<Toaster position="top-right" richColors />
			<RouterProvider router={router} />
		</ClerkProvider>
	</React.StrictMode>
);
