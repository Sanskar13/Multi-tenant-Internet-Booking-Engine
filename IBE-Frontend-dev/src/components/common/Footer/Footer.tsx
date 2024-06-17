import { useSelector } from "react-redux";
import "./Footer.scss";
import { FormattedMessage, IntlProvider } from "react-intl";
import { RootState } from "../../redux/store";
import { messages } from "../Header/Header";

interface Messages {
  [key: string]: { [key: string]: string };
}

export function Footer() {
  const selectedLanguage = useSelector(
    (state: RootState) => state.language.selectedLanguage
  );

  const localizedMessages = messages as Messages;

  return (
    <div className="footer-container">
      <IntlProvider
        locale={selectedLanguage}
        messages={localizedMessages[selectedLanguage]}
      >
        <div className="footer-kd">
          <FormattedMessage id="footer.kickdrum" />
        </div>
        <div className="footer-legal-actions">
          <div className="footer-rights">
            <FormattedMessage id="footer.technologyGroup" />
          </div>
          <div className="footer-rights">
            <FormattedMessage id="footer.allRightsReserved" />
          </div>
        </div>
      </IntlProvider>
    </div>
  );
}
