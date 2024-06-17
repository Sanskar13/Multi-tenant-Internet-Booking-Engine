import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FormattedMessage } from "react-intl";
import { useMediaQuery } from "@mui/material";

import "../LandingPage.scss";

interface CalendarProps {
	value: Date | Date[];
	onChange: (date: Date | Date[]) => void;
	minDate: Date;
	selectRange?: boolean;
	tileContent: (args: { date: Date }) => JSX.Element | null;
	propertyRates: { [key: string]: number };
	exchangeRate: number;
}

const CustomCalendar: React.FC<CalendarProps> = ({
	onChange,
	minDate,
	selectRange = true,
	tileContent,
	propertyRates,
	exchangeRate,
}) => {
	const selectedCurrency = useSelector(
		(state: RootState) => state.language.selectedCurrency
	);

	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);

	const [showCalendar, setShowCalendar] = useState(false);
	const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
	const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
	const [messageVisible, setMessageVisible] = useState<boolean>(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
	const [averageRate, setAverageRate] = useState<number | null>(null);

	const calendarRef = useRef<HTMLDivElement>(null);

	const isLargeScreen = useMediaQuery("(min-width:1080px)");

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				setShowCalendar(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleToggle = () => {
		setShowCalendar(!showCalendar);
	};

	const formatMonthLabel = (locale: string, date: Date) => {
		return (
			<div className="custom-month-label">
				{date.toLocaleDateString(locale, { month: "long" })}
			</div>
		);
	};

	const handleApplyDates = () => {
		if (selectedStartDate && selectedEndDate) {
			onChange([selectedStartDate, selectedEndDate]);
			setShowCalendar(false);
		}
	};

	const handleCalendarChange = (date: Date | Date[]) => {


		if (Array.isArray(date) && date.length === 2) {
			onChange(date);
			const maxStayLength = 14;
			const stayLength =
				(date[1].getTime() - date[0].getTime()) / (1000 * 3600 * 24);
			setIsButtonDisabled(stayLength > maxStayLength);

			if (stayLength > maxStayLength) {
				setSelectedEndDate(null);
				setSelectedStartDate(null);
				setMessageVisible(true);
				setAverageRate(null);
			} else {
				setSelectedStartDate(date[0]);
				setSelectedEndDate(date[1]);
				setMessageVisible(false);

				let totalRate = 0;
				let dayCount = 0;

				for (
					let d = new Date(date[0]);
					d <= date[1];
					d.setDate(d.getDate() + 1)
				) {
					const formattedDate = d.toISOString().split("T")[0];
					if (propertyRates[formattedDate] !== undefined) {
						totalRate += propertyRates[formattedDate];
						dayCount++;
					}
				}

				const average = (totalRate / dayCount).toFixed(2);
				setAverageRate(parseFloat(average));
			}
		}
	};

	return (
		<div className="calender-with-prices" ref={calendarRef}>
			<IconButton aria-label="toggle-calendar" onClick={handleToggle}>
				<div className="calender-with-price">
					<div>
						{selectedStartDate ? (
							selectedStartDate.toLocaleDateString()
						) : (
							<FormattedMessage id="calendar.checkIn" />
						)}
					</div>
					<div>&#8594;</div>
					<div>
						{selectedEndDate ? (
							selectedEndDate.toLocaleDateString()
						) : (
							<FormattedMessage id="calendar.checkOut" />
						)}
					</div>
					<CalendarMonthIcon />
				</div>
			</IconButton>
			{showCalendar && (
				<div
					style={{
						position: "absolute",
						zIndex: "999",
						width: isLargeScreen ? "auto" : "290px",
					}}
				>
					<Calendar
						onChange={(date: Date | Date[]) => handleCalendarChange(date)}
						value={
							selectedStartDate && selectedEndDate
								? [selectedStartDate, selectedEndDate]
								: []
						}
						minDate={minDate}
						showDoubleView={isLargeScreen}
						selectRange={selectRange}
						tileContent={tileContent}
						next2Label={null}
						prev2Label={null}
						formatMonth={(locale, date) =>
							formatMonthLabel(selectedLanguage, date).toString()
						}
					/>

					<div className="calender-btn-msge">
						<div>
							<button
								className={`apply-dates-btn ${
									isButtonDisabled ? "disabled-button" : ""
								}`}
								onClick={handleApplyDates}
								disabled={isButtonDisabled}
							>
								<FormattedMessage id="calendar.applyDates" />
							</button>
						</div>
						<div className="calender-bottom-msge">
							{messageVisible && (
								<p
									style={{
										color: "red",
										display: "block",
									}}
								>
									<FormattedMessage id="calendar.maxLengthStay1" />
									<br />
									<FormattedMessage id="calendar.maxLengthStay2" />
								</p>
							)}
							{!messageVisible && averageRate !== null && (
								<p
									style={{
										color: "green",
										display: "block",
									}}
								>
									<FormattedMessage
										id="calendar.averageRate"
										values={{ averageRate }}
									/>
									{selectedCurrency === "USD"
										? `$${averageRate.toFixed(2)}`
										: selectedCurrency === "GBP"
										? `£${(averageRate * exchangeRate).toFixed(2)}`
										: selectedCurrency === "EUR"
										? `€${(averageRate * exchangeRate).toFixed(2)}`
										: ""}
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomCalendar;
