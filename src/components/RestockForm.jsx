import React, { useState } from 'react'
import { Numbers, Money } from '@mui/icons-material'

import { useStateValue } from '../StateProvider'
import { updateOne } from '../firebase/crud'

function RestockForm({ engine, close }) {
  const [details, setDetails] = useState({
    quantity: 0,
    costPrice: engine.costPrice,
    basePrice: engine.basePrice,
  })
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
      const data = {
        ...engine,
        ...details,
        quantity: Number(details.quantity) + Number(engine.quantity),
        lastOrderDate: new Date(),
      }
      const updatedE = await updateOne('products', data)
      dispatch({ type: 'UPDATE_ENGINE', data: updatedE })
      setLoading(false)
      close()
    } catch (error) {
      alert('something went wrong!')
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
        <label htmlFor='quantity'>
          <Numbers />
          Quantity
        </label>
        <input
          type='number'
          required
          min={1}
          id='quantity'
          name='quantity'
          value={details.quantity}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='costPrice'>
          <Money />
          Cost Price
        </label>
        <input
          type='number'
          step={0.01}
          min={100}
          id='costPrice'
          required
          name='costPrice'
          value={details.costPrice}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='basePrice'>
          <Money />
          Selling Price
        </label>
        <input
          type='number'
          min={100}
          id='basePrice'
          name='basePrice'
          step={0.01}
          value={details.basePrice}
          onChange={handleChange}
        />
      </div>

      <div className='flex'>
        <button className='button orange' disabled={loading} onClick={close}>
          Cancel
        </button>
        <button className='button purple' type='submit' disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default RestockForm
