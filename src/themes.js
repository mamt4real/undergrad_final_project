import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#333996',
      light: '#3c44b126',
      dark: '#141625',
    },
    secondary: {
      main: '#f8324526',
      light: '#f8324526',
      dark: 'ash',
    },
    background: {
      default: '#141625',
    },
  },
  overrides: {
    MuiTable: {
      root: {
        backgroundColor: '#141625',
      },
    },
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)',
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
})

export default theme
