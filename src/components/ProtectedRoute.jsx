import React from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import { getOne } from '../firebase/crud'
import { userChanged } from '../firebase/auth'

function ProtectedRoute({ children, restrictedTo = [], redirect = '/' }) {
  const [{ user }, dispatch] = useStateValue()

  useEffect(() => {
    const unsubscribe = userChanged((user) => {
      if (user) {
        getOne('users', user.uid)
          .then((updated) => dispatch({ type: 'SET_USER', data: updated }))
          .catch(console.error)
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  if (!user) {
    return <Navigate to='/' replace={true} />
  }

  if (restrictedTo.length && !restrictedTo.includes(user?.role)) {
    return <Navigate to={redirect} replace={true} />
  }

  return <>{children}</>
}

export default ProtectedRoute
