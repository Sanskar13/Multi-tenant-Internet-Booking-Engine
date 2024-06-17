import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./FeedbackInput.scss";
import { FormattedMessage, IntlProvider } from "react-intl";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import englishMessage from "../locals/en.json";
import frenchMessage from "../locals/fr.json";
import hindiMessage from "../locals/hi.json";

export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};
const FeedbackInput = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="feedback-component">
				<button className="feed-btn" onClick={handleOpenModal}>
					<FormattedMessage id="feedback.leaveFeedback" />
				</button>
				<Modal open={modalOpen} onClose={handleCloseModal} center>
					<FeedbackModal onClose={handleCloseModal} />
				</Modal>
			</div>
		</IntlProvider>
	);
};

export default FeedbackInput;
