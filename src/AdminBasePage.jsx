import React, { useEffect } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import { getAll } from './firebase/crud'
import { getActiveYear, initializeActiveYear } from './firebase/zakatyears'
import ZakatDueNotification from './components/ZakatDueNotification'

function AdminBasePage() {
  // Load Some admin level data

  const dispatch = useStateValue()[1]

  useEffect(() => {
    let isCanceled = false
    const loadData = async () => {
      const data = await getAll('users')
      const activeYear =
        (await getActiveYear()) || (await initializeActiveYear())
      if (!isCanceled) {
        dispatch({ type: 'SET_STAFFS', data })
        dispatch({ type: 'SET_ACTIVE_YEAR', data: activeYear })
      }
    }
    loadData()
    return () => {
      isCanceled = true
    }
  }, [dispatch])

  return (
    <>
      <Outlet context={useOutletContext()} />
      <ZakatDueNotification />
    </>
  )
}

export default AdminBasePage
