import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { StateProvider } from './StateProvider'
import { initialState, reducer } from './reducer'
import { ThemeProvider } from '@mui/material'
import theme from './themes'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

