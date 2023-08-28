import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    position: 'absolute !important',
    top: theme.spacing(0.5),
    backgroundColor: 'var(--bg-light)',
    '& .MuiDialogTitle-root': {
      backgroundColor: 'var(--bg-dark)',
      padding: theme.spacing(1),
      '& .MuiIconButton-root': {
        backgroundColor: 'red',
      },
    },
    '& .MuiDialogContent-root': {
      backgroundColor: 'var(--bg-light)',
      width: '300px',
      padding: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        width: '450px',
        padding: theme.spacing(2),
      },
    },
  },
}))

function Popup(props) {
  const { title, children, open, setOpen } = props
  const classes = useStyles()
  return (
    <Dialog
      TransitionComponent={Transition}
      transitionDuration={700}
      open={open}
      onClose={() => setOpen(false)}
      maxWidth='md'
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle>
        <div
          style={{
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' color={'white'} component={'div'}>
            {title}
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            color='secondary'
            style={{ marginLeft: '16px' }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers className='custom_scroll'>
        {children}
      </DialogContent>
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide direction='down' ref={ref} mountOnEnter unmountOnExit {...props} />
  )
})

export default Popup
