import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Lock } from '@mui/icons-material'
// import { useStateValue } from '../StateProvider'

import { useStateValue } from '../StateProvider'
import { updateUserPassword } from '../firebase/auth'

function UpdatePassword({ close }) {
  const [details, setDetails] = useState({
    oldpassword: '',
    password: '',
    confirmpass: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user: current } = useStateValue()[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails({ ...details, [name]: value })
  }

  const validate = () => {
    if (details.password !== details.confirmpass) {
      setMessage('Password Mismatch!')
      return false
    }
    setMessage('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    let success = false
    setLoading(true)
    try {
      const [user, message] = await updateUserPassword(
        details.oldpassword,
        details.password,
        current
      )
      if (!user) {
        setMessage(message)
      } else {
        success = true
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
      if (success) close()
    }
  }

  return (
    <form
      action=''
      className='loginform'
      style={{ margin: '10px auto' }}
      onSubmit={handleSubmit}
    >
      {message && <div className='message'>{message}</div>}
      <div className='input flex flex-column'>
        <label htmlFor='password'>
          <Lock />
          Old Password
        </label>
        <input
          type='password'
          id='oldpassword'
          name='oldpassword'
          required
          value={details.oldpassword}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='password'>
          <Lock />
          New Password
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
      <div className='input flex flex-column'>
        <label htmlFor='password'>
          <Lock />
          Confirm Password
        </label>
        <input
          type='password'
          id='confirmpass'
          name='confirmpass'
          required
          value={details.confirmpass}
          onChange={handleChange}
        />
      </div>

      <div className='flex'>
        <button className='button orange' onClick={() => close()}>
          Cancel
        </button>
        <button disabled={loading} type='submit' className='button purple'>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  )
}

export default UpdatePassword
