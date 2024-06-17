
import React, { useEffect, useState } from "react";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import "./SearchRooms.scss";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import englishMessage from "../../../locals/en.json";
import frenchMessage from "../../../locals/fr.json";
import hindiMessage from "../../../locals/hi.json";
import { IntlProvider, FormattedMessage } from "react-intl";

export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};

export function SearchRooms() {
	const searchParamsRoom = useSelector(
		(state: RootState) => state.search.numberOfRooms
	);
	const adultsCount = useSelector(
		(state: RootState) => state.search.adultsCount
	);
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const [roomOptions, setRoomOptions] = useState<string[]>([]);
	const [selectedRoom, setSelectedRoom] = useState<string>(
		searchParamsRoom.toString() || ""
	);

	useEffect(() => {
		setSelectedRoom(Math.max(searchParamsRoom, adultsCount).toString());
	}, [searchParamsRoom, adultsCount]);

	const handleRoomSelect = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setSelectedRoom(event.target.value);
	};

	useEffect(() => {
		const newRoomOptions = Array.from(
			{ length: searchParamsRoom },
			(_, index) => `${index + 1} Room`
		);
		setRoomOptions(newRoomOptions);
	}, [searchParamsRoom]);

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="search-rooms-container">
				<FormControl fullWidth>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						displayEmpty={true}
						defaultValue=""
						value={selectedRoom}
						onChange={handleRoomSelect}
						renderValue={() => (
							<Box>
								<Typography style={{ color: "grey" }}>
									<FormattedMessage id="rooms" defaultMessage="Rooms" />
								</Typography>
								<Typography>{selectedRoom}</Typography>
							</Box>
						)}
					>
						{roomOptions.map((option, index) => (
							<MenuItem key={index} value={option}>
								{option}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
		</IntlProvider>
	);
}``