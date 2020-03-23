import React, { useState, useEffect } from 'react'

import { Switch, Route, useHistory } from 'react-router-dom'
import axios from 'axios'
import { read_cookie } from 'sfcookies'

import { checkToken } from './constants'

import Home from './views/HomePage'
import Error404Page from './views/404ErrorPage'
import RegisterPage from './views/RegisterPage'
import LoginPage from './views/LoginPage'
import ForgotPassPage from './views/ForgotPassPage'
import PersonalBoard from './views/Boards/Personal/main'
import TeamsPage from './views/Boards/Team/teams'

import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Snacks from './components/Snacks'
import ScrollToTop from './components/ScrollToTop'

import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'

import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%',
		margin: 0,
		display: 'flex',
		flexDirection: 'column',
	},
	toolbar: theme.mixins.toolbar,
	main: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
		position: 'relative',
		height: '100vh',
	},
	backToTop: {
		position: 'fixed',
		bottom: theme.spacing(8),
		right: theme.spacing(2),
	},
}))

const allPages = [
	{
		view: Home,
		path: '/',
		exact: true,
	},
	{
		view: RegisterPage,
		path: '/account/register',
		exact: true,
	},
	{
		view: LoginPage,
		path: '/account/login',
		exact: true,
	},
	{
		view: ForgotPassPage,
		path: '/account/forgotpass',
		exact: true,
	},
	{
		view: PersonalBoard,
		path: '/boards/personal',
		exact: false,
	},
	{
		view: TeamsPage,
		path: '/boards/teams',
		exact: true,
	},
]

const App = () => {
	const classes = useStyles()
	const history = useHistory()

	const [snackOpen, setSnackOpen] = useState(false)
	const [snackMessage, setSnackMessage] = useState('Test')
	const [snackClickawayCount, setSnackClickawayCount] = useState(0)
	const [loggedIn, setLoggedIn] = useState(false)
	const [loading, setLoading] = useState(false)
	const [team, setTeam] = useState('')

	const validateToken = async () => {
		const credentials = read_cookie('loginCredentials')
		if (credentials === undefined) return false
		setLoading(true)
		const res = await axios.post(checkToken, credentials).catch(error => error)
		setLoading(false)
		if (res.data === 'Session Valid') return true
		else return false
	}

	useEffect(() => {
		validateToken().then(valid => {
			if (valid) {
				setLoggedIn(true)
				history.push('/boards/personal')
			} else {
				setLoggedIn(false)
				history.push('/')
			}
		})
		// eslint-disable-next-line
	}, [loggedIn])

	const snackFunc = {
		newSnack: message => {
			setSnackMessage(message)
			setSnackOpen(true)
		},
		snacksClose: (event, reason) => {
			if (reason === 'clickaway') {
				if (snackClickawayCount === 1) {
					setSnackOpen(false)
					setSnackClickawayCount(0)
				} else setSnackClickawayCount(snackClickawayCount + 1)
			} else setSnackOpen(false)
		},
	}

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Snacks open={snackOpen} text={snackMessage} handleClose={snackFunc.snacksClose} />
			<NavBar newSnack={snackFunc.newSnack} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
			<Backdrop style={{ color: 'black', zIndex: 2000 }} open={loading}>
				<CircularProgress style={{ color: 'white' }} />
			</Backdrop>
			<div className={classes.main}>
				<div id="back-to-top-anchor" />
				<div className={classes.toolbar} />
				<Switch>
					{allPages.map((Page, key) => {
						return (
							<Route key={key} path={Page.path} exact={Page.exact}>
								<Page.view
									team={team}
									setTeam={setTeam}
									loggedIn={loggedIn}
									setLoggedIn={setLoggedIn}
									newSnack={snackFunc.newSnack}
								/>
							</Route>
						)
					})}
					<Route path="/">
						<Error404Page />
					</Route>
				</Switch>
				<ScrollToTop where="#back-to-top-anchor">
					<Fab color="secondary">
						<KeyboardArrowUpIcon />
					</Fab>
				</ScrollToTop>
				<Footer />
				<div id="down-at-bottom-anchor" />
			</div>
		</div>
	)
}

export default App
