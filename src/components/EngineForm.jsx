import React, { useState } from 'react'
import '../css/LoginForm.css'
import { Engineering, Money } from '@mui/icons-material'
import { useStateValue } from '../StateProvider'
import { productExists } from '../firebase/products'
import { createOne, updateOne } from '../firebase/crud'

function EngineForm({ engine, close }) {
  const [details, setDetails] = useState(
    engine || {
      name: '', // it has be unique
      costPrice: 0,
      quantity: 0,
      basePrice: 0,
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
      if (engine) {
        // Edit
        const updatedE = await updateOne('products', details)
        dispatch({ type: 'UPDATE_ENGINE', data: updatedE })
      } else {
        // Add
        // confirm if engine name is unique
        if (await productExists(details.name)) {
          alert(`${details.name} already exist!`)
          setLoading(false)
          return
        }
        const newE = await createOne('products', details)
        dispatch({ type: 'ADD_ENGINE', data: newE })
      }
      setLoading(false)
      close()
    } catch (error) {
      setLoading(false)
      console.error(error.message)
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
          <Engineering />
          Product Name
        </label>
        <input
          type='text'
          id='name'
          required
          name='name'
          value={details.name}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='basePrice'>
          <Money />
          Cost Price
        </label>
        <input
          type='number'
          min={100}
          id='costPrice'
          name='costPrice'
          value={details.costPrice}
          onChange={handleChange}
        />
      </div>
      <div className='input flex flex-column'>
        <label htmlFor='basePrice'>
          <Money />
          Base Price
        </label>
        <input
          type='number'
          min={100}
          id='basePrice'
          name='basePrice'
          value={details.basePrice}
          onChange={handleChange}
        />
      </div>

      <div className='flex'>
        <button type='reset' className='button orange' onClick={() => close()}>
          Cancel
        </button>
        <button
          className='button purple'
          type='submit'
          disable={loading.toString()}
        >
          {loading
            ? engine
              ? 'Saving...'
              : 'Adding...'
            : engine
            ? 'Save'
            : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default EngineForm
