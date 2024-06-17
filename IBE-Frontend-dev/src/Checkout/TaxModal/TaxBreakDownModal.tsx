import Modal from "react-responsive-modal";
import "./TaxBreakDownModal.scss";
import { FormattedMessage, IntlProvider } from "react-intl";
import enMessages from "../../components/locals/en.json";
import frMessages from "../../components/locals/fr.json";
import hiMessages from "../../components/locals/hi.json";
import { useSelector } from "react-redux";
import { RootState } from "../../components/redux/store";
import { useEffect, useState } from "react";
import { selectCurrency } from "../../components/redux/slice/languageSlice";
const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};
const TaxBreakDownModal = ({
	isOpen,
	onClose,
	roomType,
	nightlyRate,
	roomRates,
	dates,
	taxes,
	dueAtNow,
	dueAtResort,
	roomTotal,
}) => {
	const formatDate = (date) => {
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return date.toLocaleDateString("en-US", options);
	};
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
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
	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<Modal
				center
				open={isOpen}
				onClose={onClose}
				classNames={{ modal: "custom-modal" }}
			>
				<div className="modal-content">
					<div className="modal-header">
						<h2>
							<FormattedMessage id="rateBreakdownTitle" />
						</h2>
					</div>
					<div className="modal-body">
						<div className="room-type-info">
							<div>
								<FormattedMessage id="roomTypeLabel" />
							</div>{" "}
							<div>{roomType}</div>
						</div>
						<div className="room-rate-info">
							<div>
								<FormattedMessage id="nightlyRateLabel" />:
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${nightlyRate.toFixed(2)}`
									: selectedCurrency === "EUR"
									? `€${(nightlyRate * exchangeRate).toFixed(2)}`
									: selectedCurrency === "GBP"
									? `£${(nightlyRate * exchangeRate).toFixed(2)}`
									: `${(nightlyRate * exchangeRate).toFixed(
											2
									  )} ${selectedCurrency}`}
							</div>
						</div>
						<ul>
							{roomRates.map((rate, index) => (
								<li key={index}>
									<div className="date-rate">
										<div>{formatDate(dates[index])}:</div>
										<div>
											{selectedCurrency === "USD"
												? `$${rate.toFixed(2)}`
												: selectedCurrency === "EUR"
												? `€${(rate * exchangeRate).toFixed(2)}`
												: selectedCurrency === "GBP"
												? `£${(rate * exchangeRate).toFixed(2)}`
												: `${(rate * exchangeRate).toFixed(
														2
												  )} ${selectedCurrency}`}
										</div>
									</div>
								</li>
							))}
						</ul>
						<div className="room-total-info">
							<div>
								<FormattedMessage id="roomTotalLabel" />
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${roomTotal}`
									: selectedCurrency === "EUR"
									? `€${roomTotal * exchangeRate}`
									: selectedCurrency === "GBP"
									? `£${roomTotal * exchangeRate}`
									: `${roomTotal * exchangeRate} ${selectedCurrency}`}
							</div>
						</div>
						<hr />
						<div className="room-tax-info">
							<div>
								<FormattedMessage id="taxesFeesLabel" />
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${taxes}`
									: selectedCurrency === "EUR"
									? `€${taxes * exchangeRate}`
									: selectedCurrency === "GBP"
									? `£${taxes * exchangeRate}`
									: `${taxes * exchangeRate} ${selectedCurrency}`}
							</div>
						</div>
						<div className="room-resort-fee-info">
							<div>
								<FormattedMessage id="resortFeeLabel" />
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${nightlyRate}`
									: selectedCurrency === "EUR"
									? `€${nightlyRate * exchangeRate}`
									: selectedCurrency === "GBP"
									? `£${nightlyRate * exchangeRate}`
									: `${nightlyRate * exchangeRate} ${selectedCurrency}`}
							</div>
						</div>
						<div className="room-occupancy-tax-info">
							<div>
								<FormattedMessage id="occupancyTaxLabel" />
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${nightlyRate}`
									: selectedCurrency === "EUR"
									? `€${nightlyRate * exchangeRate}`
									: selectedCurrency === "GBP"
									? `£${nightlyRate * exchangeRate}`
									: `${nightlyRate * exchangeRate} ${selectedCurrency}`}
							</div>
						</div>

						<hr />
						<div className="room-due-now-info">
							<div>
								<FormattedMessage id="dueNowLabel" />
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${dueAtNow}`
									: selectedCurrency === "EUR"
									? `€${dueAtNow * exchangeRate}`
									: selectedCurrency === "GBP"
									? `£${dueAtNow * exchangeRate}`
									: `${dueAtNow * exchangeRate} ${selectedCurrency}`}
							</div>
						</div>
						<div className="room-due-resort-info">
							<div>
								<FormattedMessage id="dueAtResortLabel" />
							</div>{" "}
							<div>
								{selectedCurrency === "USD"
									? `$${dueAtResort}`
									: selectedCurrency === "EUR"
									? `€${dueAtResort * exchangeRate}`
									: selectedCurrency === "GBP"
									? `£${dueAtResort * exchangeRate}`
									: `${dueAtResort * exchangeRate} ${selectedCurrency}`}
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</IntlProvider>
	);
};

export default TaxBreakDownModal;
