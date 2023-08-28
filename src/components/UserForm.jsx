import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Email, Lock, Person, Badge } from '@mui/icons-material'
import { useStateValue } from '../StateProvider'
import { updateOne } from '../firebase/crud'
import { createUser } from '../firebase/auth'

function UserForm({ user, close }) {
  const [details, setDetails] = useState(
    user || {
      email: '',
      password: '',
      name: '',
      role: 'client',
    }
  )
  const [loading, setLoading] = useState(false)
  const dispatch = useStateValue()[1]

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (user) {
        // Edit
        const updated = await updateOne('users', details)
        dispatch({ type: 'UPDATE_STAFF', data: updated })
      } else {
        // Add
        const [newUser, message] = await createUser(...Object.values(details))
        if (newUser) {
          alert(message)
          dispatch({ type: 'ADD_STAFF', data: newUser })
        } else {
          throw new Error(message)
        }
      }
      setLoading(false)
      close()
    } catch (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <form
      action=''
      className='loginform'
      style={{ margin: '10px auto' }}
      onSubmit={handleSubmit}
    >
      <div className='input flex flex-column'>
        <label htmlFor='name'>
          <Person />
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          required
          value={details.name}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='email'>
          <Email />
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          readOnly={!!user}
          required
          value={details.email}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='role'>
          <Badge />
          Role
        </label>
        <select
          id='role'
          name='role'
          value={details.role}
          onChange={handleChange}
        >
          <option value='client'>Client</option>
          <option value='admin'>Admin</option>
        </select>
      </div>
      {!user && (
        <div className='input flex flex-column'>
          <label htmlFor='password'>
            <Lock />
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            required
            value={details.password}
            onChange={handleChange}
          />
        </div>
      )}
      <div className='flex'>
        <button className='button orange' onClick={() => close()}>
          Cancel
        </button>
        <button disabled={loading} className='button purple'>
          {loading
            ? user
              ? 'Saving...'
              : 'Adding...'
            : user
            ? 'Save'
            : 'Create'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
