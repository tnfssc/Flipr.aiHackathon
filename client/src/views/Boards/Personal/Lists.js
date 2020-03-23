import React, { useState, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { getLists, getCards } from '../../../constants'

import { read_cookie } from 'sfcookies'

import axios from 'axios'

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
import AddIcon from '@material-ui/icons/Add'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const Lists = props => {
	const history = useHistory()
	const [lists, setLists] = useState([])
	const [creatingNewList, setCreatingNewList] = useState(false)
	const [addingNewCard, setAddingNewCard] = useState(false)
	const [newCardListId, setNewCardListId] = useState(-1)
	const [deletingList, setDeletingList] = useState(-1)
	const [deletingCard, setDeletingCard] = useState(-1)
	const [editingCard, setEditingCard] = useState(-1)

	const handleBack = () => {
		props.setLoading(true)
		setTimeout(() => {
			props.setLoading(false)
		}, 300)
		history.push('/boards/personal')
	}

	const Lists = async (func, boardId, listId, listName) => {
		props.setLoading(true)
		const req = {
			username: read_cookie('loginCredentials').username,
			token: read_cookie('loginCredentials').token,
			func: func,
			boardId: boardId,
			listName: listName,
			listId: listId,
		}
		const res = await axios
			.post(getLists, req)
			.then(response => response.data)
			.catch(error => error)
		if (res === 'No') props.newSnack('Some error occured')
		else {
			if (Array.isArray(res)) {
				for (var i = 0; i < res.length; i++) {
					res[i].cards = await Cards('none', undefined, undefined, undefined, res[i].listId)
				}
			}
			setTimeout(() => setLists(res || []), 0)
		}
		props.setLoading(false)
	}

	const Cards = async (func, cardName, cardDueDate, cardId, listId, cardState) => {
		props.setLoading(true)
		const req = {
			username: read_cookie('loginCredentials').username,
			token: read_cookie('loginCredentials').token,
			func: func,
			listId: listId,
			cardName: cardName,
			cardId: cardId,
			state: cardState,
			dueDate: cardDueDate,
		}
		const res = await axios
			.post(getCards, req)
			.then(response => response.data)
			.catch(error => error)
		props.setLoading(false)
		if (res === 'No') {
			props.newSnack('Some error occured')
			return { title: 'Error occured' }
		} else {
			return res
		}
	}

	const handleAddNewCard = async listId => {
		setNewCardListId(listId)
		setAddingNewCard(true)
	}

	const handleDeleteList = listId => {
		setDeletingList(listId)
	}

	const deleteCard = async () => {
		props.setLoading(true)
		await Cards('delete', undefined, undefined, deletingCard)
		await Lists('none', props.board.boardId)
		props.setLoading(false)
		setDeletingCard(-1)
	}

	const deleteList = async () => {
		props.setLoading(true)
		await Lists('delete', props.board.boardId, deletingList)
		props.setLoading(false)
		setDeletingList(-1)
	}

	const handleAddNewList = () => {
		setCreatingNewList(true)
	}

	const addNewCard = async () => {
		const newCardName = document.getElementById('new-card-name').value
		const newCardDueDate = document.getElementById('new-card-date').value
		setAddingNewCard(false)
		document.getElementById('new-card-date').value = ''
		document.getElementById('new-card-name').value = ''
		props.setLoading(true)
		await Cards('new', newCardName, newCardDueDate, undefined, newCardListId)
		await Lists('none', props.board.boardId)
		props.setLoading(false)
	}

	const addNewList = async () => {
		const newListName = document.getElementById('new-list-name').value
		setCreatingNewList(false)
		document.getElementById('new-list-name').value = ''
		props.setLoading(true)
		await Lists('new', props.board.boardId, undefined, newListName).catch(error => error)
		props.setLoading(false)
	}

	const handleDeleteCard = cardId => {
		setDeletingCard(cardId)
	}

	const updateCard = async (card, cardState) => {
		props.setLoading(true)
		await Cards('update', card.title, card.dueDate, card.cardId, card.listId, cardState)
		await Lists('none', props.board.boardId)
		props.setLoading(false)
		setEditingCard(-1)
	}

	useEffect(() => {
		Lists('none', props.board.boardId)
		// eslint-disable-next-line
	}, [props.loggedIn])

	return (
		<Fade in>
			<Container>
				<Button onClick={handleBack} variant="outlined" startIcon={<ArrowBackIosIcon />}>
					Back
				</Button>
				<Backdrop style={{ color: 'black', zIndex: 1900 }} open={deletingList !== -1}>
					<Toolbar>
						<ButtonGroup>
							<Button onClick={() => deleteList(deletingList)} variant="contained" color="secondary">
								Confirm Delete
							</Button>
							<Button onClick={() => setDeletingList(-1)} variant="contained" color="default">
								Cancel
							</Button>
						</ButtonGroup>
					</Toolbar>
				</Backdrop>
				<Backdrop style={{ color: 'black', zIndex: 1900 }} open={deletingCard !== -1}>
					<Toolbar>
						<ButtonGroup>
							<Button onClick={() => deleteCard(deletingCard)} variant="contained" color="secondary">
								Confirm Delete
							</Button>
							<Button onClick={() => setDeletingCard(-1)} variant="contained" color="default">
								Cancel
							</Button>
						</ButtonGroup>
					</Toolbar>
				</Backdrop>
				<Backdrop style={{ color: 'black', zIndex: 1900 }} open={addingNewCard}>
					<Container component={Paper} style={{ width: '85%' }}>
						<Toolbar>
							<Typography style={{ flexGrow: 1 }} variant="h6">
								Create new Card
							</Typography>
							<IconButton onClick={() => setAddingNewCard(false)}>
								<CloseIcon />
							</IconButton>
						</Toolbar>
						<Toolbar>
							<TextField
								style={{ margin: 20, marginBottom: 40 }}
								fullWidth
								variant="outlined"
								size="small"
								id="new-card-name"
								label="Card name"
							/>
						</Toolbar>
						<Toolbar>
							<TextField
								style={{ margin: 20, marginBottom: 40 }}
								fullWidth
								type="date"
								variant="outlined"
								size="small"
								id="new-card-date"
								label="Card due date"
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</Toolbar>
						<Toolbar>
							<Button
								style={{ margin: 20, marginBottom: 40 }}
								color="primary"
								variant="contained"
								onClick={addNewCard}
							>
								Create
							</Button>
						</Toolbar>
					</Container>
				</Backdrop>
				<Backdrop style={{ color: 'black', zIndex: 1900 }} open={creatingNewList}>
					<Container component={Paper} style={{ width: '85%' }}>
						<Toolbar>
							<Typography style={{ flexGrow: 1 }} variant="h6">
								Create new List
							</Typography>
							<IconButton onClick={() => setCreatingNewList(false)}>
								<CloseIcon />
							</IconButton>
						</Toolbar>
						<Toolbar>
							<TextField
								style={{ margin: 20, marginBottom: 40 }}
								fullWidth
								variant="outlined"
								size="small"
								id="new-list-name"
								label="List name"
							/>
							<Button
								style={{ margin: 20, marginBottom: 40 }}
								color="primary"
								variant="contained"
								onClick={addNewList}
							>
								Create
							</Button>
						</Toolbar>
					</Container>
				</Backdrop>
				<Container style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
					{lists.map((list, key) => {
						return (
							<Paper elevation={3} key={key} style={{ minHeight: 200, width: 300, marginTop: 20 }}>
								<Toolbar style={{ backgroundColor: '#FFF8DC' }}>
									<Typography style={{ padding: 10, flexGrow: 1 }} variant="body1" noWrap>
										{list.title}
									</Typography>
									<IconButton onClick={() => handleDeleteList(list.listId)}>
										<DeleteIcon />
									</IconButton>
								</Toolbar>
								{Array.isArray(list.cards)
									? list.cards.map((card, cardKey) => {
											return (
												<Toolbar key={cardKey}>
													<Backdrop
														style={{ color: 'black', zIndex: 1900 }}
														open={editingCard === card.cardId}
													>
														<Container component={Paper} style={{ width: '85%' }}>
															<Toolbar>
																<Typography style={{ flexGrow: 1 }} variant="h6">
																	{card.title}
																</Typography>
																<Typography>{card.dueDate}</Typography>
																<IconButton onClick={() => setEditingCard(-1)}>
																	<CloseIcon />
																</IconButton>
															</Toolbar>
															<Toolbar>
																<TextField
																	style={{ margin: 20, marginBottom: 40 }}
																	fullWidth
																	variant="outlined"
																	size="small"
																	id={'update-card-state' + card.cardId}
																	label="Card new State"
																	defaultValue={card.state}
																/>
																<Button
																	style={{ margin: 20, marginBottom: 40 }}
																	color="primary"
																	variant="contained"
																	onClick={() =>
																		updateCard(
																			card,
																			document.getElementById(
																				'update-card-state' + card.cardId
																			).value
																		)
																	}
																>
																	Update
																</Button>
															</Toolbar>
														</Container>
													</Backdrop>
													<Typography
														onClick={() => setEditingCard(card.cardId)}
														style={{ padding: 10, flexGrow: 1 }}
														variant="body1"
														noWrap
													>
														{card.title}
													</Typography>
													<Typography
														onClick={() => setEditingCard(card.cardId)}
														style={{ color: 'red' }}
													>
														{card.state}
													</Typography>
													<IconButton onClick={() => handleDeleteCard(card.cardId)}>
														<CloseIcon />
													</IconButton>
												</Toolbar>
											)
									  })
									: ''}
								<Toolbar>
									<Typography style={{ padding: 10, flexGrow: 1 }} variant="body1" noWrap />
									<IconButton onClick={() => handleAddNewCard(list.listId)}>
										<AddIcon />
									</IconButton>
								</Toolbar>
							</Paper>
						)
					})}
					<Paper elevation={3} style={{ height: 200, width: 200, marginTop: 20 }}>
						<ButtonBase onClick={handleAddNewList} style={{ width: '100%', height: '100%' }}>
							<AddIcon style={{ color: 'black' }} />
						</ButtonBase>
					</Paper>
				</Container>
			</Container>
		</Fade>
	)
}

export default Lists
