import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./FeedbackModal.scss";
import { sendEmail } from "../redux/slice/EmailSlice";
import englishMessage from "../locals/en.json";
import frenchMessage from "../locals/fr.json";
import hindiMessage from "../locals/hi.json";
import { IntlProvider, FormattedMessage } from "react-intl";
import { RootState } from "../redux/store";

export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};
const FeedbackModal = ({ onClose }) => {
	const dispatch = useDispatch();
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");

	const roomid = useSelector((state: RootState) => state.feedback.selectedRoom);
	const handleRatingClick = (value: React.SetStateAction<number>) => {
		setRating(value);
	};
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);

	const propertyId = 14;
	const handleSubmit = async () => {
		try {
			dispatch(sendEmail({ email: review, roomid, propertyId }));
			onClose();
		} catch (error) {
			console.error("Failed to submit feedback:", error);
		}
	};

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="feedback-modal">
				<div className="rating-container">
					{[...Array(5)].map((_, index) => {
						const ratingValue = index + 1;
						return (
							<span
								key={index}
								onClick={() => handleRatingClick(ratingValue)}
								className={`emoji ${ratingValue <= rating ? "selected" : ""}`}
							></span>
						);
					})}
				</div>
				<textarea
					placeholder="Enter Your Email Address"
					value={review}
					onChange={(e) => setReview(e.target.value)}
				></textarea>
				<button onClick={handleSubmit}>
					<FormattedMessage id="feedback.submit" />
				</button>
			</div>
		</IntlProvider>
	);
};

export default FeedbackModal;
