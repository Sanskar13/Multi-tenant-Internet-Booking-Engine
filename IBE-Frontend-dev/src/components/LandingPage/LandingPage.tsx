import React, { useState, useEffect } from "react";
import "./LandingPage.scss";
import {
	TextField,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Button,
	FormControl,
} from "@mui/material";
import disabled from "../../assets/disabled.png";
import CustomCalendar from "./Calender/Calender";
import { FormattedMessage, IntlProvider } from "react-intl";
import enMessages from "../locals/en.json";
import frMessages from "../locals/fr.json";
import hiMessages from "../locals/hi.json";
import { useDispatch, useSelector } from "react-redux";
import {
	setStartDate,
	setEndDate,
	selectStartDate,
	selectEndDate,
} from "../redux/slice/dateSlice";
import {
	fetchConfigData,
	fetchPropertyRates,
	selectCurrency,
	selectLanguage,
	selectWheelchairAccessible,
	setLanguage,
	setWheelchairAccessible,
} from "../redux/slice/languageSlice";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RoomResults } from "../RoomResultsPage/RoomResults";

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

export function LandingPage() {
	const startDate = useSelector(selectStartDate);
	const endDate = useSelector(selectEndDate);
	const wheelchairAccessible = useSelector(selectWheelchairAccessible);

	const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
	const [numberOfRooms, setNumberOfRooms] = useState<number>(1);
	const [guestType, setGuestType] = useState<string>("Adults");
	const [guestDropdownOptions, setGuestDropdownOptions] = useState<string[]>(
		[]
	);
	const [guestCounts, setGuestCounts] = useState<{ [key: string]: number }>({
		Adults: 1,
		Kids: 0,
		Teens: 0,
	});
	const [configured, setConfigured] = useState<boolean>(false);
	const [wheelchairAccessibleConfigured, setWheelchairAccessibleConfigured] =
		useState<boolean>(false);
	const [roomDropdownOptions, setRoomDropdownOptions] = useState<number[]>([]);
	const [propertyRates, setPropertyRates] = useState<{ [key: string]: number }>(
		{}
	);
	const [roomEnable, setRoomEnable] = useState<boolean>(false);
	const [guestEnable, setGuestEnable] = useState<boolean>(false);
	const [exchangeRate, setExchangeRate] = useState<number>(1);
	const selectedCurrency = useSelector(selectCurrency);
	const selectedLanguage = useSelector(selectLanguage);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchConfigData());
		dispatch(fetchPropertyRates());
	}, [dispatch]);

	useEffect(() => {
		setLocale(selectedLanguage);
	}, [selectedLanguage]);

	const setLocale = (locale: string) => {
		dispatch(setLanguage(locale));
	};

	useEffect(() => {
		setConfigured(checkAllFieldsFilled());
	}, [selectedProperties, startDate, endDate, guestType, numberOfRooms]);

	useEffect(() => {
		const fetchConfigData = async () => {
			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/api/config"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch config data");
				}
				const jsonData = await response.json();
				setGuestDropdownOptions(jsonData.guestTypes);
				setRoomDropdownOptions(jsonData.roomCountOptions);
				if (jsonData.guestTypes) {
					setGuestEnable(true);
				}
				if (jsonData.roomCountOptions) {
					setRoomEnable(true);
				}
				setWheelchairAccessibleConfigured(true);
			} catch (error) {
				console.error("Error fetching config data:", error);
			}
		};

		fetchConfigData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/api/property-rates"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}
				const data = await response.json();
				setPropertyRates(data);
			} catch (error) {
				console.error("Error fetching property rates:", error);
			}
		};

		fetchData();
	}, []);

	const handleDateChange = (dates: [Date, Date]) => {
		dispatch(setStartDate(dates[0]));
		dispatch(setEndDate(dates[1]));
	};

	const handlePropertyCheckboxChange = (property: string) => {
		setSelectedProperties((prevSelected) => {
			return prevSelected.includes(property)
				? prevSelected.filter(
						(selectedProperty) => selectedProperty !== property
				  )
				: [...prevSelected, property];
		});
	};

	const handleGuestTypeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newGuestType = event.target.value;
		setGuestType(newGuestType || "Adults");
	};

	const handleRoomSelectChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const selectedRooms = parseInt(event.target.value);
		setNumberOfRooms(selectedRooms);

		if (selectedRooms > guestCounts.Adults) {
			setGuestCounts((prevCounts) => ({
				...prevCounts,
				Adults: selectedRooms,
			}));
		}
	};

	const handleWheelchairAccessibleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const wheelchairAccessibleValue = event.target.checked;
		dispatch(setWheelchairAccessible(wheelchairAccessibleValue));
	};

	const handleSearch = () => {
		if (startDate && endDate) {
			const queryParams = new URLSearchParams({
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				selectedProperties: selectedProperties.join(","),
				numberOfRooms: numberOfRooms.toString(),
				wheelchairAccessible: wheelchairAccessible.toString(),
				adultsCount: guestCounts.Adults.toString(),
				teensCount: guestCounts.Teens.toString(),
				kidsCount: guestCounts.Kids.toString(),
			});
			navigate(`/search?${queryParams.toString()}`);
		} else {
			console.error("Start date or end date is null");
		}
	};
	const handleGuestCountChange = (
		optionValue: string,
		increment: boolean,
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.stopPropagation();

		const totalGuests = Object.values(guestCounts).reduce(
			(total, count) => total + count,
			0
		);
		const maxTotalGuests = numberOfRooms * 2;

		if (increment) {
			if (totalGuests >= maxTotalGuests) return;

			if (guestCounts[optionValue] >= numberOfRooms && optionValue !== "Adults")
				return;
		}

		setGuestCounts((prevCounts) => {
			const updatedCounts = {
				...prevCounts,
				[optionValue]: increment
					? Math.min((prevCounts[optionValue] || 0) + 1, 10)
					: Math.max(0, (prevCounts[optionValue] || 0) - 1),
			};

			if (optionValue === "Adults" && totalGuests > maxTotalGuests) {
				const diff = totalGuests - maxTotalGuests;
				updatedCounts.Adults -= diff;
			}

			return updatedCounts;
		});
	};

	const tileContent = ({ date }: { date: Date }) => {
		const formattedDate = date.toISOString().split("T")[0];
		const price =
			propertyRates[formattedDate] !== undefined
				? propertyRates[formattedDate]
				: null;
		const totalPrice =
			price !== null ? (price * exchangeRate).toFixed(2) : null;
		let currencySymbol = "";
		if (selectedCurrency === "USD") {
			currencySymbol = "$";
		} else if (selectedCurrency === "GBP") {
			currencySymbol = "£";
		} else if (selectedCurrency === "EUR") {
			currencySymbol = "€";
		}

		return (
			<p
				style={{
					textAlign: "center",
					margin: 0,
					color: "gray",
					fontSize: "12px",
				}}
			>
				{price != null && currencySymbol}
				{totalPrice}
			</p>
		);
	};

	const checkAllFieldsFilled = () => {
		return (
			startDate !== null &&
			endDate !== null &&
			selectedProperties.length > 0 &&
			guestType !== "" &&
			numberOfRooms > 0
		);
	};

	useEffect(() => {
		const fetchExchangeRate = async () => {
			try {
				if (selectedCurrency != "USD") {
					const response = await fetch(
						`https://api.frankfurter.app/latest?from=USD&to=${selectedCurrency}`
					);
					if (!response.ok) {
						throw new Error("Failed to fetch exchange rate");
					}
					const data = await response.json();
					const exchangeRte = data.rates[selectedCurrency];
					setExchangeRate(exchangeRte);
				} else {
					setExchangeRate(1);
				}
			} catch (error) {
				console.error("Error fetching exchange rate:", error);
			}
		};

		fetchExchangeRate();
	}, [selectedCurrency, propertyRates]);

	return (
		<div className="landing-page-container">
			<IntlProvider
				locale={selectedLanguage}
				messages={messages[selectedLanguage as keyof typeof messages]}
			>
				<div className="search-form-container">
					<div className="search-field">
						<label>
							<FormattedMessage id="landing.property" />*
						</label>
						<TextField
							className="search-input"
							required={true}
							select
							fullWidth
							value={selectedProperties}
							onChange={() => {}}
							SelectProps={{
								multiple: true,
								renderValue: () =>
									selectedProperties.join(", ") || (
										<FormattedMessage id="landing.selectProperties" />
									),
							}}
						>
							<FormControl fullWidth>
								<MenuItem disabled={!selectedProperties.includes("Property 1")}>
									<Checkbox
										checked={selectedProperties.includes("Property 1")}
										onChange={() => handlePropertyCheckboxChange("Property 1")}
										value="Property 1"
									/>
									<span>
										<FormattedMessage id="landing.property1" />
									</span>
								</MenuItem>
								<MenuItem disabled={!selectedProperties.includes("Property 2")}>
									<Checkbox
										checked={selectedProperties.includes("Property 2")}
										onChange={() => handlePropertyCheckboxChange("Property 2")}
										value="Property 2"
									/>
									<span>
										<FormattedMessage id="landing.property2" />
									</span>
								</MenuItem>
								<MenuItem
									onClick={() => handlePropertyCheckboxChange("Property 14")}
								>
									<Checkbox
										checked={selectedProperties.includes("Property 14")}
										onChange={() => handlePropertyCheckboxChange("Property 14")}
										value="Property 14"
										onClick={(event) => event.stopPropagation()}
									/>
									<span>
										<FormattedMessage id="landing.property3" />
									</span>
								</MenuItem>
							</FormControl>
						</TextField>
					</div>

					<div className="date-field">
						<label>
							<FormattedMessage id="landing.selectDates" />
						</label>

						<CustomCalendar
							onChange={handleDateChange}
							value={startDate ? [startDate, endDate] : null}
							minDate={new Date()}
							selectRange
							showDoubleView
							tileContent={tileContent}
							propertyRates={propertyRates}
							exchangeRate={exchangeRate}
						/>
					</div>

					<div className="guest-stay-detail">
						{guestEnable && (
							<div className="guest-field">
								<label>
									<FormattedMessage id="landing.guests" />
								</label>
								<TextField
									className="guest-input"
									select
									value={guestType}
									onChange={handleGuestTypeChange}
									SelectProps={{
										renderValue: () => (
											<div className="guest-selected-options">
												<span>
													{guestDropdownOptions
														.filter((option) => guestCounts[option] > 0)
														.map(
															(option) => `${option}: ${guestCounts[option]}`
														)
														.join(", ")}
												</span>
											</div>
										),
									}}
								>
									{guestDropdownOptions.map((option) => (
										<MenuItem key={option} value={option}>
											<div className="guest-options">
												<div>
													<p>{option}</p>
													<span className="age-category-guest-type">
														{option === "Adults" && "Ages 18+"}
														{option === "Teens" && "Ages 13-17"}
														{option === "Kids" && "Ages 0-12"}
													</span>
												</div>
												<div className="counter">
													<Button
														className="counter-button-subtract"
														onClick={(event) =>
															handleGuestCountChange(option, false, event)
														}
														disabled={guestCounts[option] <= 0}
													>
														-
													</Button>
													<span className="counter-value">
														{guestCounts[option] || 0}
													</span>
													<Button
														className="counter-button-add"
														onClick={(event) =>
															handleGuestCountChange(option, true, event)
														}
														disabled={guestCounts[option] >= 10}
													>
														+
													</Button>
												</div>
											</div>
										</MenuItem>
									))}
								</TextField>
							</div>
						)}

						{roomEnable && (
							<div className="room-field">
								<label>
									<FormattedMessage id="landing.rooms" />
								</label>
								<TextField
									className="room-input"
									select
									value={numberOfRooms}
									onChange={handleRoomSelectChange}
								>
									{roomDropdownOptions.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</TextField>
							</div>
						)}
					</div>
					{wheelchairAccessibleConfigured && (
						<div className="accessibility-field">
							<FormControlLabel
								control={
									<Checkbox
										checked={wheelchairAccessible}
										onChange={handleWheelchairAccessibleChange}
									/>
								}
								label={
									<>
										<img
											className="wheelchair-image"
											src={disabled}
											alt="Wheelchair"
										/>
										<span className="accessibility-text">
											<FormattedMessage id="landing.accessibleRoom" />
										</span>
									</>
								}
							/>
						</div>
					)}
					<div className="button-search">
						<Button
							className="search-btn"
							variant="contained"
							color="primary"
							disabled={!configured}
							onClick={handleSearch}
							style={{
								backgroundColor: !configured ? "#ccc" : "",
								pointerEvents: !configured ? "none" : "auto",
							}}
						>
							<FormattedMessage id="landing.search" />
						</Button>
					</div>
				</div>
			</IntlProvider>
			<Routes>
				<Route path="/search" element={<RoomResults />} />
			</Routes>
		</div>
	);
}
