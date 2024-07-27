// from react
import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/App";
import "@/index.css";

// library
import { Toaster } from "sonner";

declare global {
	interface ImportMeta {
		env: {
			VITE_CLERK_PUBLISHABLE_KEY: string;
		};
	}
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Toaster position="top-right" richColors />
		<App />
	</React.StrictMode>
);
