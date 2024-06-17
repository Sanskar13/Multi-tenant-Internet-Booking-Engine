import React from "react";
import { Modal } from "react-responsive-modal";
import "./CancellationPolicyModal.scss";
import enMessages from "../../locals/en.json";
import frMessages from "../../locals/fr.json";
import hiMessages from "../../locals/hi.json";
import { FormattedMessage, IntlProvider } from "react-intl";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

const CancellationPolicyModal = ({ isOpen, onClose }) => {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<Modal open={isOpen} onClose={onClose} center>
				<div className="modal-content">
					<h2 className="modal-title">
						<FormattedMessage id="cancellationPolicyTitle" />{" "}
					</h2>
					<ul className="modal-list">
						<h1 className="section-title">
							<FormattedMessage id="registeredUserTitle" />
						</h1>
						<li className="modal-list-item">
							<FormattedMessage id="registeredUserBefore2Days" />{" "}
						</li>
						<li className="modal-list-item">
							<FormattedMessage id="registeredUserLessThan2Days" />{" "}
						</li>
						<li className="modal-list-item">
							<FormattedMessage id="registeredUserLessThan1Day" />{" "}
						</li>

						<h1 className="section-title">
							<FormattedMessage id="unregisteredUserTitle" />{" "}
						</h1>

						<li className="modal-list-item">
							<FormattedMessage id="unregisteredUserBefore2Days" />{" "}
						</li>
						<li className="modal-list-item">
							<FormattedMessage id="unregisteredUserLessThan2Days" />{" "}
						</li>
						<li className="modal-list-item">
							<FormattedMessage id="unregisteredUserNoRefund" />{" "}
						</li>
						<h1 className="benefits-message">
							<FormattedMessage id="registerBenefitsMessage" />{" "}
						</h1>
					</ul>
				</div>
			</Modal>
		</IntlProvider>
	);
};

export default CancellationPolicyModal;
