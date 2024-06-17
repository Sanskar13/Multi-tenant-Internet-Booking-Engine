

import React, { useEffect, useState } from "react";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	FormControl,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Button,
} from "@mui/material";
import enMessages from "../../locals/en.json";
import frMessages from "../../locals/fr.json";
import hiMessages from "../../locals/hi.json";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./RoomFilter.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomPrices, fetchRooms } from "../../redux/slice/roomSlice";
import { FormattedMessage, IntlProvider } from "react-intl";
import { RootState } from "../../redux/store";

const RoomFilter: React.FC = () => {
	const [expanded, setExpanded] = React.useState<string | false>("panel1");
	const dispatch = useDispatch();
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);

	const [singleBed, setSingleBed] = React.useState<boolean>(false);
	const [superDeluxe, setSuperDeluxe] = React.useState<boolean>(false);
	const [familyDeluxe, setFamilyDeluxe] = React.useState<boolean>(false);
	const [price, setPrice] = React.useState<number>(1000);
	const [applyFilter, setApplyFilter] = useState<boolean>(false); // Track whether to apply filters

	const messages = {
		en: enMessages,
		fr: frMessages,
		hi: hiMessages,
	};
	const filters = [
		{
			id: "panel1",
			label: <FormattedMessage id="priceRange" defaultMessage="Price Range" />,
			options: ["< $120", "< $150", "< $180"],
		},
		{
			id: "panel2",
			label: <FormattedMessage id="bedType" defaultMessage="Bed Type" />,
			options: ["Single Bed"],
		},
		{
			id: "panel3",
			label: <FormattedMessage id="roomType" defaultMessage="Room Type" />,
			options: ["Family Deluxe", "Super Deluxe"],
		},
	];

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	const handleOptionChange = (filterid: string, option: string) => {
		// Update the state based on the selected option
		if (option === "Single Bed") {
			setSingleBed(!singleBed);
		} else if (option === "Family Deluxe") {
			setFamilyDeluxe(!familyDeluxe);
		} else if (option === "Super Deluxe") {
			setSuperDeluxe(!superDeluxe);
		} else if (
			option === "< $120" ||
			option === "< $150" ||
			option === "< $180"
		) {
			setPrice(option === "< $120" ? 120 : option === "< $150" ? 150 : 180);
		}
	};

	const handleApplyFilter = () => {
		setApplyFilter(true);
	};

	const handleClearFilters = () => {
		setSingleBed(false);
		setSuperDeluxe(false);
		setFamilyDeluxe(false);
		setPrice(1000);
		setApplyFilter(false);
		dispatch(fetchRooms({}));
	};

	useEffect(() => {
		if (applyFilter) {
			const params: any = { page: 1, pageSize: 6 };
			params.singleBed = singleBed;
			params.superDeluxe = superDeluxe;
			params.familyDeluxe = familyDeluxe;
			params.price = price;
			dispatch(fetchRooms(params));
			dispatch(fetchRoomPrices());
			setApplyFilter(false); 
		}
	}, [applyFilter]);

	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			<div className="room-filter" >
				<div
					style={{ margin: "20px 5px", fontWeight: "600", fontSize: "1.5rem" }}
				>
					<FormattedMessage
						id="narrowResults"
						defaultMessage="Narrow your results"
					/>
				</div>
				{filters.map((filter) => (
					<Accordion
						key={filter.id}
						expanded={expanded === filter.id}
						onChange={handleChange(filter.id)}
						style={{ backgroundColor: "#e4e4e4" }}
						disableGutters={true}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls={`${filter.id}-content`}
							id={`${filter.id}-header`}
						>
							<Typography>{filter.label}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<FormControl component="fieldset">
								<FormGroup>
									{filter.options.map((option) => (
										<FormControlLabel
											key={option}
											control={
												<Checkbox
													checked={
														(option === "Single Bed" && singleBed) ||
														(option === "Family Deluxe" && familyDeluxe) ||
														(option === "Super Deluxe" && superDeluxe) ||
														(option === "< $120" && price === 120) ||
														(option === "< $150" && price === 150) ||
														(option === "< $180" && price === 180)
													}
													onChange={() => handleOptionChange(filter.id, option)}
												/>
											}
											label={option}
										/>
									))}
								</FormGroup>
							</FormControl>
						</AccordionDetails>
					</Accordion>
				))}
				<Button className="apply-filter-btn" onClick={handleApplyFilter}>
					<FormattedMessage id="applyFilter" defaultMessage="Apply" />
				</Button>
				<Button className="clear-filter-btn" onClick={handleClearFilters}>
					<FormattedMessage id="clearFilters" defaultMessage="Clear Filters" />
				</Button>
			</div>
		</IntlProvider>
	);
};

export default RoomFilter;
