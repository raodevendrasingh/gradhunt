// from react
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";

// external packages
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import {
	RouteObject,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";

// local imports
import { AdminRoutes } from "./pages/admin/AdminRoutes";
import { RecruiterRoutes } from "./pages/recruiter/RecruiterRoutes";
import AppRoutes from "./pages/core/AppRoutes";
import NotFound from "./pages/common/NotFound";

declare global {
	interface ImportMeta {
		env: {
			VITE_CLERK_PUBLISHABLE_KEY: string;
			NODE_ENV: string;
			VITE_BASE_URL: string;
			VITE_BASE_ADMIN_URL: string;
			VITE_BASE_RECRUITER_URL: string;
			VITE_RAPID_API_KEY: string;
			VITE_RAPID_API_HOST: string;
		};
	}
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

const subdomain = window.location.hostname.split(".")[0];
let routes: RouteObject[];

if (subdomain === "localhost") {
	routes = [{ path: "/*", element: <AppRoutes /> }];
} else if (subdomain === "admin") {
	routes = [{ path: "/*", element: <AdminRoutes /> }];
} else {
	routes = [{ path: "*", element: <NotFound /> }];
}

// else if (subdomain === "hire") {
// 	routes = [{ path: "/*", element: <RecruiterRoutes /> }];
// }

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<Toaster position="bottom-right" />
			<RouterProvider router={router} />
		</ClerkProvider>
	</React.StrictMode>
);
