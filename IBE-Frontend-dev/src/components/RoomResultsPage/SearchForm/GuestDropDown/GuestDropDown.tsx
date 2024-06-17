import {
	Box,
	Typography,
	Button,
	MenuItem,
	FormControl,
	Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import "./GuestDropDown.scss";

import englishMessage from "../../../locals/en.json";
import frenchMessage from "../../../locals/fr.json";
import hindiMessage from "../../../locals/hi.json";
import { IntlProvider, FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";

export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};

export function GuestDropDown() {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const adultsCount = useSelector(
		(state: RootState) => state.search.adultsCount
	);
	const kidsCount = useSelector((state: RootState) => state.search.kidsCount);
	const teensCount = useSelector((state: RootState) => state.search.teensCount);
	const numberOfRooms = useSelector(
		(state: RootState) => state.search.numberOfRooms
	);

	const [guestCounts, setGuestCounts] = useState({
		Adults: adultsCount,
		Teens: teensCount,
		Kids: kidsCount,
	});

	const generateGuestText = (counts) => {
		const guestTexts = [];
		for (const [guestType, count] of Object.entries(counts)) {
			if (count > 0) {
				guestTexts.push(`${count} ${guestType}`);
			}
		}
		return guestTexts.join(", ");
	};

	const [selectedGuest, setSelectedGuest] = useState<string>(
		generateGuestText(guestCounts)
	);

	useEffect(() => {
		setGuestCounts({
			Adults: adultsCount,
			Teens: teensCount,
			Kids: kidsCount,
		});
	}, [adultsCount, teensCount, kidsCount]);

	useEffect(() => {
		const totalGuests =
			guestCounts.Adults + guestCounts.Teens + guestCounts.Kids;
		setSelectedGuest(totalGuests > 0 ? generateGuestText(guestCounts) : "");
	}, [guestCounts]);

	const handleGuestCountChange = (optionValue, increment, event) => {
		event.stopPropagation();
		setGuestCounts((prevCounts) => {
			const updatedCounts = {
				...prevCounts,
				[optionValue]: increment
					? Math.min((prevCounts[optionValue] || 0) + 1, 10)
					: Math.max(0, (prevCounts[optionValue] || 0) - 1),
			};

			if (updatedCounts.Adults < numberOfRooms) {
				updatedCounts.Adults = numberOfRooms;
			}

			return updatedCounts;
		});
	};

	const guestOptions = ["Adults", "Teens", "Kids"];

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<FormControl fullWidth className="guest-container">
				<Select
					style={{ height: "90px" }}
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					displayEmpty={true}
					value={selectedGuest}
					onChange={() => {}}
					renderValue={() => (
						<Box>
							<Typography style={{ color: "grey" }}>
								<FormattedMessage id="guests" defaultMessage="Guests" />
							</Typography>
							<Typography>{selectedGuest}</Typography>
						</Box>
					)}
				>
					<div>
						{guestOptions.map((option, index) => (
							<div className="guest-list-options" key={index}>
								<MenuItem value={option}>
									<div>
										<Typography>
											<p>
												<FormattedMessage
													id={option.toLowerCase()}
													defaultMessage={option}
												/>
											</p>
											<span className="age-category-guest-type">
												{option === "Adults" && (
													<FormattedMessage
														id="adults_age"
														defaultMessage="Ages 18+"
													/>
												)}
												{option === "Teens" && (
													<FormattedMessage
														id="teens_age"
														defaultMessage="Ages 13-17"
													/>
												)}
												{option === "Kids" && (
													<FormattedMessage
														id="kids_age"
														defaultMessage="Ages 0-12"
													/>
												)}
											</span>
										</Typography>
									</div>
									<div className="guest-btn">
										<Button
											onClick={(event) =>
												handleGuestCountChange(option, false, event)
											}
											style={{
												backgroundColor: "transparent",
												color: "#000",
												fontSize: "20px",
											}}
										>
											-
										</Button>

										<Typography style={{ margin: "0 10px" }}>
											{guestCounts[option]}
										</Typography>
										<Button
											onClick={(event) =>
												handleGuestCountChange(option, true, event)
											}
											style={{
												backgroundColor: "transparent",
												color: "#000",
												fontSize: "20px",
											}}
										>
											+
										</Button>
									</div>
								</MenuItem>
							</div>
						))}
					</div>
				</Select>
			</FormControl>
		</IntlProvider>
	);
}
