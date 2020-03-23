import React from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

import CloseIcon from '@material-ui/icons/Close'

const Snacks = props => {
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={props.open}
			autoHideDuration={60000}
			onClose={props.handleClose}
			message={props.text}
			action={
				<IconButton size="small" aria-label="close" color="inherit" onClick={props.handleClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
			}
		/>
	)
}

export default Snacks
