import React, { ReactElement } from "react";
import { Router, BrowserRouter, Route, Switch } from "react-router-dom";
// import { ThemeProvider} from "@mui/styles";
import { ThemeProvider} from "@mui/material/styles";
import { StyledEngineProvider, Theme } from '@mui/material/styles';
import { glLightTheme } from "./_theme/glLightTheme";
import { glDarkTheme } from "./_theme/glDarkTheme";
import { history } from "./_helpers/history";
import { PrivateRoute } from "./_components/PrivateRoute";
import { useDarkMode } from "./_helpers/hooks/useDarkMode";
import { authenticationService } from "./_services/authenticationService";
import { PrivateUnAuthedRoute } from "./_components/PrivateUnauthedRoute";
import { PrivateExternalRoute } from "./_components/PrivateExternalRoute";
// import StylesProvider from '@mui/styles/StylesProvider';
import HomePage from "./HomePage";
import ForgottenPasswordPage from "./ForgottenPasswordPage";
import ForgottenUsernamePage from "./ForgottenUsernamePage";
import ResetPasswordPage from "./ResetPasswordPage";
import SettingsPage from "./SettingsPage";
import DualAuthPage from "./DualAuthPage";
import ChallengePage from "./ChallengePage";
import ErrorBoundary from "./ErrorBoundary";
import GdprPage from "./GdprPage";
import GlobalStyles from "./GlobalStyles";
import ReviewPage from "./ReviewPage";
import RequestAccessPage from "./RequestAccessPage";
import ValidateIDPage from "./ValidateIDPage";
import LoginPage2 from "./LoginPage2";
import Saml from "./Saml";
import InvestigationPage from "./InvestigationPage";
import { StylesProvider } from "@mui/styles";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const App = (): ReactElement => {
  const [theme] = useDarkMode();
  const themeMode = theme === "light" ? glLightTheme : glDarkTheme;

  return (
      <StyledEngineProvider injectFirst>
        <StylesProvider injectFirst>
        <ThemeProvider theme={themeMode}>
          <BrowserRouter>
            <Router history={history}>
              <GlobalStyles />
              <ErrorBoundary>
                <Switch>
                  <Route path="/forgottenPassword" component={ForgottenPasswordPage} />
                  <Route path="/forgottenUsername" component={ForgottenUsernamePage} />
                  <Route path="/gdpr_" component={GdprPage} />
                  <Route path="/resetPassword/:token?" component={ResetPasswordPage} />
                  <Route path="/dualAuth" component={DualAuthPage} />
                  <Route path="/challenge" component={ChallengePage} />
                  <Route path="/requestAccess" component={RequestAccessPage} />
                  <Route path="/validate/:urlCode?" component={ValidateIDPage} />

                  <PrivateExternalRoute
                    path="/review/:caseId"
                    component={ReviewPage}
                    user={authenticationService}
                  />
                  <PrivateRoute
                    path="/settings"
                    component={SettingsPage}
                    user={authenticationService}
                  />
                  <Route path="/saml" component={Saml} />
                  <Route path="/login" component={LoginPage2} />
                  {/* this should only match a single route part i.e /qic but not /user/page or /user/page/tab etc */}
                  <PrivateUnAuthedRoute
                    path="/:tenant/"
                    exact
                    component={LoginPage2}
                    user={authenticationService}
                  />

                  <PrivateRoute
                    path="/investigation"
                    component={InvestigationPage}
                    user={authenticationService}
                  />
                  <PrivateRoute component={HomePage} user={authenticationService} />
                </Switch>
              </ErrorBoundary>
            </Router>
          </BrowserRouter>
        </ThemeProvider>
        </StylesProvider>
      </StyledEngineProvider>
  );
};

export default App;
