
import { Button } from "@mui/material";
import { GuestDropDown } from "./GuestDropDown/GuestDropDown";
import { SearchBeds } from "./SearchBeds/SearchBeds";
import "./SearchForm.scss";
import { SearchRooms } from "./SearchRooms/SearchRooms";
import { SearchDate } from "./SearchDate/SearchDate";
import { IntlProvider, FormattedMessage } from "react-intl";
import englishMessage from "../../locals/en.json";
import frenchMessage from "../../locals/fr.json";
import hindiMessage from "../../locals/hi.json";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};

interface Messages {
	[key: string]: { [key: string]: string };
}

export function SearchForm() {
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);
	return (
		<IntlProvider
			locale={selectedLanguage}
			messages={messages[selectedLanguage]}
		>
			{" "}
			<div className="search-form-container">
				<div className="number-of-guest">
					<GuestDropDown />
				</div>
				<div className="rooms-bed">
					<div className="search-rooms">
						<SearchRooms />
					</div>
					<div className="search-beds">
						<SearchBeds />
					</div>
				</div>
				<div className="search-date">
					<SearchDate />
				</div>
				<div className="search-date-btn">
					<Button className="search-dates-btn" variant="outlined">
						<FormattedMessage id="searchForm.searchDates" />
					</Button>
				</div>
			</div>
		</IntlProvider>
	);
}