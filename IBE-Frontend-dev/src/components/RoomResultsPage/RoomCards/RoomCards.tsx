import React, { useEffect, useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Room, setActiveState } from "../../redux/slice/roomSlice";
import "./RoomCards.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import staricon from "../../../assets/star.png";
import location from "../../../assets/location.png";
import Vector from "../../../assets/Vector.png";
import roomType from "../../../assets/room-type.png";
import promotionImage from "../../../assets/promotion.png";
import { Button } from "@mui/material";
import RoomModal from "../../RoomDetail/RoomModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromotions } from "../../redux/slice/promotionSlice";
import { selectStartDate, selectEndDate } from "../../redux/slice/dateSlice";
import {
	selectCurrency,
	selectWheelchairAccessible,
} from "../../redux/slice/languageSlice";
import { RootState } from "../../redux/store";
import newpropertyImage from "../../../assets/newproperty.png";

import enMessages from "../../locals/en.json";
import frMessages from "../../locals/fr.json";
import hiMessages from "../../locals/hi.json";
import { setSelectedRooms } from "../../redux/slice/feedbackSlice";
import { setSelectedPackage } from "../../redux/slice/CheckoutSlice";

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};
interface RoomProps {
	rooms: Room[];
}

const RoomCards: React.FC<RoomProps> = ({ rooms }) => {
	const [openModal, setOpenModal] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

	const dispatch = useDispatch();
	const startDate = useSelector(selectStartDate);
	const endDate = useSelector(selectEndDate);
	const wheelchairAccessible = useSelector(selectWheelchairAccessible);
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const [exchangeRate, setExchangeRate] = useState<number>(1);
	const selectedCurrency = useSelector(selectCurrency);

	const handleOpenModal = (room: Room) => {
		if (room) {
			localStorage.setItem("room", JSON.stringify(room));
		}
		dispatch(setActiveState(1));
		setSelectedRoom(room);
		setOpenModal(true);

		const roomid: number = room.id;
		dispatch(setSelectedRooms(room.id));
		dispatch(setSelectedPackage({ room_id: roomid, roomTypeName: room.title }));

		let isLongWeekend =
			startDate &&
			endDate &&
			Math.abs(endDate.getDate() - startDate.getDate()) > 2;

		if (isLongWeekend === null) {
			isLongWeekend = false;
		}

		let isWeekend =
			startDate &&
			endDate &&
			(startDate.getDay() === 6 ||
				startDate.getDay() === 0 ||
				endDate.getDay() === 6 ||
				endDate.getDay() === 0);
		if (isWeekend == null) {
			isWeekend = false;
		}
		const promotionParams = {
			page: 1,
			size: 6,
			seniorCitizen: wheelchairAccessible,
			kduMembership: true,
			longWeekendDiscount: isLongWeekend,
			militaryPersonnelDiscount: false,
			upfrontPaymentDiscount: true,
			weekendDiscount: isWeekend,
		};

		dispatch(fetchPromotions(promotionParams));
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

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

	const roomTypeImages = {
		GRAND_DELUXE: [
			"https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cm9vbSUyMGhvdGVsJTIwYmVkfGVufDB8fDB8fHww",
		],
		SUPER_DELUXE: [
			"https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm9vbSUyMGhvdGVsfGVufDB8fDB8fHww",
			"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJvb20lMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
			"https://images.unsplash.com/photo-1561501878-aabd62634533?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvb20lMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
		],
		FAMILY_DELUXE: [
			"https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://plus.unsplash.com/premium_photo-1674676471380-1258cb31b3ac?q=80&w=2909&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		],
		COUPLE_SUITE: [
			"https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1631049421450-348ccd7f8949?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		],
		GARDEN_SUITE: [
			"https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1631049552240-59c37f38802b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://plus.unsplash.com/premium_photo-1689609949898-5f7a10649fef?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		],
		STANDARD_SUITE: [
			"https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		],
	};

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="room-cards" data-testid="room-cards">
				{rooms.map((room: Room) => (
					<div key={room.id} className="room-card" data-testid="room-card">
						<div className="carousel">
							<Carousel
								autoPlay={true}
								infiniteLoop
								interval={2000}
								animation="slide"
								navButtonsAlwaysVisible={true}
								showThumbs={false}
								showStatus={false}
								centerMode={true}
								centerSlidePercentage={125}
							>
								{roomTypeImages[room.title]?.map((image, index) => (
									<div key={index}>
										<img
											src={image}
											style={{ width: "120%", objectFit: "cover" }}
										/>
									</div>
								))}
							</Carousel>
						</div>
						<div className="room-type-content">
							<div className="room-name-rating-review">
								<div className="room-name">{room.title}</div>

								<div className="room-info">
									{room.ratings !== 0.0 ? (
										<div className="rating-review">
											<div className="room-rating">
												<div>
													<img src={staricon} alt="star icon" />
												</div>
												<div>{room.ratings}</div>
											</div>
											<div className="room-review">
												<FormattedMessage
													id="reviews"
													defaultMessage="{reviewCount} reviews"
													values={{ reviewCount: room.reviews }}
												/>
											</div>
										</div>
									) : (
										<div
											className="new-property"
											style={{ marginRight: "5px" }}
										>
											<img src={newpropertyImage} alt="New Property" />
										</div>
									)}
								</div>
							</div>
							<div className="room-location">
								<img src={location} alt="location icon" />
								<div style={{ marginLeft: "5px" }}>{room.location}</div>
							</div>
							<div className="area-in-sqft">
								<div className="inclusive">
									<FormattedMessage id="inclusive" defaultMessage="Inclusive" />
								</div>
								<div className="sq-ft">{room.roomSize} &nbsp;</div>
							</div>
							<div className="room-capacity">
								<img src={Vector} alt="vector icon" />
								<div className="room-vector-logo">
									{room.occupancy - 1} - {room.occupancy}
								</div>
							</div>
							<div className="room-type">
								<img src={roomType} alt="room type icon" />
								<div style={{ marginLeft: "10px" }}>
									{room.singleBed ? `${room.singleBed}` + " Queen" : ""}
									{room.singleBed && room.doubleBed ? " &" : ""} &nbsp;
									{room.doubleBed ? `${room.doubleBed}` + " King" : ""}
								</div>
							</div>
							<div className="room-deal">
								<img src={promotionImage} alt="promotion icon" />
								<p className="deal-text">
									<FormattedMessage
										id="specialDeal"
										defaultMessage="Special Deal"
									/>
								</p>
							</div>
							<div style={{ fontSize: "0.9rem", marginLeft: "10px" }}>
								<FormattedMessage
									id="savePercentage"
									defaultMessage="Save 10% when you book 2+ nights"
								/>
							</div>
							<div className="room-price">
								<div className="room-amount">
									{selectedCurrency === "USD"
										? `$${room.price.toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(room.price * exchangeRate).toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(room.price * exchangeRate).toFixed(2)}`
										: `${(room.price * exchangeRate).toFixed(
												2
										  )} ${selectedCurrency}`}
								</div>
								<div className="per-night">
									<FormattedMessage id="perNight" defaultMessage="per night" />
								</div>
							</div>
							<Button
								className="search-room-btn"
								data-testid="search-room-button"
								variant="outlined"
								onClick={() => handleOpenModal(room)}
							>
								<FormattedMessage
									id="searchRoom"
									defaultMessage="SEARCH ROOM"
								/>
							</Button>
						</div>
					</div>
				))}
			</div>

			<RoomModal
				open={openModal}
				onClose={handleCloseModal}
				room={selectedRoom}
			/>
		</IntlProvider>
	);
};

export default RoomCards;
