import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "./PromotionModal.scss";
import enMessages from "../../components/locals/en.json";
import frMessages from "../../components/locals/fr.json";
import hiMessages from "../../components/locals/hi.json";
import { useSelector } from "react-redux";
import { RootState } from "../../components/redux/store";
import { FormattedMessage, IntlProvider } from "react-intl";
import { selectCurrency } from "../../components/redux/slice/languageSlice";
const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

const PromotionModal = ({
	isOpen,
	onClose,
	promoName,
	promoDescription,
	promoPrice,
}) => {
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
			<Modal open={isOpen} onClose={onClose} center>
				<div className="promotion-total">{promoName}</div>
				<div className="promo-desc">{promoDescription}</div>
				<div className="promo-rate-detail">
					<div className="promo-price-title">
						<FormattedMessage id="packageTotalLabel" />
					</div>
					<div className="promo-price-value">
						{selectedCurrency === "USD"
							? `$${promoPrice.toFixed(2)}`
							: selectedCurrency === "EUR"
							? `€${(promoPrice * exchangeRate).toFixed(2)}`
							: selectedCurrency === "GBP"
							? `£${(promoPrice * exchangeRate).toFixed(2)}`
							: `${(promoPrice * exchangeRate).toFixed(
									2
							  )} ${selectedCurrency}`}{" "}
					</div>
				</div>
			</Modal>
		</IntlProvider>
	);
};

export default PromotionModal;
