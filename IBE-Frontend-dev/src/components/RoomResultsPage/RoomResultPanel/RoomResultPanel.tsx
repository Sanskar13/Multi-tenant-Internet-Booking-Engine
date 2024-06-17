import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Room,
	fetchRoomPrices,
	fetchRooms,
	selectRooms,
	setRooms,
} from "../../redux/slice/roomSlice";
import RoomCards from "../RoomCards/RoomCards";
import { useEffect, useState } from "react";
import "./RoomResultPanel.scss";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";
import { RootState } from "../../redux/store";
import { IntlProvider, FormattedMessage } from "react-intl";
import englishMessages from "../../locals/en.json";
import frenchMessages from "../../locals/fr.json";
import hindiMessages from "../../locals/hi.json";
import Itinerary from "../../Itinerary/Itinerary";

const messages = {
	en: englishMessages,
	fr: frenchMessages,
	hi: hindiMessages,
};

export function RoomResultPanel() {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	const dispatch = useDispatch();
	const allRooms: Room[] = useSelector(selectRooms);
	const [startIndex, setStartIndex] = useState(0);
	const [endIndex, setEndIndex] = useState(3);
	const totalRooms = useSelector(
		(state: RootState) => state.search.numberOfRooms
	);
	const [totalRoomCount, setTotalRoomCount] = useState(6);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useState("");
	const [loading, setLoading] = useState(true);
	const rowsPerPage = 3;

	useEffect(() => {
		setTotalRoomCount(allRooms.length);
	}, [allRooms]);

	useEffect(() => {
		if (endIndex > allRooms.length) {
			setEndIndex(allRooms.length);
			setStartIndex(0);
		} else {
			setEndIndex(Math.min(3, totalRoomCount));
		}
	}, [totalRoomCount]);

	useEffect(() => {
		dispatch(fetchRooms())
			.then(() => {
				setLoading(false); // Update loading state when fetching is done
				setSnackbarMessage("Data fetched successfully");
				setOpenSnackbar(true);
			})
			.catch(() => setLoading(false)); // Handle loading state if fetching fails
		dispatch(fetchRoomPrices());
	}, [dispatch]);
	useEffect(() => {
		setEndIndex(startIndex + rowsPerPage);
	}, [startIndex]);

	const handlePrevPage = () => {
		if (startIndex > 0) {
			setStartIndex(startIndex - rowsPerPage);
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (endIndex < totalRoomCount) {
			setStartIndex(startIndex + rowsPerPage);
			setCurrentPage(currentPage + 1);
		}
	};

	const handleSortChange = (event: React.ChangeEvent<{ value: string }>) => {
		const selectedOption = event.target.value;
		setSortOption(selectedOption);

		const sortedRooms = [...allRooms];
		if (selectedOption === "low") {
			sortedRooms.sort((a, b) => a.price - b.price);
		} else if (selectedOption === "high") {
			sortedRooms.sort((a, b) => b.price - a.price);
		}

		dispatch(setRooms(sortedRooms));
	};
	const showItinerary = useSelector(
		(state: RootState) => state.feedback.showItinerary
	);

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="room-result-panel-card">
				{loading ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							marginTop: "17rem",
							marginRight: "10rem",
						}}
					>
						<CircularProgress />
					</div>
				) : (
					<>
						<div className="room-result-title">
							<div className="room-title">
								<FormattedMessage
									id="roomResults"
									defaultMessage="Room Results"
								/>
							</div>
							<div className="room-bar-end">
								<div className="room-results">
									<div className="room-page-number">
										<div className="paginated-btn">
											<Button
												variant="text"
												onClick={handlePrevPage}
												style={{
													position: "relative",
													left: "8px",
													fontSize: "1.2rem",
												}}
											>
												{"<"}
											</Button>
										</div>
										<div className="pagination-title">
											<FormattedMessage
												id="showingResults"
												defaultMessage="Showing {startIndex} - {endIndex} of {totalRoomCount} results"
												values={{
													startIndex: startIndex + 1,
													endIndex,
													totalRoomCount,
												}}
											/>
										</div>
										<div className="paginated-btn">
											<Button
												variant="text"
												onClick={handleNextPage}
												style={{
													position: "relative",
													right: "30px",
													fontSize: "1.2rem",
												}}
											>
												{">"}
											</Button>
										</div>
									</div>
									<div className="room-vertical-line"></div>

									<div className="room-sort-price">
										<FormControl fullWidth>
											<Select
												displayEmpty={true}
												defaultValue=""
												className="price-sort-dropdown"
												value={sortOption}
												onChange={handleSortChange}
												renderValue={() => (
													<Box style={{ border: "none", outline: "none" }}>
														<Typography style={{ fontWeight: "bold" }}>
															<FormattedMessage
																id="price"
																defaultMessage="Price"
															/>
														</Typography>
													</Box>
												)}
											>
												<MenuItem value="low">
													<FormattedMessage
														id="priceLow"
														defaultMessage="Price Low"
													/>
												</MenuItem>
												<MenuItem value="high">
													<FormattedMessage
														id="priceHigh"
														defaultMessage="Price High"
													/>
												</MenuItem>
											</Select>
										</FormControl>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div style={{ display: "flex", flexDirection: "row" }}>
								<div
									className="room-display"
									style={{ display: "flex", flexWrap: "wrap" }}
								>
									<RoomCards
										rooms={allRooms.slice(startIndex, endIndex)}
										className=""
									/>
								</div>
								<div className="itinerary-wrapper">
									{showItinerary ? <Itinerary showCheckoutButton={true} /> : ""}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</IntlProvider>
	);
}
