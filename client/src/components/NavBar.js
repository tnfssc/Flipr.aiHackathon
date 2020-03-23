import React, { useState } from 'react'

import axios from 'axios'

import { read_cookie, delete_cookie } from 'sfcookies'

import { useHistory } from 'react-router-dom'

import SideDrawer from './Drawer'

import { logoutAddress } from '../constants'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import Button from '@material-ui/core/Button'

const drawerWidth = 240
const useStyles = makeStyles(theme => ({
	drawer: {
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	NavBar: {
		backgroundColor: '#1976D2',
	},
	drawerPaper: {
		width: drawerWidth,
	},
}))

const HideOnScroll = props => {
	const trigger = useScrollTrigger()
	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{props.children}
		</Slide>
	)
}

const NavBar = props => {
	const classes = useStyles()
	const history = useHistory()
	const [drawerOpen, setDrawerOpen] = useState(false)

	const handleDrawerToggle = open => {
		setDrawerOpen(open)
	}

	const handleLogout = async () => {
		const res = await axios.post(logoutAddress, read_cookie('loginCredentials'))
		delete_cookie('loginCredentials')
		setTimeout(() => {
			props.newSnack(res.data)
		}, 1000)
		props.setLoggedIn(false)
		history.push('/')
	}

	return (
		<>
			<HideOnScroll>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar className={classes.NavBar}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => handleDrawerToggle(true)}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" noWrap>
							Krello
						</Typography>
						<Typography style={{ flexGrow: 1 }}></Typography>
						{props.loggedIn ? (
							<Button onClick={handleLogout} style={{ color: 'white' }}>
								Logout
							</Button>
						) : (
							<></>
						)}
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<nav className={classes.drawer}>
				<Hidden mdUp implementation="css">
					<SwipeableDrawer
						anchor="left"
						open={drawerOpen}
						onOpen={() => handleDrawerToggle(true)}
						onClose={() => handleDrawerToggle(false)}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true,
						}}
					>
						<SideDrawer />
					</SwipeableDrawer>
				</Hidden>
				<Hidden smDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open
					>
						<SideDrawer />
					</Drawer>
				</Hidden>
			</nav>
		</>
	)
}

export default NavBar
