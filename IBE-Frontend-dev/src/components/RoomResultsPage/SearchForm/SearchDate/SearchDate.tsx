import { useEffect, useState } from "react";
import "./SearchDate.scss";
import { useDispatch, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import enMessages from "../../../locals/en.json";
import frMessages from "../../../locals/fr.json";
import hiMessages from "../../../locals/hi.json";
import {
	selectLanguage,
	setLanguage,
} from "../../../redux/slice/languageSlice";
import { selectCurrency } from "../../../redux/slice/languageSlice";
import SearchCalender from "./SearchCalender";

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

export function SearchDate() {
	const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(null);
	const [value] = useState(new Date());
	const [propertyRates, setPropertyRates] = useState<{ [key: string]: number }>(
		{}
	);
	const [exchangeRate, setExchangeRate] = useState<number>(1);
	const selectedCurrency = useSelector(selectCurrency);

	const handleCalendarChange = (date: Date | Date[] | null) => {
		setSelectedDate(date || new Date());
	};
	const selectedLanguage = useSelector(selectLanguage);

	useEffect(() => {
		setLocale(selectedLanguage);
	}, [selectedLanguage]);

	const dispatch = useDispatch();

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

	const setLocale = (locale: string) => {
		dispatch(setLanguage(locale));
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

	return (
		<div className="search-date-container">
			<IntlProvider
				locale={selectedLanguage}
				messages={messages[selectedLanguage as keyof typeof messages]}
			>
				{" "}
				<div className="calendar-container">
					<SearchCalender
						onChange={handleCalendarChange}
						value={value}
						minDate={new Date()}
						selectRange
						showDoubleView
						tileContent={tileContent}
						propertyRates={propertyRates}
						exchangeRate={exchangeRate}
					/>
				</div>
			</IntlProvider>
		</div>
	);
}
