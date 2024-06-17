import { useEffect, useState } from "react";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useForm } from "react-hook-form";
import {
	Button,
	Link,
	MenuItem,
	Select,
	Snackbar,
	Switch,
	TextField,
} from "@mui/material";
import coinImage from "../assets/coin.png";

import { CircularProgress } from "@mui/material";
import ModalComponent from "./Terms&Conditions/TermsConditionsModal";
import StepperComponent from "../components/RoomResultsPage/Stepper/StepperComponent";
import ContactInfo from "../components/ContactInfo/ContactInfo";
import FeedbackInput from "../components/FeedBack/FeedbackInput";
import Itinerary from "../components/Itinerary/Itinerary";
import "./CheckoutPage.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	setBillingInfo,
	setPaymentInfo,
	setTravelerInfo,
} from "../components/redux/slice/CheckoutSlice";
import { v4 as uuidv4 } from "uuid";
import { Promotion } from "../components/redux/slice/promotionSlice";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { RootState } from "../components/redux/store";

import {
	selectEndDate,
	selectStartDate,
} from "../components/redux/slice/searchSlice";

import enMessages from "../components/locals/en.json";
import frMessages from "../components/locals/fr.json";
import hiMessages from "../components/locals/hi.json";
import { FormattedMessage, IntlProvider } from "react-intl";
import { selectCurrency } from "../components/redux/slice/languageSlice";
import {
	selectAmount,
	selectEmail,
} from "../components/redux/slice/totalSumSlice";

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

