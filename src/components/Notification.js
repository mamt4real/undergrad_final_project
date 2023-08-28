import { Alert, Snackbar } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(9),
  },
}))

function Notification({ notify, setNotify }) {
  const classes = useStyles()
  const handleClose = () => {
    setNotify({ ...notify, message: '' })
  }
  return (
    <Snackbar
      className={classes.root}
      open={notify.message ? true : false}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
