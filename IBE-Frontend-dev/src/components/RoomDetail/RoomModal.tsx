import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Room } from "../redux/slice/roomSlice";
import { Carousel } from "react-responsive-carousel";
import roomType from "../../assets/room-type.png";
import Vector from "../../assets/Vector.png";
import checkMark from "../../assets/checkMark.png";
import "./RoomModal.scss";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import {
  Promotion,
  fetchPromotions,
  selectPromotions,
  setPromotions,
} from "../redux/slice/promotionSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  PromoCodeResponseDTO,
  selectPromoCodeResponse,
  validatePromoCode,
} from "../redux/slice/promoCodeSlice";
import {
  setSelectedRoomss,
  setShowItinerary,
} from "../redux/slice/feedbackSlice";

import enMessages from "../locals/en.json";
import frMessages from "../locals/fr.json";
import hiMessages from "../locals/hi.json";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { RootState } from "../redux/store";
import { selectEndDate, selectStartDate } from "../redux/slice/searchSlice";
import {
  selectCurrency,
  selectWheelchairAccessible,
} from "../redux/slice/languageSlice";
import { setPackageCode } from "../redux/slice/CheckoutSlice";
import { fetchRoomRates } from "../redux/slice/RoomRateSlice";

interface RoomModalProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
}

