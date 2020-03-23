import React from 'react'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'

import GitHubIcon from '@material-ui/icons/GitHub'

const drawerWidth = 240
const useStyles = makeStyles(theme => ({
	footer: {
		bottom: 0,
		backgroundColor: '#3F51B5',
		width: '100%',
		color: 'white',
		position: 'fixed',
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
		},
	},
	leftText: {
		display: 'flex',
		justifyContent: 'flex-start',
		width: '50%',
	},
	rightText: { display: 'flex', justifyContent: 'flex-end', width: '50%' },
	footerLink: {
		display: 'flex',
		justifyContent: 'flex-end',
		color: 'white',
		textDecoration: 'none',
	},
	footerBar: {
		backgroundColor: '#1976D2',
	},
}))

const HideOnScroll = props => {
	const trigger = useScrollTrigger()
	return (
		<Slide appear={false} direction="up" in={!trigger}>
			{props.children}
		</Slide>
	)
}

const ScrollToBottom = props => {
	const handleClick = event => {
		const anchor = (event.target.ownerDocument || document).querySelector(props.where)
		if (anchor) {
			anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}
	return <div onClick={handleClick}>{props.children}</div>
}

const Footer = props => {
	const classes = useStyles()
	return (
		<HideOnScroll>
			<div className={classes.footer}>
				<ScrollToBottom where="#down-at-bottom-anchor">
					<Toolbar className={classes.footerBar} variant="dense">
						<Typography className={classes.leftText}></Typography>
						<Typography className={classes.rightText}>
							<a className={classes.footerLink} href="https://github.com/tnfssc">
								<GitHubIcon />
								|tnfssc
							</a>
						</Typography>
					</Toolbar>
				</ScrollToBottom>
			</div>
		</HideOnScroll>
	)
}

export default Footer
