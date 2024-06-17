import React, { useState } from "react";
import "./ContactInfo.scss";
import { IntlProvider, FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import infoImage from "../../assets/info.png";

import englishMessage from "../locals/en.json";
import frenchMessage from "../locals/fr.json";
import hindiMessage from "../locals/hi.json";
import CancellationPolicyModal from "../MyBookings/CancelModal/CancellationPolicyModal";

export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};
const ContactInfo = () => {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="info-card">
				<h2 className="help">
					<FormattedMessage id="contactinfo.help" />
					<div style={{ display: "flex", flexDirection: "row" }}>
						<p style={{ marginTop: "8px" }}>Cancellation Policy</p>
						<img
							src={infoImage}
							alt="cancellation-lang"
							className="info-cancel-logo"
							onClick={() => setIsModalCancelOpen(true)}
						/>
					</div>
				</h2>
				<p className="call">
					<FormattedMessage id="contactinfo.call" />
				</p>
				<p className="date-time">
					<FormattedMessage id="contactinfo.dateTime" />
				</p>
				<CancellationPolicyModal
					isOpen={isModalCancelOpen}
					onClose={() => setIsModalCancelOpen(false)}
				/>
			</div>
		</IntlProvider>
	);
};

export default ContactInfo;
