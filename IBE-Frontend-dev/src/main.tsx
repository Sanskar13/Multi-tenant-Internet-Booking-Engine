import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./components/redux/store.ts";
import { PublicClientApplication } from "@azure/msal-browser";
import React from "react";

const pca = new PublicClientApplication({
	auth: {
		clientId: "79c023a3-8de5-41e6-8620-1e007e1d7b1b",
		authority:
			"https://ibeTeam14.b2clogin.com/ibeTeam14.onmicrosoft.com/B2C_1_Team-14-SPA/",
		knownAuthorities: ["ibeTeam14.b2clogin.com"],
		redirectUri: "https://white-dune-044f84310.4.azurestaticapps.net/",
		postLogoutRedirectUri:
			"https://white-dune-044f84310.4.azurestaticapps.net/",
		navigateToLoginRequestUrl: false,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<App msalInstance={pca} />
		</Provider>
	</React.StrictMode>
);
