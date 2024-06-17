import "./Booking.scss";
import Vector from "../../assets/Vector.png";
import "react-responsive-modal/styles.css";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	IconButton,
	Snackbar,
	Typography,
} from "@mui/material";
import { Modal } from "react-responsive-modal";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CloseIcon from "@mui/icons-material/Close";

import enMessages from "../locals/en.json";
import frMessages from "../locals/fr.json";
import hiMessages from "../locals/hi.json";
import { FormattedMessage, IntlProvider } from "react-intl";
import { selectStartDate } from "../redux/slice/searchSlice";
import { setPurchase } from "../redux/slice/PurchaseSlice";
import { selectCurrency } from "../redux/slice/languageSlice";

interface roomTotalSummary {
	nightlyRate: number;
	subtotal: number;
	taxAmount: number;
	vatAmount: number;
	totalAmount: number;
}

interface guestInformation {
	travelfirstName: string;
	travellastName: string;
	travelphone: number;
	travelemail: string;
}

interface BillingInformation {
	billingFirstName: string;
	billingLastName: string;
	address1: string;
	address2: string;
	country: string;
	state: string;
	city: string;
	zip: string;
	billingPhone: string;
	billingEmail: string;
}

interface CardDetails {
	cardNumber: string;
	expMonth: string;
	expYear: string;
}
const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

