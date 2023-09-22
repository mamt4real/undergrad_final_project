import React from 'react'
import '../css/Navigation.css'
import logo from '../assets/images.jpeg'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Receipt,
  PowerSettingsNew,
  Engineering,
  Dashboard,
  Report,
  People,
  Person,
  Calculate,
} from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { useStateValue } from '../StateProvider'
import { devEnv } from '../firebase/_config'
import { logOut } from '../firebase/auth'

function Navigation({ showDialog }) {
  const [{ user }, dispatch] = useStateValue()
  const navigate = useNavigate()

  const logout = () => {
    showDialog({
      open: true,
      title: 'Are you sure you want to Logout?',
      subtitle: '',
      callback: () => {
        localStorage.setItem('user', null)
        dispatch({ type: 'SET_USER', data: null })
        if (!devEnv) logOut().then(() => alert('Logout Successfully!'))
        navigate('/')
      },
    })
  }
  return (
    <nav className='navigation'>
      <div className='brand flex'>
        <div className='branding flex'>
          <img src={logo} alt='' />
        </div>
        <div className='links'>
          {/* <NavLink
            to={'/'}
            className={({ isActive }) =>
              'navlink ' + (isActive ? 'active' : '')
            }
          >
            <Tooltip title='Home'>
              <Home fontSize='large' />
            </Tooltip>
          </NavLink> */}
          <NavLink
            to={'/invoices'}
            className={({ isActive }) =>
              'navlink ' + (isActive ? 'active' : '')
            }
          >
            <Tooltip title='Invoices'>
              <Receipt fontSize='large' />
            </Tooltip>
          </NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink
                to={'/admin/dashboard'}
                className={({ isActive }) =>
                  'navlink ' + (isActive ? 'active' : '')
                }
              >
                <Tooltip title='Dashboard'>
                  <Dashboard fontSize='large' />
                </Tooltip>
              </NavLink>
              <NavLink
                to={'/admin/products'}
                className={({ isActive }) =>
                  'navlink ' + (isActive ? 'active' : '')
                }
              >
                <Tooltip title='Products'>
                  <Engineering fontSize='large' />
                </Tooltip>
              </NavLink>

              <NavLink
                to={'/admin/reports'}
                className={({ isActive }) =>
                  'navlink ' + (isActive ? 'active' : '')
                }
              >
                <Tooltip title='Reports'>
                  <Report fontSize='large' />
                </Tooltip>
              </NavLink>
              <NavLink
                to={'/admin/users'}
                className={({ isActive }) =>
                  'navlink ' + (isActive ? 'active' : '')
                }
              >
                <Tooltip title='Users'>
                  <People fontSize='large' />
                </Tooltip>
              </NavLink>
              <NavLink
                to={'/admin/zakat'}
                className={({ isActive }) =>
                  'navlink ' + (isActive ? 'active' : '')
                }
              >
                <Tooltip title='Zakat'>
                  <Calculate fontSize='large' />
                </Tooltip>
              </NavLink>
            </>
          )}
          <NavLink
            to={'/profile'}
            className={({ isActive }) =>
              'navlink ' + (isActive ? 'active' : '')
            }
          >
            <Tooltip title='Profile'>
              <Person fontSize='large' />
            </Tooltip>
          </NavLink>
        </div>
        <IconButton className='logout_btn' onClick={(e) => logout()}>
          <Tooltip title='Logout'>
            <PowerSettingsNew fontSize='large' />
          </Tooltip>
        </IconButton>
      </div>
    </nav>
  )
}

export default Navigation
