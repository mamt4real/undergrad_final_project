import React, { useState } from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import { getOne } from '../firebase/crud'
import { auth } from '../firebase/_config'
import { userChanged } from '../firebase/auth'

function ProtectedRoute({ children, restrictedTo = [], redirect = '/' }) {
  const [{ user }, dispatch] = useStateValue()

  const [loggedUser, setLoggedUser] = useState(auth.currentUser)

  useEffect(() => {
    const unsubscribe = userChanged((user) => {
      if (user) {
        setLoggedUser(user)
        if (!user)
          getOne('users', loggedUser.id)
            .then((updated) => dispatch({ type: 'SET_USER', data: updated }))
            .catch(console.error)
      }
    })

    return () => unsubscribe()
  }, [loggedUser, user, dispatch])

  if (!loggedUser) {
    return <Navigate to='/' replace={true} />
  }

  if (restrictedTo.length && !restrictedTo.includes(user?.role)) {
    return <Navigate to={redirect} replace={true} />
  }

  return <>{children}</>
}

export default ProtectedRoute
