import React, { useEffect, useState } from "react";
import { Box, FormControl, Select, Typography, MenuItem } from "@mui/material";
import "./SearchBeds.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import englishMessage from "../../../locals/en.json";
import frenchMessage from "../../../locals/fr.json";
import hindiMessage from "../../../locals/hi.json";
import { IntlProvider, FormattedMessage } from "react-intl";

export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};

export function SearchBeds() {
	const [bedOptions, setBedOptions] = useState(["1", "2", "3"]);
	const [selectedBed, setSelectedBed] = useState<string>("1");
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const numberOfRooms = useSelector(
		(state: RootState) => state.search.numberOfRooms
	);

	useEffect(() => {
		setSelectedBed(Math.max(numberOfRooms, 1).toString());
	}, []);

	const handleBedSelect = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setSelectedBed(event.target.value);
	};

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="search-beds-container">
				<FormControl fullWidth>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						displayEmpty={true}
						value={selectedBed}
						onChange={handleBedSelect}
						renderValue={(selected) => (
							<Box>
								<Typography style={{ color: "grey" }}>
									<FormattedMessage id="beds" defaultMessage="Beds" />
								</Typography>
								<Typography>{selected}</Typography>
							</Box>
						)}
					>
						{bedOptions.map((option, index) => (
							<MenuItem key={index} value={option}>
								{option}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
		</IntlProvider>
	);
}
