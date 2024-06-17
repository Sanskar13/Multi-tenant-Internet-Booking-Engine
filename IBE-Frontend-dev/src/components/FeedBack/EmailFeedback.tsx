import englishMessage from "../locals/en.json";
import frenchMessage from "../locals/fr.json";
import hindiMessage from "../locals/hi.json";
export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./FeedbackModal.scss";
import { submitFeedback } from "../redux/slice/feedbackSlice";
import { FormattedMessage, IntlProvider } from "react-intl";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";

const EmailFeedback = () => {
	const dispatch = useDispatch();
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const roomid = urlParams.get("roomid");
	const propertyid = urlParams.get("propertyid");
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);



	const handleRatingClick = (value) => {
		setRating(value);
	};

	const handleSubmit = async () => {
		try {
			dispatch(
				submitFeedback({
					propertyId: propertyid,
					roomTypeId: roomid,
					rating: rating,
				})
			);
			setSubmitted(true);
		} catch (error) {
			console.error("Failed to submit feedback:", error);
		}
	};

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div
				className="feedback-modal"
				style={{ position: "relative", top: "40px", width: "40%" }}
			>
				{!submitted ? (
					<>
						<FormattedMessage id="emailfeedback.leaveFeedback" />
						<div className="rating-container">
							{[...Array(5)].map((_, index) => {
								const ratingValue = index + 1;
								return (
									<span
										key={index}
										onClick={() => handleRatingClick(ratingValue)}
										className={`emoji ${
											ratingValue <= rating ? "selected" : ""
										}`}
									>
										{ratingValue === 1
											? "😞"
											: ratingValue === 2
											? "😐"
											: ratingValue === 3
											? "😊"
											: ratingValue === 4
											? "😃"
											: "🤩"}
									</span>
								);
							})}
						</div>
						<textarea
							placeholder="Write your review..."
							value={review}
							onChange={(e) => setReview(e.target.value)}
							style={{ width: "90%", height: "100px" }}
						></textarea>
						<button onClick={handleSubmit}>
							<FormattedMessage id="emailfeedback.submit" />
						</button>
					</>
				) : (
					<div>
						<h2>
							<FormattedMessage id="emailfeedback.thanksForFeedback" />
						</h2>
						<Link to={"/"}>
							<FormattedMessage id="emailfeedback.goToHome" />
						</Link>
					</div>
				)}
			</div>
		</IntlProvider>
	);
};

export default EmailFeedback;
