import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { FormattedMessage, IntlProvider } from "react-intl";
import "./StepperComponent.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import englishMessage from "../../locals/en.json";
import frenchMessage from "../../locals/fr.json";
import hindiMessage from "../../locals/hi.json";
import { useLocation, useNavigate } from "react-router-dom";
import { setActiveState } from "../../redux/slice/roomSlice";

const steps = ["step1", "step2", "step3"];
export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};

export default function StepperComponent() {
	const activeStep = useSelector((state: RootState) => state.room.activeState);
	const showItinerary = useSelector(
		(state: RootState) => state.feedback.showItinerary
	);
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		if (location.pathname === "/checkout") {
			dispatch(setActiveState(2));
		} else if (showItinerary) {
			dispatch(setActiveState(1));
		} else {
			dispatch(setActiveState(0));
		}
	}, [location.pathname]);

	const handleStepClick = (stepIndex: number) => {
		dispatch(setActiveState(stepIndex));
		if (stepIndex === 0) {
			navigate(-1);
		} else if (stepIndex === 1) {
			navigate(-1);
		} else if (stepIndex === 2) {
			navigate("/checkout");
		}
	};

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<Box className="stepper-container">
				<Stepper
					activeStep={activeStep}
					alternativeLabel
					className="custom-stepper"
				>
					{steps.map((messageId, index) => (
						<Step
							key={`${messageId}-${index}`}
							onClick={() => handleStepClick(index)}
						>
							<StepLabel className={activeStep === index ? "active-step" : ""}>
								<FormattedMessage id={`stepper.${messageId}`} />
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>
		</IntlProvider>
	);
}
