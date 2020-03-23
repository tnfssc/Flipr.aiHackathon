import React, { useState, useEffect } from 'react'

import { getPersonalBoards } from '../../../constants'

import { useHistory, Route } from 'react-router-dom'

import { read_cookie } from 'sfcookies'

import axios from 'axios'

import Lists from './Lists'

import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import ButtonBase from '@material-ui/core/ButtonBase'

import CloseIcon from '@material-ui/icons/Close'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import DeleteIcon from '@material-ui/icons/Delete'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingBottom: 100,
	},
}))

const PersonalBoard = props => {
	const classes = useStyles()
	const history = useHistory()
	const [boards, setBoardsActual] = useState([])
	const [addingNewBoard, setAddingNewBoard] = useState(false)
	const [deletingBoard, setDeletingBoard] = useState(-1)
	const [loading, setLoading] = useState(false)

	const personalBoards = async (func, boardName, boardId) => {
		setLoading(true)
		const req = {
			username: read_cookie('loginCredentials').username,
			token: read_cookie('loginCredentials').token,
			func: func,
			boardName: boardName,
			boardId: boardId,
		}
		const res = await axios
			.post(getPersonalBoards, req)
			.then(response => response.data)
			.catch(error => error)
		setLoading(false)
		if (res === 'No') props.newSnack('Some error occured')
		else setBoardsActual(res || [])
	}

	const handleAddNewBoard = () => {
		setAddingNewBoard(true)
	}

	const addNewBoard = async newBoardName => {
		document.getElementById('new-board-name').value = ''
		setLoading(true)
		await personalBoards('new', newBoardName)
		setLoading(false)
		setAddingNewBoard(false)
		props.newSnack('New board created')
	}

	const deleteBoard = async deleteId => {
		setLoading(true)
		await personalBoards('delete', undefined, deleteId)
		setLoading(false)
		setDeletingBoard(-1)
	}

	const handleDeleteBoard = deleteId => {
		setDeletingBoard(deleteId)
	}

	useEffect(() => {
		if (props.loggedIn) {
			personalBoards('none')
			setTimeout(() => {
				props.newSnack('Login successful')
			}, 0)
		}
		// eslint-disable-next-line
	}, [props.loggedIn])

	if (!props.loggedIn) {
		setTimeout(() => {
			props.newSnack('Login to proceed')
			history.push('/')
		}, 0)
		return <></>
	} else {
		return (
			<Fade in>
				<main className={classes.content}>
					<Backdrop style={{ color: 'black', zIndex: 2000 }} open={loading}>
						<CircularProgress style={{ color: 'white' }} />
					</Backdrop>
					<Backdrop style={{ color: 'black', zIndex: 1900 }} open={deletingBoard !== -1}>
						<Toolbar>
							<ButtonGroup>
								<Button
									onClick={() => deleteBoard(deletingBoard)}
									variant="contained"
									color="secondary"
								>
									Confirm Delete
								</Button>
								<Button onClick={() => setDeletingBoard(-1)} variant="contained" color="default">
									Cancel
								</Button>
							</ButtonGroup>
						</Toolbar>
					</Backdrop>
					<Backdrop style={{ color: 'black', zIndex: 1900 }} open={addingNewBoard}>
						<Container component={Paper} style={{ width: '85%' }}>
							<Toolbar>
								<Typography style={{ flexGrow: 1 }} variant="h6">
									Create new Board
								</Typography>
								<IconButton onClick={() => setAddingNewBoard(false)}>
									<CloseIcon />
								</IconButton>
							</Toolbar>
							<Toolbar>
								<TextField
									style={{ margin: 20, marginBottom: 40 }}
									fullWidth
									variant="outlined"
									size="small"
									id="new-board-name"
									label="Board name"
								/>
								<Button
									style={{ margin: 20, marginBottom: 40 }}
									color="primary"
									variant="contained"
									onClick={() => addNewBoard(document.getElementById('new-board-name').value)}
								>
									Create
								</Button>
							</Toolbar>
						</Container>
					</Backdrop>
					<Toolbar>
						<Typography variant="h6" style={{ flexGrow: 1 }} noWrap>
							Personal Boards
						</Typography>
					</Toolbar>

					<Container style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
						<Route path="/boards/personal" exact>
							{boards.map((board, key) => {
								return (
									<Paper elevation={3} key={key} style={{ height: 200, width: 300, marginTop: 20 }}>
										<Toolbar style={{ backgroundColor: '#FFF8DC' }}>
											<Typography style={{ padding: 10, flexGrow: 1 }} variant="body1" noWrap>
												{board.title}
											</Typography>
											<IconButton onClick={() => handleDeleteBoard(board.boardId)}>
												<DeleteIcon />
											</IconButton>
										</Toolbar>
										<ButtonBase
											onClick={() => history.push('/boards/personal/' + board.boardId)}
											style={{ width: '100%', height: 136 }}
										>
											<Typography>Open</Typography>
										</ButtonBase>
									</Paper>
								)
							})}
							<Paper elevation={3} style={{ height: 200, width: 200, marginTop: 20 }}>
								<ButtonBase onClick={handleAddNewBoard} style={{ width: '100%', height: '100%' }}>
									<AddIcon style={{ color: 'black' }} />
								</ButtonBase>
							</Paper>
						</Route>
						{boards.map((board, key) => {
							return (
								<Route key={key} path={'/boards/personal/' + board.boardId} exact>
									<Lists {...props} setLoading={setLoading} board={board} />
								</Route>
							)
						})}
					</Container>
				</main>
			</Fade>
		)
	}
}

export default PersonalBoard
