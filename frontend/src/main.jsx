// from react
import React from "react";
import ReactDOM from "react-dom/client";

// provider
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { ThemeProvider } from "@material-tailwind/react";

import App from "@/App.jsx";
import "@/index.css";

// library
import { Toaster } from "sonner";

const getRedirectUri = () => {
	const hostname = window.location.hostname;
	if (hostname.startsWith("admin.")) {
		return "http://admin.localhost:5173/dashboard";
	} else if (hostname.startsWith("recruiter.")) {
		return "http://recruiter.localhost:5173/dashboard";
	}
	return "http://localhost:5173/";
};

const redirectUri = getRedirectUri();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Toaster position="top-right" richColors />
		<KindeProvider
			clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
			domain={import.meta.env.VITE_KINDE_DOMAIN}
			redirectUri={redirectUri}
			logoutUri={redirectUri.replace("/dashboard", "/")}
			isDangerouslyUseLocalStorage={true}
			// useSecureCookies={true}
			// persistToken={true}
			// cookieOptions={{
			// 	maxAge: 1296000, // Match refresh token expiry (15 days in seconds)
			// 	secure: true,
			// 	sameSite: "strict",
			// }}
		>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</KindeProvider>
	</React.StrictMode>
);
