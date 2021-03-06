import {Fragment, FunctionComponent, useContext, useMemo} from 'react'
import {BrowserRouter, Redirect, Route, useHistory} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import {ContextTheme, ThemeProvider} from "./Context/ContextTheme";
import {
	AuthenticationProvider, ContextAuthentication,
} from "./Context/ContextAuthentication";

import { MyDrivePage } from './Pages/MyDrive/MyDrivePage'
import { LoginPage } from './Pages/Login/LoginPage'

import {RoutesPath} from "./Config/Routes"
import {store} from "./Store";

import 'moment/locale/fr'
import './Styles/index.sass'
import './Styles/var.sass'
import 'react-toastify/dist/ReactToastify.css'
import {Provider} from "react-redux";
import {SettingsPage} from "./Pages/Settings/SettingsPage";

const ProtectedRoutes: FunctionComponent = () => {
	const authenticationContext = useContext(ContextAuthentication)
	const history = useHistory()

	const authenticationKey = useMemo(() => authenticationContext.authenticationKey, [authenticationContext])

	if (authenticationKey === null) {
		history.push(RoutesPath.login.target)
	}

	if (authenticationKey) {
		return (
			<Fragment>
				<Route exact path={RoutesPath.myDrive.target}>
					<MyDrivePage authenticationKey={authenticationKey}/>
				</Route>
				<Route exact path={RoutesPath.settings.target}>
					<SettingsPage/>
				</Route>
			</Fragment>
		)
	}
	return (
		<p>Loading...</p>
	)
}

const RouteApp: FunctionComponent = () => {
	const themeContext = useContext(ContextTheme)

	return <BrowserRouter>
		<Route exact path="/">
			<Redirect to={RoutesPath.myDrive.target} />
		</Route>

		<ProtectedRoutes/>

		<Route exact path={RoutesPath.login.target} component={LoginPage} />
		<ToastContainer position="bottom-right" autoClose={2000} theme={themeContext.theme}/>
	</BrowserRouter>
}

export const App: FunctionComponent = () => {
	return (
		<Provider store={store}>
			<AuthenticationProvider>
				<ThemeProvider>
					<RouteApp/>
				</ThemeProvider>
			</AuthenticationProvider>
		</Provider>
	)
}