export default function CheckoutPage() {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const walletamount = useSelector(selectAmount);
	const amt = useSelector((state: RootState) => state.totalSum.amount);
	const walletemail = useSelector(selectEmail);

	const [isLoading, setIsLoading] = useState(false);
	const [, setFormData] = useState({});
	const [countryid, setCountryid] = useState("");
	const [countryname, setCountryname] = useState("");
	const [statename, setStatename] = useState("");
	const [cityname, setCityname] = useState("");
	const [stateid, setStateid] = useState("");
	const [cityid, setCityid] = useState("");
	const [countriesList, setCountriesList] = useState([]);
	const [stateList, setStateList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [redirect, setRedirect] = useState(false);
	const [timerCountdown, setTimerCountdown] = useState(600);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const startDate = useSelector(selectStartDate);
	const endDate = useSelector(selectEndDate);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onSubmit1 = (data) => {
		dispatch(setTravelerInfo(data.travelerInfo));
		handleNextButtonClick();
	};
	const onSubmit2 = async (data: any) => {
		if ((await validateZip(data.zip)) === "error") {
			return;
		}
		dispatch(setBillingInfo(data.billingInfo));

		handleNextButtonClick();
	};

	const onSubmit3 = (data) => {
		dispatch(setPaymentInfo(data.paymentInfo));

		handlePurchaseButtonClick(data);
	};
	useEffect(() => {
		return () => {
			setFormData({});
		};
	}, []);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	useEffect(() => {
		const timer = setTimeout(() => {
			setRedirect(true);
		}, 600000);

		const interval = setInterval(() => {
			setTimerCountdown((prevCountdown) => prevCountdown - 1);
		}, 1000);

		return () => {
			clearTimeout(timer);
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (redirect) {
			alert("Times Up: Redirecting to Home Page");
			navigate("/");
		}
	}, [redirect, navigate]);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [showTravelerInfo, setShowTravelerInfo] = useState(true);
	const [showBillingInfo, setShowBillingInfo] = useState(false);
	const [showPaymentInfo, setShowPaymentInfo] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [formattedCardNumber, setFormattedCardNumber] = useState("");

	const handleCardNumberChange = (e) => {
		const rawValue = e.target.value.replace(/[^0-9]/g, "");
		let formattedValue = "";
		for (let i = 0; i < rawValue.length; i++) {
			if (i > 0 && i % 4 === 0) {
				formattedValue += "-";
			}
			formattedValue += rawValue[i];
		}
		setFormattedCardNumber(formattedValue);
	};

	const validateZip = async (data: any) => {
		const zip = data;

		const results = await fetch(
			`https://app.zipcodebase.com/api/v1/search?apikey=889bbfe0-f346-11ee-a206-0125978d759f&codes=${data}`
		);

		const data2 = await results.json();

		const postalArray = data2.results;

		if (!postalArray || postalArray.length === 0) {
			showAlert("Invalid Zip Code", "error");

			return "error";
		}
		const stateFromZip = postalArray[zip][0].state;
		const cityFromZip = postalArray[zip][0].province;

		if (stateFromZip !== stateid || cityFromZip !== cityid) {
			showAlert("Invalid Zip Code", "error");

			return "error";
		}
		return "";
	};
	const travelerFormFields = [
		{ label: "First Name", name: "travelfirstName", type: "text" },
		{ label: "Last Name", name: "travellastName", type: "text" },
		{ label: "Phone", name: "travelphone", type: "tel" },
		{ label: "Email", name: "travelemail", type: "email" },
	];

	const billingFormFields = [
		{ label: "First Name", name: "billingfirstName", type: "text" },
		{ label: "Last Name", name: "billinglastName", type: "text" },
		{ label: "Mailing Address 1", name: "address1", type: "text" },
		{ label: "Mailing Address 2", name: "address2", type: "text" },
		{
			label: "Country",
			name: "country",
			type: "text",

			component: (
				<Select
					required
					className="select-dropdown"
					onChange={(e) => {
						const country = countriesList[e.target.value];
						setCountryid(country.id);
						setCountryname(country.name);
						GetState(country.id).then((result) => {
							setStateList(result);
						});
					}}
					value={countriesList.findIndex(
						(country: any) => country.name === countryname
					)}
				>
					{countriesList.map((item, index) => (
						<MenuItem key={index} value={index}>
							{item.name}
						</MenuItem>
					))}
				</Select>
			),
		},
		{
			label: "State",
			name: "state",
			type: "text",

			component: (
				<Select
					required
					className="select-dropdown"
					onChange={(e) => {
						const state = stateList[e.target.value];
						setStateid(state.name);
						setStatename(state.name);

						GetCity(countryid, state.id).then((result: any) => {
							setCityList(result);
						});
					}}
					value={stateList.findIndex((state: any) => state.name === stateid)}
				>
					{stateList.map((item, index) => (
						<MenuItem key={index} value={index}>
							{item.name}
						</MenuItem>
					))}
				</Select>
			),
		},
		{
			label: "City",
			name: "city",
			type: "text",

			component: (
				<Select
					required
					className="select-dropdown"
					onChange={(e) => {
						const city = cityList[e.target.value];
						setCityid(city.name);
						setCityname(city.name);
					}}
					value={cityList.findIndex((city: any) => city.name === cityid)}
				>
					{cityList.map((item: any, index) => (
						<MenuItem key={index} value={index}>
							{item.name}
						</MenuItem>
					))}
				</Select>
			),
		},
		{ label: "Zip", name: "zip", type: "text", onBlur: { validateZip } },
		{ label: "Phone", name: "billingphone", type: "tel" },
		{ label: "Email", name: "billingemail", type: "email" },
	];

	const paymentFormFields = [
		{ label: "Card Number", name: "cardNumber", type: "text" },
		{ label: "Exp MM", name: "expMonth", type: "text" },
		{ label: "Exp YY", name: "expYear", type: "text" },
		{ label: "CVV Code", name: "cvvCode", type: "password" },
	];

	const handleNextButtonClick = () => {
		if (showTravelerInfo) {
			setShowTravelerInfo(false);
			setShowBillingInfo(true);
		} else if (showBillingInfo) {
			setShowBillingInfo(false);
			setShowPaymentInfo(true);
		}
	};

	const itineraryData = useSelector(
		(state: RootState) => state.selectedRoom.itinerary
	);

	const promotionDetails: Promotion = useSelector(
		(state: RootState) => state.promotion.promotions
	);
	const selectedRoom = useSelector(
		(state: RootState) => state.feedback.selectedRoom
	);
	const setSearchParams = useSelector((state: RootState) => state.search);

	const handlePurchaseButtonClick = async (data) => {
		setIsLoading(true);
		const bookingId = uuidv4();

		const params = new URLSearchParams(window.location.search);
		params.set("bookingId", bookingId);

		try {
			const mappedData = {
				bookingId: bookingId.toString(),
				travelfirstName: data.travelfirstName,
				travellastName: data.travellastName,
				travelphone: data.travelphone,
				travelemail: data.travelemail,
				billingfirstName: data.billingfirstName,
				billinglastName: data.billinglastName,
				address1: data.address1,
				address2: data.address2,
				billingemail: data.billingemail,
				billingphone: data.billingphone,
				cardNumber: data.cardNumber,
				cvvCode: data.cvvCode,
				expMonth: data.expMonth,
				expYear: data.expYear,
				zip: data.zip,
				startDate: startDate,
				endDate: endDate,
				nightlyRate: itineraryData?.nightlyRate,
				totalAmount: itineraryData?.totalAmount,
				promocodeSpecialPrice: itineraryData?.promocodeSpecialPrice,
				subtotal: itineraryData?.subtotal,
				taxAmount: itineraryData?.taxAmount,
				vatAmount: itineraryData?.vatAmount,
				totalPrice: itineraryData?.totalPrice,
				roomname: itineraryData?.roomname,
				country: countryname,
				state: statename,
				city: cityname,
				roomTypeId: selectedRoom,
				promotionTitle: promotionDetails.promotionTitle,
				promotionDescription: promotionDetails.promotionDescription,
				promotionPriceFactor: promotionDetails.priceFactor,
				promotionPromotionId: promotionDetails.promotionId,
				promotionmMinimumDaysOfStay: promotionDetails.minimumDaysOfStay,
				adultCount: setSearchParams.adultsCount,
				childCount: setSearchParams.kidsCount,
				teenCount: setSearchParams.teensCount,
				numberOfRooms: setSearchParams.numberOfRooms,
				property: 14,
				sendOffers: isChecked,
			};

			const response = await fetch(
				"https://team14-ibe-kdu24.azurewebsites.net/checkformdata",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(mappedData),
				}
			);

			if (response.ok) {
				if (isSwitchChecked) {
					let updatedAmount = walletamount;
					if (walletamount < itineraryData?.totalPrice) {
						updatedAmount = walletamount;
					} else {
						updatedAmount = itineraryData?.totalPrice;
					}
					const walletDTO = {
						email: walletemail,
						totalAmount: -updatedAmount,
					};
					const url = "https://team14-ibe-kdu24.azurewebsites.net/save-wallet";

					const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(walletDTO),
					};
					fetch(url, options)
						.then((response) => {
							if (response.ok) {
								return response.text();
							} else {
								throw new Error("Failed to save wallet");
							}
						})
						.then((data) => console.log(data))
						.catch((error) => console.error("Error saving wallet:", error));
				}

				setSnackbarSeverity("success");
				setSnackbarMessage("Booking successful!");
				setSnackbarOpen(true);
				navigate(`/booking?${params.toString()}`);
			} else {
				setSnackbarSeverity("error");
				setSnackbarMessage(
					"Booking failed due to room unavailability. Please choose another room or try again later." +
						response.statusText
				);
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditTravelerInfo = () => {
		setShowTravelerInfo(true);
		setShowBillingInfo(false);
		setShowPaymentInfo(false);
	};

	const handleEditBillingInfo = () => {
		setShowBillingInfo(true);
		setShowPaymentInfo(false);
	};

	const handleTermsCheckboxChange = (e) => {
		if (e.target.checked) {
			setShowModal(true);
			setTermsAccepted(true);
		} else {
			setShowModal(false);
			setTermsAccepted(false);
		}
	};

	const showAlert = (message, severity) => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setSnackbarOpen(true);
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	const handleChange = (event: {
		target: { checked: boolean | ((prevState: boolean) => boolean) };
	}) => {
		setIsChecked(event.target.checked);
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

	const [isSwitchChecked, setIsSwitchChecked] = useState(false);

	const handleSwitchChange = () => {
		setIsSwitchChecked((prevChecked) => !prevChecked);
	};

	useEffect(() => {
		GetCountries().then((result) => {
			setCountriesList(result);
		});
	}, [isSwitchChecked]);

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="checkout-page-details">
				<div className="stepper">
					<StepperComponent />
				</div>
				<div className="timer">
					<FormattedMessage id="checkout.timer" />{" "}
					{Math.floor(timerCountdown / 60)}:
					{timerCountdown % 60 < 10
						? `0${timerCountdown % 60}`
						: timerCountdown % 60}
				</div>
				<div className="checkout-body">
					<div className="checkout-info-container">
						<div className="checkout-heading">
							<FormattedMessage id="checkout.header" />
						</div>
						<div className="traveler-info">
							<div className="traveler-info-title">
								{" "}
								<FormattedMessage id="checkout.travellerInfo" />
							</div>
							{showTravelerInfo && (
								<div className="traveler-info-content">
									<form onSubmit={handleSubmit(onSubmit1)}>
										{travelerFormFields.map((field) => (
											<div className="info-fields" key={field.name}>
												<label>{field.label}</label>
												{field.name === "travelphone" ? (
													<TextField
														onChange={handleInputChange}
														type={field.type}
														id={field.name}
														{...register(field.name, {
															required: true,
															pattern: {
																value: /^[0-9]{10}$/,
																message: "Invalid phone number format",
															},
														})}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message
																: ""
														}
													/>
												) : (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, { required: true })}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name] ? "Field cannot be empty" : ""
														}
													/>
												)}
											</div>
										))}
										<div style={{ paddingBottom: "5%" }}>
											<Button
												className="billing-btn"
												type="submit"
												variant="contained"
												color="primary"
											>
												<FormattedMessage id="checkout.billingBtn" />
											</Button>
										</div>
									</form>
								</div>
							)}
						</div>
						<div className="billing-info">
							<div className="billing-info-title">
								<FormattedMessage id="checkout.billinginfo" />
							</div>

							{showBillingInfo && (
								<div className="billing-info-content">
									<form onSubmit={handleSubmit(onSubmit2)}>
										{billingFormFields.map((field) => (
											<div className="info-fields" key={field.name}>
												<label>{field.label}</label>
												{field.component ? (
													field.component
												) : (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, {
															...(field.name === "billingphone" && {
																pattern: {
																	value: /^[0-9]{10}$/,
																	message: "Invalid phone number format",
																},
															}),
															required: true,
														})}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message ||
																  "Field cannot be empty"
																: ""
														}
													/>
												)}
											</div>
										))}
										<div className="buttons-up-down">
											<Link onClick={handleEditTravelerInfo}>
												<FormattedMessage id="checkout.editTravellinfo" />
											</Link>
											<Button
												className="billing-btn"
												type="submit"
												variant="contained"
												color="primary"
											>
												<FormattedMessage id="checkout.paymentbtn" />
											</Button>
										</div>
									</form>
								</div>
							)}
						</div>

						<div className="payment-info">
							<div className="payment-info-title">
								<FormattedMessage id="checkout.paymenttitle" />
							</div>
							{showPaymentInfo && (
								<div className="payment-info-content">
									<form onSubmit={handleSubmit(onSubmit3)}>
										{paymentFormFields.map((field) => (
											<div className="info-fields" key={field.name}>
												<label>{field.label}</label>
												{field.name === "cardNumber" ? (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, {
															required: "Field should not be empty",
															pattern: {
																value: /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/,
																message: "Invalid card number format",
															},
															validate: (value) =>
																value.replace(/[^0-9]/g, "").length === 16 ||
																"Card number must be exactly 16 digits",
														})}
														value={formattedCardNumber}
														onChange={handleCardNumberChange}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message
																: ""
														}
													/>
												) : field.name === "cvvCode" ? (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, {
															required: "Field should not be empty",
															minLength: {
																value: 3,
																message: "CVV must be at least 3 characters",
															},
															maxLength: {
																value: 4,
																message: "CVV must be at most 4 characters",
															},
															pattern: {
																value: /^[0-9]+$/,
																message: "Invalid CVV format",
															},
														})}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message
																: ""
														}
													/>
												) : field.name === "expMonth" ? (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, {
															required: "Field should not be empty",
															pattern: {
																value: /^\d{2}$/,
																message: "Enter a valid two-digit number",
															},
															validate: (value) => {
																const month = parseInt(value, 10);
																if (isNaN(month) || month < 4 || month > 12) {
																	return "Month must be between 1 and 12 and greater than current month";
																}
																return true;
															},
														})}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message
																: ""
														}
													/>
												) : field.name === "expYear" ? (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, {
															required: "Field should not be empty",
															pattern: {
																value: /^\d{2}$/,
																message: "Enter a valid two-digit number",
															},
															validate: (value) => {
																const year = parseInt(value, 10);
																if (isNaN(year) || year < 24) {
																	return "Year must be greater than or equal to 23";
																}
																return true;
															},
														})}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message
																: ""
														}
													/>
												) : (
													<TextField
														type={field.type}
														id={field.name}
														{...register(field.name, {
															required: "Field should not be empty",
															pattern: {
																value: /^\d{2}$/,
																message: "Enter a valid two-digit number",
															},
														})}
														fullWidth
														margin="normal"
														error={!!errors[field.name]}
														helperText={
															errors[field.name]
																? errors[field.name].message
																: ""
														}
													/>
												)}
											</div>
										))}
										<div className="checkboxes">
											<div className="offer-checkbox">
												<input
													type="checkbox"
													id="specialOffers"
													name="specialOffers"
													checked={isChecked}
													onChange={handleChange}
												/>
												<label htmlFor="specialOffers">
													<FormattedMessage id="checkout.specialOffers" />
												</label>
											</div>
											<div className="terms-checkbox">
												<input
													type="checkbox"
													id="termsAndPolicies"
													name="termsAndPolicies"
													onChange={handleTermsCheckboxChange}
													checked={termsAccepted}
												/>
												<label htmlFor="termsAndPolicies">
													<FormattedMessage id="checkout.termsandconditions" />
												</label>
											</div>
										</div>
										<div style={{ paddingTop: "3%" }}>
											<div className="due-amt">
												<p
													style={{
														fontSize: "15px",
													}}
												>
													<img
														src={coinImage}
														alt="coin-lang"
														style={{
															width: "20px",
															height: "20px",
															position: "relative",
															top: "5px",
														}}
													/>
													&nbsp;
													{/* {walletamount} */}
													{isSwitchChecked
														? (itineraryData?.totalPrice - walletamount < 0
																? walletamount - itineraryData?.totalPrice
																: 0
														  ).toFixed(2)
														: walletamount.toFixed(2)}
													&nbsp;
													<Switch
														checked={isSwitchChecked}
														onChange={handleSwitchChange}
														color="primary"
													/>
												</p>
												Total Due:&nbsp;
												{isSwitchChecked
													? selectedCurrency === "USD"
														? `$${(itineraryData?.totalPrice - walletamount < 0
																? 0
																: itineraryData?.totalPrice - walletamount
														  ).toFixed(2)}`
														: selectedCurrency === "EUR"
														? `€${(
																(itineraryData?.totalPrice - walletamount < 0
																	? 0
																	: itineraryData?.totalPrice - walletamount) *
																exchangeRate
														  ).toFixed(2)}`
														: selectedCurrency === "GBP"
														? `£${(
																(itineraryData?.totalPrice - walletamount < 0
																	? 0
																	: itineraryData?.totalPrice - walletamount) *
																exchangeRate
														  ).toFixed(2)}`
														: `${(
																(itineraryData?.totalPrice - walletamount < 0
																	? 0
																	: itineraryData?.totalPrice - walletamount) *
																exchangeRate
														  ).toFixed(2)} ${selectedCurrency}`
													: selectedCurrency === "USD"
													? `$${(itineraryData?.totalPrice).toFixed(2)}`
													: selectedCurrency === "EUR"
													? `€${(
															itineraryData?.totalPrice * exchangeRate
													  ).toFixed(2)}`
													: selectedCurrency === "GBP"
													? `£${(
															itineraryData?.totalPrice * exchangeRate
													  ).toFixed(2)}`
													: `${(
															itineraryData?.totalPrice * exchangeRate
													  ).toFixed(2)} ${selectedCurrency}`}
											</div>

											<div className="buttons-up-down-payment">
												<Link onClick={handleEditBillingInfo}>
													<FormattedMessage id="checkout.editBilling" />
												</Link>
												<Button
													className="billing-btn"
													type="submit"
													variant="contained"
													color="primary"
													disabled={!termsAccepted}
												>
													{isLoading ? (
														<CircularProgress
															size={24}
															style={{ color: "#FFFFFF" }}
														/>
													) : (
														<FormattedMessage id="checkout.purchase" />
													)}
												</Button>
											</div>
										</div>
									</form>
								</div>
							)}
						</div>
					</div>
					<div className="checkout-details">
						<div className="itinerary">
							<Itinerary />
						</div>
						<div className="contact-info">
							<ContactInfo />
						</div>
						<div className="feedback">
							<FeedbackInput />
						</div>
					</div>
				</div>
				<ModalComponent open={showModal} onClose={() => setShowModal(false)} />
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={6000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: "center", horizontal: "center" }}
				>
					<MuiAlert
						elevation={6}
						variant="filled"
						onClose={handleCloseSnackbar}
						severity={snackbarSeverity as AlertColor}
					>
						{snackbarMessage}
					</MuiAlert>
				</Snackbar>
			</div>
		</IntlProvider>
	);
}
