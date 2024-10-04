// from react
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";

// external packages
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	RouteObject,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";

// local imports
import { AdminRoutes } from "./pages/admin/AdminRoutes";
import AppRoutes from "./pages/core/AppRoutes";
import NotFound from "./pages/common/NotFound";

declare global {
	interface ImportMeta {
		env: {
			VITE_CLERK_PUBLISHABLE_KEY: string;
			NODE_ENV: string;
            VITE_API_URL: string;
            VITE_HOST: string;
			VITE_BASE_URL: string;
			VITE_BASE_ADMIN_URL: string;
			VITE_BASE_RECRUITER_URL: string;
			VITE_RAPID_API_KEY: string;
			VITE_RAPID_API_HOST: string;
			VITE_FIREBASE_API_KEY: string;
			VITE_FIREBASE_AUTH_DOMAIN: string;
			VITE_FIREBASE_PROJECT_ID: string;
			VITE_FIREBASE_STORAGE_BUCKET: string;
			VITE_FIREBASE_MESSAGING_SENDER_ID: string;
			VITE_FIREBASE_APP_ID: string;
			VITE_FIREBASE_MEASUREMENT_ID: string;
		};
	}
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

const subdomain = window.location.hostname.split(".")[0];
let routes: RouteObject[];

const host = import.meta.env.VITE_HOST;

if (subdomain === host) {
	routes = [{ path: "/*", element: <AppRoutes /> }];
} else if (subdomain === "admin") {
	routes = [{ path: "/*", element: <AdminRoutes /> }];
} else {
	routes = [{ path: "*", element: <NotFound /> }];
}


const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
				<Toaster position="bottom-right" />
				<RouterProvider router={router} />
			</ClerkProvider>
		</QueryClientProvider>
	</StrictMode>
);
