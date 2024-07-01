import React from "react";
import ReactDOM from "react-dom/client";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { ThemeProvider } from "@material-tailwind/react";
import App from "./App.jsx";
import { Toaster } from "sonner";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
        <Toaster position="top-right" richColors/>
		<KindeProvider
			clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
			domain={import.meta.env.VITE_KINDE_DOMAIN}
			redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
			logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URI}
		>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</KindeProvider>
	</React.StrictMode>
);
