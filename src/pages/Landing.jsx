import React from 'react'
import '../css/Landing.css'
import LoginForm from '../components/LoginForm'

function Landing() {
  return (
    <div className='landing container'>
      <section className='left'>
        <div className='titles'>
          <h2>Businesses' Name and Brand</h2>
          <span>Businesses' Address</span>
        </div>
        <p>Invoice Management System</p>
      </section>
      <section className='right'>
        <h1>
          <LoginForm />
        </h1>
      </section>
    </div>
  )
}

export default Landing