const RoomModal: React.FC<RoomModalProps> = ({ open, onClose, room }) => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState<string>("");

  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state: RootState) => state.language.selectedLanguage
  );
  const promotions: Promotion[] = useSelector(selectPromotions) || [];
  const promoCodeResponse: PromoCodeResponseDTO | null = useSelector(
    selectPromoCodeResponse
  );
  const amenitiesData: string[] = useSelector(
    (state: RootState) => state.language.amenities
  );
  const description: string = useSelector(
    (state: RootState) => state.language.description
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  const wheelchairAccessible = useSelector(selectWheelchairAccessible);
  const selectedCurrency = useSelector(selectCurrency);
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  const selectedRoomId = useSelector(setSelectedRoomss);
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const isoStartDate = `${startDateObj.getFullYear()}-${(
	"0" +
	(startDateObj.getMonth() + 1)
  ).slice(-2)}-${("0" + startDateObj.getDate()).slice(-2)}T00:00:00.000Z`;
  const isoEndDate = `${endDateObj.getFullYear()}-${(
	"0" +
	(endDateObj.getMonth() + 1)
  ).slice(-2)}-${("0" + endDateObj.getDate()).slice(-2)}T00:00:00.000Z`;

  const handleSelectPackage = (
    packageName: string,
    packagePrice: number,
    promotion: string | Promotion | undefined
  ) => {
    dispatch(
      fetchRoomRates({
        roomTypeId: selectedRoomId,
        startDate: isoStartDate,
        endDate: isoEndDate,
      })
    );
    dispatch(setShowItinerary(true));

    if (promotion && typeof promotion !== 'string') {
      localStorage.setItem("selectedPromotion", JSON.stringify(promotion));
  }

    const priceFactor: number = promotion.priceFactor;
    dispatch(setPackageCode({ name: packageName, price: priceFactor }));

    dispatch(setPromotions(promotion));


    navigate("/checkout");
  };

  useEffect(() => {
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
  }, []);

  const handleApplyPromo = () => {
    if (promoCode === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please enter a promo code");
      setOpenSnackbar(true);
      return;
    }
    dispatch(validatePromoCode(promoCode))
      .then((response) => {
        if (!response.payload.valid) {
          setSnackbarSeverity("error");
          setSnackbarMessage("Invalid promo code");
          setOpenSnackbar(true);
        } else {
          setSnackbarSeverity("success");
          setSnackbarMessage("Promocode applied successfully");
          setOpenSnackbar(true);
        }
      })
      .catch(() => {
        setSnackbarSeverity("error");
        setSnackbarMessage("An error occurred while validating the promo code");
        setOpenSnackbar(true);
      });
    setPromoCode("");
  };

  const handleSnackbarClose = (_event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(event.target.value);
  };

  const renderArrowPrev = (clickHandler: () => void, hasPrev: boolean) => (
    <button
      className="arrowButtonPrev"
      onClick={clickHandler}
      disabled={!hasPrev}
    >
      <ArrowBackIosIcon />
    </button>
  );

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

  const renderArrowNext = (clickHandler: () => void, hasNext: boolean) => (
    <button
      className="arrowButtonNext"
      onClick={clickHandler}
      disabled={!hasNext}
    >
      <ArrowForwardIosIcon />
    </button>
  );

  const roomTypeImages = {
		GRAND_DELUXE: [
			"https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHJvb218ZW58MHx8MHx8fDA%3D",
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
      messages={
        selectedLanguage === "fr"
          ? frMessages
          : selectedLanguage === "hi"
          ? hiMessages
          : enMessages
      }
    >
      <Modal
        open={open}
        onClose={onClose}
        center
        classNames={{
          modal: "customModal",
        }}
      >
        <div className="carousel">
          <div className="room-type-title">
            {room?.title && <FormattedMessage id={room.title} />}
          </div>{" "}
          <Carousel
						autoPlay={true}
						infiniteLoop
						interval={2000}
						animation="slide"
						navButtonsAlwaysVisible={true}
						showThumbs={false}
						showStatus={false}
						className="carousal-img"
						renderArrowPrev={renderArrowPrev}
						renderArrowNext={renderArrowNext}
					>
						{room &&
							roomTypeImages[room.title]?.map((image, index) => (
								<div key={index}>
									<img
										className="carousal-image"
										src={image}
										alt="room image"
									/>
								</div>
							))}
					</Carousel>
        </div>
        <div className="room-modal-info">
          <div className="room-info">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="room-sub-details">
                <div className="sub-details-one">
                  <div className="room-sub-info">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "17%",
                      }}
                    >
                      <div>
                        <img src={Vector} alt="vector icon" />
                      </div>
                      <div className="room-vector-logo">
                        {room && `${room.occupancy - 1} - ${room.occupancy}`}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <div>
                        <img src={roomType} alt="room type icon" />
                      </div>
                      <div style={{ marginLeft: "10px" }}>
                        {room?.singleBed && (
                          <FormattedMessage
                            id="roomTypeSingleBed"
                            values={{ bedCount: room.singleBed }}
                          />
                        )}
                        {room?.singleBed && room?.doubleBed && (
                          <FormattedMessage id="or" />
                        )}
                        {room?.doubleBed && (
                          <FormattedMessage
                            id="roomTypeDoubleBed"
                            values={{ bedCount: room.doubleBed }}
                          />
                        )}
                      </div>
                    </div>
                    <div> {room?.roomSize}</div>
                  </div>
                  <div className="room-description">
                    <FormattedMessage id="description" />
                  </div>
                </div>

                <div className="amenities">
                  {amenitiesData.length ? <div>Amenities</div> : ""}
                  <div className="all-amenities">
                    <ul className="amenities-part">
                      {amenitiesData.map((amenity, index) => (
                        <li key={index}>
                          <img
                            style={{ width: "15px", height: "15px" }}
                            src={checkMark}
                            alt="check-mark"
                          />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="room-rates">
                  <FormattedMessage id="standardRate" />
                </div>
                <div className="room-normal-package">
                  <div className="room-rate-desc">
                    <p className="title">
                      <FormattedMessage id="standardRate" />
                    </p>
                    <span className="description">
                      <FormattedMessage id="standardRateDescription" />
                    </span>
                  </div>
                  <div className="room-rate-value">
                    <p className="price">
                      {selectedCurrency === "USD"
                        ? `$${room?.price.toFixed(2)}`
                        : selectedCurrency === "EUR"
                        ? `€${(room?.price * exchangeRate).toFixed(2)}`
                        : selectedCurrency === "GBP"
                        ? `£${(room?.price * exchangeRate).toFixed(2)}`
                        : `${(room?.price * exchangeRate).toFixed(
                            2
                          )} ${selectedCurrency}`}
                    </p>
                    <span className="price-per-night">
                      <FormattedMessage id="perNight" />
                    </span>
                    <button
                      className="package-btn"
                      onClick={() =>
                        handleSelectPackage("Standard Rate", room?.price, "")
                      }
                    >
                      <FormattedMessage id="selectPackage" />
                    </button>{" "}
                  </div>
                </div>
              </div>
              <div>
                <div className="room-rates">Deals & Packages</div>
                {Array.isArray(promotions) &&
                  promotions?.map((promotion) => (
                    <div key={promotion.promotionId}>
                      <div className="room-normal-package">
                        <div className="room-rate-desc">
                          <p className="title">
                            <FormattedMessage id={promotion.promotionTitle} />
                          </p>
                          <span className="description">
                            <FormattedMessage
                              id={promotion.promotionDescription}
                            />
                          </span>
                        </div>
                        <div className="room-rate-value">
                          <p className="price">
                            {selectedCurrency === "USD"
                              ? `$${(
                                  room?.price * promotion.priceFactor
                                ).toFixed(2)}`
                              : selectedCurrency === "EUR"
                              ? `€${(
                                  room?.price *
                                  promotion.priceFactor *
                                  exchangeRate
                                ).toFixed(2)}`
                              : selectedCurrency === "GBP"
                              ? `£${(
                                  room?.price *
                                  promotion.priceFactor *
                                  exchangeRate
                                ).toFixed(2)}`
                              : `${(
                                  room?.price *
                                  promotion.priceFactor *
                                  exchangeRate
                                ).toFixed(2)} ${selectedCurrency}`}
                          </p>
                          <span className="price-per-night">
                            <FormattedMessage id="perNight" />
                          </span>
                          <button
                            className="package-btn"
                            onClick={() =>
                              handleSelectPackage(
                                promotion.promotionTitle,
                                room?.price * promotion.priceFactor,
                                promotion
                              )
                            }
                          >
                            <FormattedMessage id="selectPackage" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="promocode">
                {promoCodeResponse?.valid && (
                  <div>
                    <div className="room-rates">
                      <FormattedMessage id="promoCodeDiscount" />
                    </div>
                    <div className="room-normal-package">
                      <div className="room-rate-desc">
                        <p className="title">{promoCodeResponse?.promocode}</p>
                        <span className="description">
                          <FormattedMessage
                            id="promoCodeDiscountDescription"
                            values={{
                              promoCode: promoCodeResponse?.promocode,
                              discount: promoCodeResponse?.discount,
                            }}
                          />
                        </span>
                      </div>
                      <div className="room-rate-value">
                        <p className="price">
                          {selectedCurrency === "USD"
                            ? `$${(
                                (room?.price *
                                  (100 - promoCodeResponse?.discount)) /
                                100
                              ).toFixed(2)}`
                            : selectedCurrency === "EUR"
                            ? `€${(
                                ((room?.price *
                                  (100 - promoCodeResponse?.discount)) /
                                  100) *
                                exchangeRate
                              ).toFixed(2)}`
                            : selectedCurrency === "GBP"
                            ? `£${(
                                ((room?.price *
                                  (100 - promoCodeResponse?.discount)) /
                                  100) *
                                exchangeRate
                              ).toFixed(2)}`
                            : `${(
                                ((room?.price *
                                  (100 - promoCodeResponse?.discount)) /
                                  100) *
                                exchangeRate
                              ).toFixed(2)} ${selectedCurrency}`}
                        </p>
                        <span className="price-per-night">
                          <FormattedMessage id="perNight" />
                        </span>
                        <button
                          className="package-btn"
                          onClick={() =>
                            handleSelectPackage(
                              promoCodeResponse.promocode,
                              (room?.price *
                                (100 - promoCodeResponse?.discount)) /
                                100
                            )
                          }
                        >
                          <FormattedMessage id="selectPackage" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="label">
                    <FormattedMessage id="enterPromoCode" />
                  </label>
                </div>
                <div>
                  <input
                    className="promocode-input"
                    type="text"
                    value={promoCode}
                    onChange={handleChange}
                  />
                  <button
                    className="apply-promo-btn"
                    onClick={handleApplyPromo}
                  >
                    <FormattedMessage id="apply" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </IntlProvider>
  );
};

export default RoomModal;
