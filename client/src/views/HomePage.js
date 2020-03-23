import React from 'react'

import { useHistory } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingBottom: 100,
	},
	accountBtn: {
		width: '100%',
		padding: 50,
		border: '0.5px solid',
	},
	accountBtnWrapper: {
		display: 'flex',
		width: '70%',
		justifyContent: 'center',
		padding: 10,
	},
}))

const Home = props => {
	const classes = useStyles()
	const history = useHistory()

	const handleClick = to => {
		history.push(to)
	}

	return (
		<Fade in>
			<main className={classes.content}>
				<div className={classes.accountBtnWrapper}>
					<ButtonBase
						onClick={() => handleClick('/account/register')}
						component={Paper}
						className={classes.accountBtn}
					>
						<Typography variant="body2">Register a new account</Typography>
					</ButtonBase>
				</div>
				<div className={classes.accountBtnWrapper}>
					<ButtonBase
						onClick={() => handleClick('/account/login')}
						component={Paper}
						className={classes.accountBtn}
					>
						<Typography variant="body2">Login</Typography>
					</ButtonBase>
				</div>
				<div className={classes.accountBtnWrapper}>
					<ButtonBase
						onClick={() => handleClick('/account/forgotpass')}
						component={Paper}
						className={classes.accountBtn}
					>
						<Typography variant="body2">Forgot Password</Typography>
					</ButtonBase>
				</div>
			</main>
		</Fade>
	)
}

export default Home
