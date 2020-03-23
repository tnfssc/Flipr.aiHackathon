import React from 'react'

import { useHistory } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import { makeStyles } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'
import GroupIcon from '@material-ui/icons/Group'

const useStyles = makeStyles(theme => ({
	toolbar: theme.mixins.toolbar,
}))

const drawerContents = [
	{
		name: 'Home',
		to: '/',
		icon: HomeIcon,
	},
	{
		name: 'Personal Boards',
		to: '/boards/personal',
		icon: PersonIcon,
	},
	{
		name: 'Team Boards',
		to: '/boards/teams',
		icon: GroupIcon,
	},
]

const SideDrawer = () => {
	const classes = useStyles()
	const history = useHistory()

	return (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<List>
				{drawerContents.map((Item, key) => (
					<ListItem button key={key} onClick={() => history.push(Item.to)}>
						<ListItemIcon>
							<Item.icon />
						</ListItemIcon>
						<ListItemText primary={Item.name} />
					</ListItem>
				))}
			</List>
			<Divider />
		</div>
	)
}

export default SideDrawer
