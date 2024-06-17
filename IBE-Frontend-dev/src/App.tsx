import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/common/Footer/Footer";
import { Header } from "./components/common/Header/Header";
import "./App.css";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { RoomResults } from "./components/RoomResultsPage/RoomResults";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import CheckoutPage from "./Checkout/CheckoutPage";
import EmailFeedback from "./components/FeedBack/EmailFeedback";
import Booking from "./components/MyBookings/Booking";
import AllBookings from "./components/MyBookings/AllBookings";

function App({ msalInstance }: { msalInstance: PublicClientApplication }) {

	return (
		<MsalProvider instance={msalInstance}>
			<BrowserRouter>
				<div className="app-container">
					<Header />
					<div className="content">
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/search" element={<RoomResults />} />
							<Route path="/checkout" element={<CheckoutPage />} />
							<Route path="/feedback" element={<EmailFeedback />} />
							<Route path="/booking" element={<Booking />} />
							<Route path="/mybooking" element={<AllBookings />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</BrowserRouter>
		</MsalProvider>
	);
}

export default App;
