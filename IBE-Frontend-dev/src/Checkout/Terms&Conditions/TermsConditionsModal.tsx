import React from "react";
import { Modal } from "react-responsive-modal";
import "./TermsConditonsModal.scss"; 

import enMessages from "../../components/locals/en.json";
import frMessages from "../../components/locals/fr.json";
import hiMessages from "../../components/locals/hi.json";
import { useSelector } from "react-redux";
import { RootState } from "../../components/redux/store";
import { IntlProvider, FormattedMessage } from "react-intl"; 

const messages = {
	en: enMessages,
	fr: frMessages,
	hi: hiMessages,
};

const ModalComponent = ({ open, onClose }) => {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<Modal
				open={open}
				onClose={onClose}
				center
				classNames={{
					overlay: "react-responsive-modal-overlay",
					modal: "react-responsive-modal-modal",
				}}
			>
				<div className="modal-container">
					{" "}
					<div className="modal-content-terms">
						<h1 className="tc-title">
							<FormattedMessage id="termsConditionsTitle" />{" "}

						</h1>
						<ul className="tc-desc">
							<li>
								<FormattedMessage id="checkInCheckOutTime" />{" "}

							</li>
							<li>
								<FormattedMessage id="earlyLateCheckInOut" />{" "}

							</li>
							<li>
								<FormattedMessage id="individualCancellationPolicy" />{" "}

							</li>
							<li>
								<FormattedMessage id="groupCancellationPolicy" />{" "}

							</li>
							<li>
								<FormattedMessage id="standardPoliciesApplicable" />{" "}

							</li>
							<li>
								<FormattedMessage id="paymentMethods" /> 
							</li>
							<li>
								<FormattedMessage id="applicableTaxes" /> 
							</li>
							<li>
								<FormattedMessage id="creditCardRefund" /> 
							</li>
							<li>
								<FormattedMessage id="guestsSafetySecurity" />{" "}

							</li>
							<li>
								<FormattedMessage id="proofOfIdentity" /> 
							</li>
							<li>
								<FormattedMessage id="outsideFoodBeverages" />{" "}

							</li>
							<li>
								<FormattedMessage id="conflictInBill" /> 
							</li>
							<li>
								<FormattedMessage id="noGatheringsParties" />{" "}

							</li>
							<li>
								<FormattedMessage id="reservationCancellationByHotel" />{" "}

							</li>
							<li>
								<FormattedMessage id="hotelLiability" /> 
							</li>
							<li>
								<FormattedMessage id="hotelFailureToComply" />{" "}

							</li>
							<li>
								<FormattedMessage id="waiverOfRights" /> 
							</li>
						</ul>
					</div>
				</div>
			</Modal>
		</IntlProvider>
	);
};

export default ModalComponent;
