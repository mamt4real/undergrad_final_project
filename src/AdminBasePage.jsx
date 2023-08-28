import React, { useEffect } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { useStateValue } from './StateProvider'
import { getAll } from './firebase/crud'

function AdminBasePage() {
  // Load Some admin level data

  const dispatch = useStateValue()[1]

  useEffect(() => {
    let isCanceled = false
    const loadData = async () => {
      const data = await getAll('users')
      if (!isCanceled) dispatch({ type: 'SET_STAFFS', data })
    }
    loadData()
    return () => {
      isCanceled = true
    }
  }, [dispatch])

  return (
    <>
      <Outlet context={useOutletContext()} />
    </>
  )
}

export default AdminBasePage