function Booking() {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const startDate = useSelector(selectStartDate);
	const contentRef = useRef(null);
	const roomImageLink =
		"https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

	const itinerayData = useSelector(
		(state: RootState) => state.selectedRoom.itinerary
	);

	const [purchases, setPurchases] = useState([]);

	const [, setRoomrateInfo] = useState<any>({});
	useEffect(() => {
		if (itinerayData) {
			setRoomrateInfo(itinerayData);
		}
	}, [itinerayData]);
	const dispatch = useDispatch();

	const searchParams = new URLSearchParams(window.location.search);
	const bookingParamId = searchParams.get("bookingId") || "";
	const bookingId = bookingParamId;
	const booking = purchases
		? purchases.find((item) => item.bookingId === bookingParamId)
		: null;

	const roomSummaryData: roomTotalSummary = {
		nightlyRate: booking?.nightlyRate || 0,
		subtotal: booking?.subtotal || 0,
		taxAmount: booking?.taxAmount || 0,
		vatAmount: booking?.vatAmount || 0,
		totalAmount: booking?.totalAmount || 0,
	};

	const guestInfo: guestInformation = {
		travelfirstName: booking?.travelfirstName,
		travellastName: booking?.travellastName,
		travelphone: booking?.travelphone,
		travelemail: booking?.travelemail,
	};

	const billingAddress: BillingInformation = {
		billingFirstName: booking?.billingfirstName || "",
		billingLastName: booking?.billinglastName || "",
		address1: booking?.address1 || "",
		address2: booking?.address2 || "",
		country: booking?.country || "",
		state: booking?.state || "",
		city: booking?.city || "",
		zip: booking?.zip || "",
		billingPhone: booking?.billingphone || "",
		billingEmail: booking?.billingemail || "",
	};

	const paymentInfo: CardDetails = {
		cardNumber: booking?.cardNumber || "",
		expMonth: booking?.expMonth || "",
		expYear: booking?.expYear || "",
	};

	useEffect(() => {
		const fetchPurchases = async () => {
			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/purchases"
				);
				if (response.ok) {
					const data = await response.json();
					setPurchases(data);
					dispatch(setPurchase(data));
				} else {
					console.error("Failed to fetch purchases:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching purchases:", error);
			}
		};
		fetchPurchases();
	}, []);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	const [roomExpanded, setRoomExpanded] = useState(false);
	const [guestExpanded, setGuestExpanded] = useState(false);
	const [billingExpanded, setBillingExpanded] = useState(false);
	const [paymentExpanded, setPaymentExpanded] = useState(false);

	const handlePrint = () => {
		setRoomExpanded(true);
		setGuestExpanded(true);
		setBillingExpanded(true);
		setPaymentExpanded(true);

		setTimeout(() => {
			window.print();
		}, 100);
	};

	const handleEmail = () => {
		const url = `https://team14-ibe-kdu24.azurewebsites.net/sendbookingemail?bookingId=${bookingParamId}`;
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (response.ok) {
					setSnackbarMessage("Email sent successfully");
					setSnackbarOpen(true);
				} else {
					console.error("Failed to send email");
				}
			})
			.catch((error) => {
				console.error("Error sending email:", error);
			});
	};

	const [otp, setOtp] = useState("");
	const [enteredOtp, setEnteredOtp] = useState("");

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [isRoomCancelled, setIsRoomCancelled] = useState(false);
	const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

	const handleCancelRoom = async () => {

		const currentDate: any = new Date();
		const differenceInDays = Math.ceil(
			(startDate - currentDate) / (1000 * 60 * 60 * 24)
		);
		let refundPercentage;
		if (differenceInDays > 2) {
			refundPercentage = 0.9;
		} else if (differenceInDays > 1) {
			refundPercentage = 0.5;
		} else {
			refundPercentage = 0.1;
		}
		const refundAmount = refundPercentage * 0.4 * (booking?.totalAmount || 0);

		if (!isLoggedIn) {
			openModal();
			setEnteredOtp("");
			try {
				const response = await fetch(
					`https://team14-ibe-kdu24.azurewebsites.net/sendotpemail?bookingId=${bookingParamId.toString()}`
				);
				const data = await response.text();
				setOtp(data);
				openModal();
			} catch (error) {
				console.error("Error fetching OTP:", error);
			}
		} else {
			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/cancel-booking",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							bookingId: bookingParamId.toString(),
							email: booking?.travelemail,
							totalAmount: refundAmount,
						}),
					}
				);
				if (response.ok) {
					setIsRoomCancelled(true);
				} else {
					console.error("Failed to cancel booking");
				}
			} catch (error) {
				console.error("Error cancelling booking:", error);
			}
		}
	};

	const handleConfirmOTP = async () => {
		if (!enteredOtp.trim()) {
			setSnackbarMessage("Please enter the OTP.");
			setSnackbarOpen(true);
			return;
		}

		if (enteredOtp === otp) {
			closeModal();
			setSnackbarMessage("Booking cancelled successfully.");
			setSnackbarOpen(true);
			setEnteredOtp("");
			setIsRoomCancelled(true);
			const currentDate: any = new Date();
			const differenceInDays = Math.ceil(
				(startDate - currentDate) / (1000 * 60 * 60 * 24)
			);
			let refundPercentage;
			if (differenceInDays > 2) {
				refundPercentage = 0.9;
			} else if (differenceInDays > 1) {
				refundPercentage = 0.5;
			} else {
				refundPercentage = 0.1;
			}
			const refundAmount = refundPercentage * 0.4 * (booking?.totalAmount || 0);

			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/cancel-booking",
					// `http://localhost:8081/cancel-booking?bookingId=${bookingParamId.toString()}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							bookingId: bookingParamId.toString(),
							email: booking?.travelemail,
							totalAmount: refundAmount,
						}),
					}
				);
				if (response.ok){
					setIsRoomCancelled(true);
				} else {
					console.error("Failed to cancel booking");
				}
			} catch (error) {
				console.error("Error cancelling booking:", error);
			}
		} else {
			setSnackbarMessage("Incorrect OTP. Please try again.");
			setSnackbarOpen(true);
			setError("Incorrect OTP. Please try again.");
		}
	};

	const handleSnackbarClose = (_event: any, reason: string) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbarOpen(false);
	};

	const handleOtpChange = (event: {
		target: { value: SetStateAction<string> };
	}) => {
		setEnteredOtp(event.target.value);
	};

	const maskCreditCardNumber = (creditCardNumber: string) => {
		const maskedDigits = creditCardNumber.substring(0, 4);
		const maskedRest = "X".repeat(12);
		return maskedDigits + maskedRest;
	};

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
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div ref={contentRef} className="booking-container">
				<div className="booking-options">
					<div
						className="upcoming-reservations"
						style={{ display: "flex", flexWrap: "wrap" }}
					>
						<FormattedMessage id="upcoming_reservation" />
						&nbsp; <div>{bookingId}</div>
					</div>
					<div className="print-email">
						<button
							onClick={handlePrint}
							style={{
								textDecoration: "none",
								color: "#006EFF",
								border: "none",
								outline: "none",
								background: "transparent",
								fontSize: "1.4rem",
								position: "relative",
								top: "4px",
								cursor: "pointer",
							}}
						>
							<FormattedMessage id="print" />
						</button>
						<button
							onClick={handleEmail}
							style={{
								textDecoration: "none",
								color: "#006EFF",
								marginRight: "13px",
								border: "none",
								outline: "none",
								background: "transparent",
								fontSize: "1.4rem",
								position: "relative",
								top: "4px",
								cursor: "pointer",
							}}
						>
							<FormattedMessage id="email" />
						</button>
					</div>
				</div>
				<div className="reservations-details">
					<div className="booked-room-details">
						<div className="roomtype-cancel">
							<div style={{ display: "flex" }}>
								<div className="room-type-name">
									<FormattedMessage id="room_1" /> : {""}
									{booking?.roomname}
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
										{booking?.adultCount} <FormattedMessage id="adults" />
										,&nbsp;{booking?.childCount} <FormattedMessage id="child" />
									</div>
								</div>
							</div>

							<div className="cancel-btn">
								{isRoomCancelled ? (
									<span style={{ color: "red", fontWeight: "bold" }}>
										<FormattedMessage id="cancelled" />
									</span>
								) : (
									<button
										onClick={handleCancelRoom}
										style={{
											textDecoration: "none",
											color: "#006EFF",
											border: "none",
											outline: "none",
											background: "transparent",
											fontSize: "1.2rem",
											position: "relative",
											top: "4px",
											cursor: "pointer",
										}}
									>
										<FormattedMessage id="cancel_room" />
									</button>
								)}
							</div>
						</div>
						<div className="booked-room-details">
							<div className="room-img">
								<img
									src={roomImageLink}
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
											fontSize: "99%",
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
												<FormattedMessage id="check_in" />
											</div>
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													marginTop: "5px",
													fontSize: "14px",
												}}
											>
												<div style={{ marginBottom: "7px", fontWeight: "700" }}>
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
												<FormattedMessage id="check_in" />
											</div>
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													marginTop: "5px",
													fontSize: "14px",
												}}
											>
												<div style={{ marginBottom: "7px", fontWeight: "700" }}>
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
													booking?.totalPrice * booking?.promotionPriceFactor
											  ).toFixed(2)}`
											: selectedCurrency === "EUR"
											? `€${(
													booking?.totalPrice *
													booking?.promotionPriceFactor *
													exchangeRate
											  ).toFixed(2)}`
											: selectedCurrency === "GBP"
											? `£${(
													booking?.totalPrice *
													booking?.promotionPriceFactor *
													exchangeRate
											  ).toFixed(2)}`
											: `${(
													booking?.totalPrice *
													booking?.promotionPriceFactor *
													exchangeRate
											  ).toFixed(2)} ${selectedCurrency}`}
										{/* {(
											booking?.totalPrice * booking?.promotionPriceFactor
										).toFixed(2)}{" "} */}
										&nbsp;
										{booking?.promotionTitle}
									</div>
									<div className="package-desc">
										{booking?.promotionDescription}
									</div>
								</div>
								<div className="policy">
									<div className="cancellation-policy">
										<FormattedMessage id="cancellation_policy" />
									</div>
									<div className="total-price">
										{selectedCurrency === "USD"
											? `$${booking?.nightlyRate.toFixed(2)}`
											: selectedCurrency === "EUR"
											? `€${(booking?.nightlyRate * exchangeRate).toFixed(2)}`
											: selectedCurrency === "GBP"
											? `£${(booking?.nightlyRate * exchangeRate).toFixed(2)}`
											: `${(booking?.nightlyRate * exchangeRate).toFixed(
													2
											  )} ${selectedCurrency}`}
										/<FormattedMessage id="night_total" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="user-side-details">
						<Accordion
							expanded={roomExpanded}
							onChange={() => setRoomExpanded(!roomExpanded)}
							square
							style={{
								backgroundColor: "white",
								borderTop: "1px solid #C1C2C2",
							}}
							disableGutters={true}
						>
							<AccordionSummary
								sx={{ flexDirection: "row-reverse" }}
								style={{ backgroundColor: "white" }}
								expandIcon={<ArrowDropDownIcon />}
							>
								<Typography style={{ fontWeight: "700" }}>
									<FormattedMessage id="room_total_summary" />
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography style={{ fontWeight: "700" }}>
									{Object.entries(roomSummaryData).map(([key, value]) => (
										<Typography
											key={key}
											style={{
												color: "#5D5D5D",
												display: "flex",
												justifyContent: "space-between",
												margin: "0px 10px",
											}}
										>
											<div>{key}</div>
											<div
												style={{
													color: "#000",
													fontWeight: "200",
													width: "60px",
												}}
											>
												{selectedCurrency === "USD"
													? `$${value.toFixed(2)}`
													: selectedCurrency === "EUR"
													? `€${(value * exchangeRate).toFixed(2)}`
													: selectedCurrency === "GBP"
													? `£${(value * exchangeRate).toFixed(2)}`
													: `${(value * exchangeRate).toFixed(
															2
													  )} ${selectedCurrency}`}
											</div>
										</Typography>
									))}
								</Typography>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={guestExpanded}
							onChange={() => setGuestExpanded(!guestExpanded)}
							square
							style={{
								backgroundColor: "white",
								borderTop: "1px solid #C1C2C2",
							}}
							disableGutters={true}
						>
							<AccordionSummary
								sx={{ flexDirection: "row-reverse" }}
								style={{ backgroundColor: "white" }}
								expandIcon={<ArrowDropDownIcon />}
							>
								<Typography style={{ fontWeight: "700" }}>
									<FormattedMessage id="guest_information" />
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography style={{ fontWeight: "700" }}>
									{Object.entries(guestInfo).map(([key, value]) => (
										<Typography
											key={key}
											style={{
												color: "#5D5D5D",
												display: "flex",
												justifyContent: "space-between",
												margin: "0px 10px",
											}}
										>
											<div>{key}</div>
											<div style={{ color: "#000", fontWeight: "200" }}>
												{value}
											</div>
										</Typography>
									))}
								</Typography>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={billingExpanded}
							onChange={() => setBillingExpanded(!billingExpanded)}
							square
							style={{
								backgroundColor: "white",
								borderTop: "1px solid #C1C2C2",
							}}
							disableGutters={true}
						>
							<AccordionSummary
								sx={{ flexDirection: "row-reverse" }}
								style={{ backgroundColor: "white" }}
								expandIcon={<ArrowDropDownIcon />}
							>
								<Typography style={{ fontWeight: "700" }}>
									<FormattedMessage id="billing_info" />
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography style={{ fontWeight: "700" }}>
									{Object.entries(billingAddress).map(([key, value]) => (
										<Typography
											key={key}
											style={{
												color: "#5D5D5D",
												display: "flex",
												justifyContent: "space-between",
												margin: "0px 10px",
											}}
										>
											<div>{key}</div>
											<div style={{ color: "#000", fontWeight: "200" }}>
												{value}
											</div>
										</Typography>
									))}
								</Typography>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={paymentExpanded}
							onChange={() => setPaymentExpanded(!paymentExpanded)}
							square
							style={{
								backgroundColor: "white",
								borderTop: "1px solid #C1C2C2",
							}}
							disableGutters={true}
						>
							<AccordionSummary
								sx={{ flexDirection: "row-reverse" }}
								style={{ backgroundColor: "white" }}
								expandIcon={<ArrowDropDownIcon />}
							>
								<Typography style={{ fontWeight: "700" }}>
									<FormattedMessage id="payment_information" />
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography style={{ fontWeight: "700" }}>
									{Object.entries(paymentInfo).map(([key, value]) => (
										<Typography
											key={key}
											style={{
												color: "#5D5D5D",
												display: "flex",
												justifyContent: "space-between",
												margin: "0px 10px",
											}}
										>
											<div>{key}</div>
											<div style={{ color: "#000", fontWeight: "200" }}>
												{key === "cardNumber"
													? maskCreditCardNumber(value)
													: value}
											</div>
										</Typography>
									))}
								</Typography>
							</AccordionDetails>
						</Accordion>
					</div>
				</div>

				{isModalOpen && (
					<Modal
						open={isModalOpen}
						onClose={closeModal}
						classNames={{ modal: "customModals" }}
					>
						<div className="room-cancel">
							<div className="title-otp">
								<FormattedMessage id="enterOTPCancelBooking" />
							</div>
							<div className="otp-verification">
								<label htmlFor="otp"></label>
								<input
									type="text"
									id="otp"
									name="otp"
									maxLength={6}
									className="otp-input"
									value={enteredOtp}
									onChange={handleOtpChange}
									style={{ paddingLeft: "10px" }}
								/>
							</div>
							<div className="confirm-btn">
								<Button
									variant="contained"
									sx={{ backgroundColor: "#26266d" }}
									onClick={handleConfirmOTP}
								>
									<FormattedMessage id="confirmOTP" />
								</Button>
							</div>
						</div>
					</Modal>
				)}

				<Snackbar
					open={snackbarOpen}
					autoHideDuration={1000}
					onClose={handleSnackbarClose}
					message={snackbarMessage}
					anchorOrigin={{ vertical: "center", horizontal: "center" }}
					action={
						<IconButton size="small" aria-label="close" color="inherit">
							<CloseIcon fontSize="small" />
						</IconButton>
					}
					ContentProps={{
						style: {
							backgroundColor: snackbarMessage.includes("success")
								? "#4CAF50"
								: "#F44336",
						},
					}}
				/>
			</div>
		</IntlProvider>
	);
}

export default Booking;

function setError(arg0: string) {
	throw new Error("Function not implemented.");
}
