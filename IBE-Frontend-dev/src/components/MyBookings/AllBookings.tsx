import React, { useEffect, useState } from "react";
import "./AllBookings.scss";
import Vector from "../../assets/Vector.png";
import { Link } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { selectCurrency } from "../redux/slice/languageSlice";

function MyBookings() {
	const [allBookings, setAllBookings] = useState([]);
	const [loading, setLoading] = useState(true);

	const roomImageLinks = {
		GRAND_DELUXE:
			"https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		SUPER_DELUXE:
			"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJvb218ZW58MHx8MHx8fDA%3D",
		FAMILY_DELUXE:
			"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJvb218ZW58MHx8MHx8fDA%3D",
		STANDARD_ROOM:
			"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		EXECUTIVE_ROOM:
			"https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
		LUXURY_SUITE:
			"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
	};

	const email = useSelector((state: RootState) => state.auth.username);
	const storedUsername = localStorage.getItem("username");

	useEffect(() => {
		const fetchPurchases = async () => {
			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/purchases"
				);
				if (response.ok) {
					const data = await response.json();
					const bookingsByEmail = data.filter(
						(item) =>
							item.travelemail === (storedUsername ? storedUsername : email)
					);
					setAllBookings(bookingsByEmail);
					setLoading(false);
				} else {
					console.error("Failed to fetch purchases:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching purchases:", error);
			}
		};
		fetchPurchases();
	}, []);

	const selectedCurrency = useSelector(selectCurrency);
	const [exchangeRate, setExchangeRate] = useState<number>(1);
	useEffect(() => {
		const fetchExchangeRate = async () => {
			try {
				if (selectedCurrency !== "USD") {
					const response = await fetch(
						`https://api.frankfurter.app/latest?from=USD&to=${selectedCurrency}`
					);
					if (!response.ok) {
						throw new Error("Failed to fetch exchange rate");
					}
					const data = await response.json();
					const exchangeRate = data.rates[selectedCurrency];
					setExchangeRate(exchangeRate);
				} else {
					setExchangeRate(1);
				}
			} catch (error) {
				console.error("Error fetching exchange rate:", error);
			}
		};

		fetchExchangeRate();
	}, [selectedCurrency]);

	return (
		<div className="reservations-details">
			{loading ? (
				<div className="loader-container">
					<CircularProgress size={100} thickness={3} />
				</div>
			) : allBookings.length === 0 ? (
				<div className="no-bookings-message">No Bookings Found !!</div>
			) : (
				allBookings.map((booking, index) => (
					<Link
						to={`/booking?bookingId=${booking.bookingId}`}
						key={index}
						className="link-no-style"
					>
						<div className="booking" key={index}>
							<div className="booked-room-details">
								<div className="roomtype-cancel">
									<div style={{ display: "flex" }}>
										<div className="room-type-name">
											Room {index + 1}: {booking.roomname}
										</div>
										<div className="room-member-count">
											<div>
												<img
													src={Vector}
													alt="vector icon"
													style={{ width: "16px", height: "16px" }}
												/>
											</div>
											<div className="guest-count">
												{booking.adultCount} adults,&nbsp;{booking.childCount}{" "}
												child
											</div>
										</div>
									</div>
								</div>
								<div className="booked-room-details">
									<div className="room-img">
										<img
											src={
												roomImageLinks[booking.roomname] ||
												roomImageLinks.GRAND_DELUXE
											}
											alt="room-img"
											style={{ width: "100%" }}
										/>
									</div>
									<div className="booked-room-info">
										<div className="check-date">
											<Box
												height={70}
												width={70}
												my={4}
												gap={4}
												p={2}
												sx={{
													border: "1px solid #858685",
													borderRadius: "5px",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													margin: "0px",
													marginRight: "8px",
												}}
											>
												<div>
													<div
														style={{
															color: "#5D5D5D",
															position: "relative",
															left: "5px",
														}}
													>
														Check&nbsp;in
													</div>
													<div
														style={{
															display: "flex",
															flexDirection: "column",
															alignItems: "center",
															marginTop: "5px",
														}}
													>
														<div
															style={{
																marginBottom: "7px",
																fontWeight: "700",
															}}
														>
															{booking?.startDate &&
																new Date(booking?.startDate).getDate()}
														</div>
														<div>
															{booking?.startDate &&
																new Date(booking?.startDate).toLocaleDateString(
																	"en-US",
																	{
																		month: "short",
																		year: "numeric",
																	}
																)}
														</div>
													</div>
												</div>
											</Box>
											<Box
												height={70}
												width={70}
												my={4}
												gap={4}
												p={2}
												sx={{
													border: "1px solid #858685",
													borderRadius: "5px",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													margin: "0px",
												}}
											>
												<div>
													<div
														style={{
															color: "#5D5D5D",
															position: "relative",
															left: "5px",
														}}
													>
														Check&nbsp;out
													</div>
													<div
														style={{
															display: "flex",
															flexDirection: "column",
															alignItems: "center",
															marginTop: "5px",
														}}
													>
														<div
															style={{
																marginBottom: "7px",
																fontWeight: "700",
															}}
														>
															{booking?.endDate &&
																new Date(booking?.endDate).getDate()}
														</div>
														<div>
															{booking?.endDate &&
																new Date(booking?.endDate).toLocaleDateString(
																	"en-US",
																	{
																		month: "short",
																		year: "numeric",
																	}
																)}
														</div>
													</div>
												</div>
											</Box>
										</div>
										<div className="room-package">
											<div className="package-name">
												{selectedCurrency === "USD"
													? `$${(
															booking.totalPrice * booking.promotionPriceFactor
													  ).toFixed(2)}`
													: selectedCurrency === "EUR"
													? `€${(
															booking.totalPrice *
															booking.promotionPriceFactor *
															exchangeRate
													  ).toFixed(2)}`
													: selectedCurrency === "GBP"
													? `£${(
															booking.totalPrice *
															booking.promotionPriceFactor *
															exchangeRate
													  ).toFixed(2)}`
													: `${(
															booking.totalPrice *
															booking.promotionPriceFactor *
															exchangeRate
													  ).toFixed(2)} ${selectedCurrency}`}
												&nbsp;
												{booking.promotionTitle}
											</div>
											<div className="package-desc">
												{booking.promotionDescription}
											</div>
										</div>
										<div className="policy">
											<div className="cancellation-policy">
												Copy explaining the cancellation policy, if applicable
											</div>
											<div className="total-price">
												{selectedCurrency === "USD"
													? `$${booking.nightlyRate.toFixed(2)}`
													: selectedCurrency === "EUR"
													? `€${(booking.nightlyRate * exchangeRate).toFixed(
															2
													  )}`
													: selectedCurrency === "GBP"
													? `£${(booking.nightlyRate * exchangeRate).toFixed(
															2
													  )}`
													: `${(booking.nightlyRate * exchangeRate).toFixed(
															2
													  )} ${selectedCurrency}`}
												/night total
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="separator" />
						</div>
					</Link>
				))
			)}
		</div>
	);
}

export default MyBookings;
