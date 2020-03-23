import React from 'react'

import Zoom from '@material-ui/core/Zoom'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	backToTop: {
		position: 'fixed',
		bottom: theme.spacing(8),
		right: theme.spacing(2),
	},
}))

const ScrollToTop = props => {
	const classes = useStyles()
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	})

	const handleClick = event => {
		const anchor = (event.target.ownerDocument || document).querySelector(props.where)

		if (anchor) {
			anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" className={classes.backToTop}>
				{props.children}
			</div>
		</Zoom>
	)
}

export default ScrollToTop
