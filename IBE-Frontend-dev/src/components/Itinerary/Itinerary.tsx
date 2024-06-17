import { useNavigate } from "react-router-dom";
import "./Itinerary.scss";
import { Button, Link, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setActiveState } from "../redux/slice/roomSlice";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import enMessages from "../locals/en.json";
import frMessages from "../locals/fr.json";
import hiMessages from "../locals/hi.json";
import { IntlProvider, FormattedMessage } from "react-intl";
import {
	SelectedPromoCode,
	SelectedRoom,
	setItinerary,
} from "../redux/slice/CheckoutSlice";
import { Promotion } from "../redux/slice/RoomRateSlice";
import infoImage from "../../assets/info.png";
import TaxBreakDownModal from "../../Checkout/TaxModal/TaxBreakDownModal";
import PromotionModal from "../../Checkout/PromotionModal/PromotionModal";
import { selectCurrency } from "../redux/slice/languageSlice";

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

export interface ItineraryData {
	startDate: Date;
	endDate: Date;
	nightlyRate: number;
	totalAmount: number;
	promocodeSpecialPrice: number;
	subtotal: number;
	taxAmount: number;
	vatAmount: number;
	totalPrice: number;
	roomname: string;
}

const formatDate = (date: Date | string) => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const Itinerary = ({ showCheckoutButton }: { showCheckoutButton: boolean }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

	const parameterData = localStorage.getItem("searchParams");
	const pData = JSON.parse(parameterData);
	const persistedRoom = localStorage.getItem("room");
	const persistedRoomData = JSON.parse(persistedRoom);

	const persistedPromotion = localStorage.getItem("selectedPromotion");
	const persistedRoomPromotion = JSON.parse(persistedPromotion);

	const promocodeSpecialPrice =
		persistedRoomData?.price * persistedRoomPromotion?.priceFactor || 117;
	const promocodeSpecialName = persistedRoomPromotion?.promotionTitle;

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handlePromotionModalOpen = () => {
		setIsPromotionModalOpen(true);
	};
	const handlePromotionModalClose = () => {
		setIsPromotionModalOpen(false);
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const promotionInfo: Promotion = useSelector(
		(state: RootState) => state.promotion.promotions
	);

	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const [isVisible, setIsVisible] = useState(true);
	const handleContinueShopping = () => {
		dispatch(setActiveState(1));

		navigate(-1);
	};

	const roomRate = JSON.parse(localStorage.getItem("roomRates"));

	const handleCheckout = () => {
		navigate("/checkout");
	};

	const handleRemove = () => {
		setIsVisible(false);
	};

	const startDate = pData?.startDate;
	const endDate = pData?.endDate;

	const formatCombinedDate = (start: Date | string, end: Date | string) => {
		const startDate = typeof start === "string" ? new Date(start) : start;
		const endDate = typeof end === "string" ? new Date(end) : end;

		const startMonth = startDate.toLocaleDateString("en-US", {
			month: "short",
		});
		const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
		const startYear = startDate.getFullYear();
		const endYear = endDate.getFullYear();

		if (startYear === endYear) {
			return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startYear}`;
		} else {
			return `${startMonth} ${startDate.getDate()}, ${startYear} - ${endMonth} ${endDate.getDate()}, ${endYear}`;
		}
	};
	const adultsCount = pData?.adultsCount;
	const kidsCount = pData?.kidsCount;
	const teensCount = pData?.teensCount;
	const numberOfRooms = pData?.numberOfRooms;

	const specialPromoCode: SelectedPromoCode | null = useSelector(
		(state: RootState) => state.selectedRoom.selectedPackage?.promoCode
	);

	const startDateCopy = new Date(startDate);
	startDateCopy.setDate(startDateCopy.getDate() + 1);
	const formattedStartDate = startDateCopy.toISOString().split("T")[0];
	const roomRateForStartDate = roomRate?.find(
		(entry) => entry.date === formattedStartDate
	)?.nightlyRate;
	const endDateCopy = new Date(endDate);
	endDateCopy.setDate(endDateCopy.getDate());
	const formattedEndDate = endDateCopy.toISOString().split("T")[0];
	const roomRateForEndDate = roomRate?.find(
		(entry) => entry.date === formattedEndDate
	)?.nightlyRate;

	const totalAmount =
		roomRate.reduce((acc, curr) => acc + curr.nightlyRate, 0) * numberOfRooms;

	const subtotal = totalAmount * numberOfRooms - promocodeSpecialPrice;
	const taxRate = 0.12;
	const taxAmount = subtotal * taxRate;
	const vatRate = 0.06;
	const VatAmount = subtotal * vatRate;
	const totalPrice = subtotal + VatAmount + taxAmount;
	const dueNowRate = 0.4;
	const dueNowAmount = totalPrice * dueNowRate;

	const startDateObj =
		typeof startDate === "string" ? new Date(startDate) : startDate;
	const endDateObj = typeof endDate === "string" ? new Date(endDate) : endDate;

	const totalNights =
		(endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24);
	const totalAmountPerNight = totalAmount / totalNights;
	const selectedRoom: SelectedRoom | null = useSelector(
		(state: RootState) => state.selectedRoom.selectedPackage
	);

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

	useEffect(() => {
		const calculateItineraryData = () => {
			const itineraryData: ItineraryData = {
				startDate: startDate,
				endDate: endDate,
				nightlyRate: roomRateForStartDate || 0,
				totalAmount: totalAmount,
				promocodeSpecialPrice: promocodeSpecialPrice,
				subtotal: subtotal,
				taxAmount: taxAmount,
				vatAmount: VatAmount,
				totalPrice: totalPrice,
				roomname: selectedRoom?.roomTypeName,
			};
			dispatch(setItinerary(itineraryData));
		};

		calculateItineraryData();
	}, [
		startDate,
		endDate,
		roomRateForStartDate,
		totalAmount,
		promocodeSpecialPrice,
		subtotal,
		taxAmount,
		VatAmount,
		totalPrice,
	]);

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			{isVisible ? (
				<div className="card">
					<div className="itinerary-card-title">
						<FormattedMessage id="itinerary.title" />
					</div>
					<div className="itinerary-room-info">
						<h1 className="itinerary-room-title">Team 14 Resort</h1>
						<Link className="itinerary-room-rmv-btn" onClick={handleRemove}>
							<FormattedMessage id="itinerary.remove" />
						</Link>
					</div>
					<div>
						<div>
							<p className="itinerary-info">
								{startDate && endDate && formatCombinedDate(startDate, endDate)}
								&nbsp;|&nbsp;
								{adultsCount > 0 && (
									<>
										{adultsCount > 1 ? `${adultsCount} adults` : "1 adult"}
										{(kidsCount > 0 || teensCount > 0) && ", "}
									</>
								)}
								{kidsCount > 0 && (
									<>
										{kidsCount > 1 ? `${kidsCount} kids` : "1 kid"}
										{teensCount > 0 && ", "}
									</>
								)}
								{teensCount > 0 && (
									<>{teensCount > 1 ? `${teensCount} teens` : "1 teen"}</>
								)}
							</p>
							<div className="itinerary-info">
								<div>{persistedRoomData?.title}</div>
								<div>
									{numberOfRooms > 0 &&
										`${numberOfRooms} room${numberOfRooms > 1 ? "s" : ""} `}
								</div>
							</div>
							<div className="itinerary-info">
								<div>
									<div>{startDate && formatDate(startDate)}</div>
								</div>
								<div>
									{selectedCurrency === "USD"
										? `$${(roomRateForStartDate || 0).toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${((roomRateForStartDate || 0) * exchangeRate).toFixed(
												2
										  )}`
										: selectedCurrency === "GBP"
										? `£${((roomRateForStartDate || 0) * exchangeRate).toFixed(
												2
										  )}`
										: `${((roomRateForStartDate || 0) * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
							<div className="itinerary-info">
								<div>
									<div>{endDate && formatDate(endDate)}</div>
								</div>
								<div>
									{selectedCurrency === "USD"
										? `$${roomRateForEndDate?.toFixed(2) || "00.00"}`
										: selectedCurrency === "EUR"
										? `€${(
												(roomRateForEndDate || "00.00") * exchangeRate
										  ).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(
												(roomRateForEndDate || "00.00") * exchangeRate
										  ).toFixed(2)}`
										: `${(
												(roomRateForEndDate || "00.00") * exchangeRate
										  ).toFixed(2)} ${selectedCurrency}`}
								</div>
							</div>
							<div className="itinerary-info">
								<div>
									{promocodeSpecialName}
									<img
										src={infoImage}
										alt="connection-lang"
										className="info-logo"
										onClick={handlePromotionModalOpen}
									/>
								</div>
								<div>
									-&nbsp;
									{selectedCurrency === "USD"
										? `$${promocodeSpecialPrice.toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(promocodeSpecialPrice * exchangeRate).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(promocodeSpecialPrice * exchangeRate).toFixed(2)}`
										: `${(promocodeSpecialPrice * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
						</div>
						<hr className="line-tag" />
					</div>
					<div>
						<div>
							<div className="itinerary-info">
								<div>
									<FormattedMessage id="itinerary.subtotal" />
								</div>
								<div className="price">
									{selectedCurrency === "USD"
										? `$${subtotal.toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(subtotal * exchangeRate).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(subtotal * exchangeRate).toFixed(2)}`
										: `${(subtotal * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
							<div className="itinerary-info">
								<div>
									<FormattedMessage id="itinerary.taxesFees" />
									<img
										src={infoImage}
										alt="connection-lang"
										className="info-logo"
										onClick={handleModalOpen}
									/>
								</div>
								<div className="price">
									{selectedCurrency === "USD"
										? `$${taxAmount.toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(taxAmount * exchangeRate).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(taxAmount * exchangeRate).toFixed(2)}`
										: `${(taxAmount * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
							<div className="itinerary-info">
								<div>
									<FormattedMessage id="itinerary.vat" />
								</div>
								<div className="price">
									{selectedCurrency === "USD"
										? `$${VatAmount.toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(VatAmount * exchangeRate).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(VatAmount * exchangeRate).toFixed(2)}`
										: `${(VatAmount * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
						</div>
						<hr className="line-tag" />
					</div>
					<div>
						<div>
							<div className="itinerary-info">
								<div>
									<FormattedMessage id="itinerary.dueNow" />
								</div>
								<div className="price">
									{selectedCurrency === "USD"
										? `$${dueNowAmount.toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(dueNowAmount * exchangeRate).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(dueNowAmount * exchangeRate).toFixed(2)}`
										: `${(dueNowAmount * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
							<div className="itinerary-info">
								<div>
									<FormattedMessage id="itinerary.dueAtResort" />
								</div>
								<div className="price">
									{selectedCurrency === "USD"
										? `$${(totalPrice - dueNowAmount).toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${((totalPrice - dueNowAmount) * exchangeRate).toFixed(
												2
										  )}`
										: selectedCurrency === "GBP"
										? `£${((totalPrice - dueNowAmount) * exchangeRate).toFixed(
												2
										  )}`
										: `${((totalPrice - dueNowAmount) * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
							</div>
						</div>
					</div>
					{showCheckoutButton ? (
						<div className="shopping-button">
							<Button className="shopping-btn" onClick={handleCheckout}>
								<FormattedMessage id="itinerary.checkout" />
							</Button>
						</div>
					) : (
						<div className="shopping-button">
							<Button className="shopping-btn" onClick={handleContinueShopping}>
								<FormattedMessage id="itinerary.continueShopping" />
							</Button>
						</div>
					)}

					<PromotionModal
						isOpen={isPromotionModalOpen}
						onClose={handlePromotionModalClose}
						promoName={promocodeSpecialName}
						promoDescription={promotionInfo.promotionDescription}
						promoPrice={promocodeSpecialPrice}
					/>

					<TaxBreakDownModal
						isOpen={isModalOpen}
						onClose={handleModalClose}
						roomType={selectedRoom?.roomTypeName}
						nightlyRate={roomRateForStartDate || 0}
						roomRates={roomRate.map((rate) => rate.nightlyRate)}
						dates={roomRate.map((rate) => new Date(rate.date))}
						taxes={taxAmount.toFixed(2)}
						dueAtNow={dueNowAmount.toFixed(2)}
						dueAtResort={(totalPrice - dueNowAmount).toFixed(2)}
						roomTotal={totalPrice.toFixed(2)}
					/>
				</div>
			) : null}
		</IntlProvider>
	);
};

export default Itinerary;
