import React, { useState, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import axios from 'axios'

import { read_cookie } from 'sfcookies'

import { getTeams, createTeamAddress } from '../../../constants'

import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'

import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingBottom: 100,
	},
}))

const TeamsPage = props => {
	const history = useHistory()
	const classes = useStyles()
	const [loadingTeams, setLoadingTeams] = useState(false)
	const [teams, setTeams] = useState([])
	const [teamSelected, setTeamSelected] = useState('')
	const [creatingTeam, setCreatingTeam] = useState(-1)

	const fetchTeams = async () => {
		setLoadingTeams(true)
		const req = {
			username: read_cookie('loginCredentials').username,
			token: read_cookie('loginCredentials').token,
		}
		const res = await axios
			.post(getTeams, req)
			.then(data => data.data)
			.catch(error => error)
		setTeams(res || [])
		setLoadingTeams(false)
	}

	const handleCreateTeam = () => {
		setCreatingTeam(1)
	}

	const handleChangeTeamSelected = event => {
		event.preventDefault()
		setTeamSelected(event.target.value)
	}

	useEffect(() => {
		if (!props.loggedIn) {
			setTimeout(() => history.push('/'))
		} else fetchTeams()
		// eslint-disable-next-line
	}, [props.loggedIn])

	const createNewTeam = async teamName => {
		setLoadingTeams(true)
		const req = {
			username: read_cookie('loginCredentials').username,
			token: read_cookie('loginCredentials').token,
			teamName: teamName,
		}
		const res = await axios
			.post(createTeamAddress, req)
			.then(data => data.data)
			.catch(error => error)
		props.newSnack(res)
		document.getElementById('new-team-name').value = ''
		fetchTeams()
		setLoadingTeams(false)
		setCreatingTeam(-1)
	}

	return (
		<Fade in>
			<main className={classes.content}>
				<Backdrop style={{ color: 'black', zIndex: 2000 }} open={loadingTeams}>
					<CircularProgress style={{ color: 'white' }} />
				</Backdrop>
				<Backdrop style={{ color: 'black', zIndex: 1900 }} open={creatingTeam !== -1}>
					<Container component={Paper} style={{ width: '85%' }}>
						<Toolbar>
							<Typography style={{ flexGrow: 1 }} variant="h6">
								Create new Team
							</Typography>
							<IconButton onClick={() => setCreatingTeam(-1)}>
								<CloseIcon />
							</IconButton>
						</Toolbar>
						<Toolbar>
							<TextField
								style={{ margin: 20, marginBottom: 40 }}
								fullWidth
								variant="outlined"
								size="small"
								id="new-team-name"
								label="Team name"
							/>
							<Button
								style={{ margin: 20, marginBottom: 40 }}
								color="primary"
								variant="contained"
								onClick={() => createNewTeam(document.getElementById('new-team-name').value)}
							>
								Create
							</Button>
						</Toolbar>
					</Container>
				</Backdrop>
				<Toolbar>
					<FormControl variant="outlined">
						<InputLabel id="demo-simple-select-outlined-label">Select Team</InputLabel>
						<Select
							variant="outlined"
							style={{ minWidth: 200 }}
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							value={teamSelected}
							onChange={handleChangeTeamSelected}
							label="Select Team"
						>
							{teams.map((team, key) => (
								<MenuItem key={key} value={team.teamId}>
									{team.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Typography style={{ flexGrow: 1 }}></Typography>
					<Button onClick={handleCreateTeam} color="secondary" variant="contained">
						Create new Team
					</Button>
				</Toolbar>
			</main>
		</Fade>
	)
}

export default TeamsPage
