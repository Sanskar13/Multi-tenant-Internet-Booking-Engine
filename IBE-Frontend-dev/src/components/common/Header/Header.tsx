import { ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IntlProvider, FormattedMessage } from "react-intl";
import { RootState } from "../../redux/store";
import { setCurrency, setLanguage } from "../../redux/slice/languageSlice";
import kickdrumImage from "../../../assets/kickdrum.png";
import connectionImage from "../../../assets/connection.png";
import dollarImage from "../../../assets/dollar.png";
import hamburgerImage from "../../../assets/hamburger.png";
import englishMessage from "../../locals/en.json";
import frenchMessage from "../../locals/fr.json";
import hindiMessage from "../../locals/hi.json";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { setLoggedIn, setUsername } from "../../redux/slice/authSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileModal from "./Profile/ProfileModal";
import {
	InteractionRequiredAuthError,
	InteractionStatus,
} from "@azure/msal-browser";
import { setTotalSum } from "../../redux/slice/totalSumSlice";
export const messages = {
	en: englishMessage,
	fr: frenchMessage,
	hi: hindiMessage,
};
interface Messages {
	[key: string]: { [key: string]: string };
}

export function Header() {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector(
		(state: RootState) => state.language.selectedLanguage
	);

	const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
	const { instance, inProgress, accounts } = useMsal();
	const [apiData] = useState(null);
	const isAuthenticated = useIsAuthenticated();
	const [showOptions, setShowOptions] = useState(false);
	const selectedCurrency = useSelector(
		(state: RootState) => state.language.selectedCurrency
	);

	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			dispatch(setUsername(storedUsername));
		}
	}, []);

	useEffect(() => {
		if (accounts.length) {
			const username = accounts[0].username;
			localStorage.setItem("username", username);
			dispatch(setUsername(username));
		}
	}, [accounts]);

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	const handleLanguageChange = (
		event: ChangeEvent<HTMLSelectElement>
	): void => {
		const selectedLanguage = event.target.value;
		dispatch(setLanguage(selectedLanguage));
	};

	const handleCurrencyChange = (
		event: ChangeEvent<HTMLSelectElement>
	): void => {
		const selectedCurrency = event.target.value;
		dispatch(setCurrency(selectedCurrency));
	};

	const localizedMessages = messages as Messages;

	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

	const handleProfileClick = () => {
		setIsProfileModalOpen(true);
	};

	const handleCloseProfileModal = () => {
		setIsProfileModalOpen(false);
	};

	const handleLoginIn = () => {
		if (isAuthenticated) {
			dispatch(setLoggedIn(false));
			instance.logoutRedirect();
		} else {
			dispatch(setLoggedIn(true));
			instance.loginRedirect();
		}
	};

	const [user, setUser] = useState({
		email: "",
		walletBalance: 0,
	});

	useEffect(() => {
		if (accounts.length) {
			dispatch(setLoggedIn(true));
			dispatch(setUsername(accounts[0].username));

			setUser({
				email: accounts[0].username,
				walletBalance: 0,
			});
		} else {
			dispatch(setLoggedIn(false));
			dispatch(setUsername(null));
		}

		const accessTokenRequest = {
			scopes: ["openid", "profile", "email"],
			account: accounts[0],
		};
		if (!apiData && inProgress === InteractionStatus.None) {
			instance
				.acquireTokenSilent(accessTokenRequest)
				.then((accessTokenResponse) => {
					const accessToken = accessTokenResponse.accessToken;
					try {
						setUser({
							email: accounts[0].username,
							walletBalance: 0,
						});
					} catch (error) {
						console.error("Error decoding access token:", error);
					}
				})
				.catch((error) => {
					if (error instanceof InteractionRequiredAuthError) {
						instance.acquireTokenRedirect(accessTokenRequest);
					}
					console.log(error);
				});
		}
	}, [instance, accounts, inProgress, apiData]);

	useEffect(() => {
		const fetchPurchases = async () => {
			try {
				const response = await fetch(
					"https://team14-ibe-kdu24.azurewebsites.net/wallet-details"
				);

				if (response.ok) {
					const data = await response.json();
					const verifyEmail = accounts[0].username;
					const filteredData = data.filter(
						(item) => item.email === verifyEmail
					);

					const totalAmountSum = filteredData.reduce(
						(acc, curr) => acc + curr.totalAmount,
						0
					);
					dispatch(
						setTotalSum({ email: verifyEmail, totalSum: totalAmountSum })
					);

					setUser({
						email: accounts[0].username,
						walletBalance: totalAmountSum,
					});
				} else {
					console.error("Failed to fetch purchases:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching purchases:", error);
			}
		};
		fetchPurchases();
	}, [isProfileModalOpen]);

	return (
		<div className="header-container">
			<IntlProvider
				locale={selectedLanguage}
				messages={localizedMessages[selectedLanguage]}
			>
				<div className="header-title">
					<Link to="/">
						<span className="header-name">
							<img src={kickdrumImage} alt="kickdrum-logo" />
						</span>
					</Link>
					<span className="header-name">
						<FormattedMessage id="header.title" />
					</span>
				</div>
				<div className="header-preferences">
					{isLoggedIn ? (
						<div className="preference-booking">
							<Link
								className="my-booking-link"
								style={{
									textDecoration: "none",
									fontWeight: 600,
									color: "black",
									cursor: "pointer",
									boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)",
								}}
								to="/mybooking"
							>
								<FormattedMessage id="header.myBookings" />
							</Link>
						</div>
					) : (
						<div className="preference-booking">
							<span style={{ fontWeight: 600, color: "black" }}>
								<FormattedMessage id="header.myBookings" />
							</span>
						</div>
					)}

					<div className="preference-dropdown">
						<div className="preference">
							<img
								src={connectionImage}
								alt="connection-lang"
								className="lang-logo"
							/>
							<div className="lang-dropdown">
								<select
									value={selectedLanguage}
									onChange={handleLanguageChange}
								>
									<option value="en">En</option>
									<option value="fr">Fr</option>
									<option value="hi">Hi</option>
								</select>
							</div>
						</div>
						<div className="preference" id="currency-selection">
							<img
								src={dollarImage}
								alt="connection-currency"
								className="currency-logo"
							/>
							<select
								value={selectedCurrency}
								onChange={handleCurrencyChange}
								className="select-currency"
							>
								<option value="USD">USD</option>
								<option value="EUR">EUR</option>
								<option value="GBP">GBP</option>
							</select>
						</div>
					</div>
					<div className="preference">
						<button
							onClick={handleLoginIn}
							type="submit"
							className="preference-btn"
						>
							{isLoggedIn ? "LOGOUT" : "LOGIN"}
						</button>
					</div>
					<div className="profile-icon" onClick={handleProfileClick}>
						{isLoggedIn && (
							<AccountCircleIcon
								style={{ height: "3rem", width: "3rem", cursor: "pointer" }}
								onClick={handleProfileClick}
							/>
						)}
					</div>
				</div>

				<div className="hamburger-menu" onClick={toggleOptions}>
					<img src={hamburgerImage} alt="Hamburger Menu" />
				</div>

				{showOptions && (
					<div className="options">
						<div className="option">
							<div>
								<img
									src={connectionImage}
									alt="connection-lang"
									className="lang-logo"
								/>
							</div>
							<div>
								<select
									value={selectedLanguage}
									onChange={handleLanguageChange}
								>
									<option value="en">en</option>
									<option value="fr">fr</option>
									<option value="hi">hi</option>
								</select>
							</div>
						</div>
						<div className="option">
							<div>
								<img
									src={dollarImage}
									alt="connection-currency"
									className="currency-logo"
								/>
							</div>
							<div>
								<select
									value={selectedCurrency}
									onChange={handleCurrencyChange}
								>
									<option value="USD">USD</option>
									<option value="EUR">EUR</option>
									<option value="GBP">GBP</option>
								</select>
							</div>
						</div>
					</div>
				)}
				<ProfileModal
					isOpen={isProfileModalOpen}
					onClose={handleCloseProfileModal}
					user={user}
				/>
			</IntlProvider>
		</div>
	);
}
