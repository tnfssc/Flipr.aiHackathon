import React, { useState } from 'react'

import axios from 'axios'

import { useHistory } from 'react-router-dom'

import { registerAddress } from '../constants'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingBottom: 100,
	},
	heading: {
		padding: 10,
	},
	formWrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
	textField: {
		margin: 20,
	},
	errorMsg: {
		color: 'red',
		padding: 10,
	},
}))

const RegisterPage = props => {
	const classes = useStyles()
	const history = useHistory()

	const [formData, setFormData] = useState({})
	const [errorMsg, setErrorMsg] = useState('')

	const handleChange = event => {
		setFormData({ ...formData, [event.target.id]: event.target.value })
	}

	const validateForm = () => {
		if (formData.username && formData.password && formData.confirmpassword && formData.email) {
			if (formData.username.length < 4) {
				setErrorMsg('Username must be longer than 4 characters')
				return false
			} else if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
				setErrorMsg('Enter a valid email')
				return false
			} else if (formData.password.length < 8) {
				setErrorMsg('Password must be longer than 8 characters')
				return false
			} else if (formData.confirmpassword !== formData.password) {
				setErrorMsg('Password does not match with confirm password')
				return false
			} else return true
		} else {
			setErrorMsg('All fields are mandatory')
			return false
		}
	}

	const handleSubmit = async () => {
		setErrorMsg('')
		if (validateForm()) {
			const res = await axios
				.post(registerAddress, formData)
				.then(response => response.data)
				.catch(error => error)
			if (res === 'Registered') {
				props.newSnack('Please click the link in an email sent to the registered Email ID')
				history.push('/account/login')
			} else setErrorMsg(res)
		}
	}

	return (
		<Fade in>
			<main className={classes.content}>
				<Typography className={classes.heading} variant="h4">
					Register
				</Typography>
				<form className={classes.formWrapper}>
					<TextField
						className={classes.textField}
						autoComplete="new-password"
						onChange={handleChange}
						id="username"
						label="Username"
						variant="outlined"
						fullWidth
					/>
					<TextField
						className={classes.textField}
						autoComplete="new-password"
						onChange={handleChange}
						id="email"
						label="Email"
						variant="outlined"
						fullWidth
					/>
					<TextField
						className={classes.textField}
						autoComplete="new-password"
						onChange={handleChange}
						id="password"
						type="password"
						label="Password"
						variant="outlined"
						fullWidth
					/>
					<TextField
						className={classes.textField}
						autoComplete="new-password"
						onChange={handleChange}
						id="confirmpassword"
						type="password"
						label="Confirm Password"
						variant="outlined"
						fullWidth
					/>
					<Typography className={classes.errorMsg}>{errorMsg}</Typography>
					<Button color="primary" variant="contained" onClick={handleSubmit}>
						Register
					</Button>
				</form>
			</main>
		</Fade>
	)
}

export default RegisterPage
