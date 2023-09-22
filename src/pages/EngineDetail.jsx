import { Typography } from '@mui/material'
import { Money, Numbers, CalendarMonth } from '@mui/icons-material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { formatdate, formatMoney } from '../reducer'
import { useStateValue } from '../StateProvider'
import '../css/EngineDetail.css'

import Popup from '../components/Popup'
import RestockForm from '../components/RestockForm'
import { deleteOne, updateOne } from '../firebase/crud'

function EngineDetail() {
  const { engineId } = useParams()
  const navigate = useNavigate()

  const [{ products }, dispatch] = useStateValue()
  const [engine, setEngine] = useState({})
  const setShowModal = useOutletContext()[1]
  const [showRestock, setShowRestock] = useState(false)

  useEffect(() => {
    const tmp = products.find((e) => e.id === engineId)
    if (!tmp) {
      return navigate('/admin/products')
    }
    setEngine(tmp)
  }, [products, engineId, navigate])

  const handlePriceUpdate = (promptText, field) => {
    const newPrice = prompt(`Enter new ${promptText}`, engine[field])
    if (!newPrice || isNaN(newPrice)) return
    updateOne('products', {
      ...engine,
      [field]: parseFloat(newPrice),
    })
      .then((data) => {
        dispatch({ type: 'UPDATE_ENGINE', data })
        alert(promptText + ' updated Successfully!')
      })
      .catch(() => alert('Something went wrong!'))
  }
  const handleDelete = () => {
    const effectDelete = async () => {
      await deleteOne('products', engine.id)
    }
    setShowModal({
      open: true,
      title: `Are you sure you want to delete ${engine.name}?`,
      subtitle: "This action can't be reversed!",
      callback: () =>
        effectDelete()
          .then(() => dispatch({ type: 'DELETE_ENGINE', data: engine.id }))
          .catch((err) => alert(err.message)),
    })
  }

  return (
    <div className='enginedetail container'>
      <Typography variant='h4' align='center'>
        {engine?.name}
      </Typography>

      <section className='enginedetail__details'>
        <div className='enginedetail__field'>
          <span className='key'>
            {' '}
            <Numbers /> Quantity Available
          </span>
          <span className='value'>{engine?.quantity}</span>
        </div>
        <div className='enginedetail__field'>
          <span className='key'>
            {' '}
            <Money /> Cost Price
          </span>
          <span className='value'>{formatMoney(engine?.costPrice)}</span>
        </div>
        <div className='enginedetail__field'>
          <span className='key'>
            {' '}
            <Money /> Selling Price
          </span>
          <span className='value'>{formatMoney(engine?.basePrice)}</span>
        </div>
        <div className='enginedetail__field'>
          <span className='key'>
            <CalendarMonth /> Last Order Date
          </span>
          <span className='value'>{formatdate(engine?.lastOrderDate)}</span>
        </div>
      </section>
      <section className='actions'>
        <Typography variant='subtitle' component={'div'}>
          Update Details
        </Typography>
        <div className='enginedetail__bottom'>
          <div className='flex'>
            <button
              className='button green'
              onClick={() => setShowRestock(true)}
            >
              Quantity
            </button>
            <button
              className='button purple'
              onClick={() => handlePriceUpdate('Selling Price', 'basePrice')}
            >
              Selling Price
            </button>
            <button
              className='button orange'
              onClick={() => handlePriceUpdate('Cost Price', 'costPrice')}
            >
              Cost Price
            </button>
          </div>

          <button className='button red' onClick={handleDelete}>
            Delete
          </button>
        </div>
      </section>
      <button
        className='button dark-purple backbtn'
        onClick={() => navigate('/admin/products')}
      >
        Back
      </button>
      <Popup
        open={showRestock}
        title={'Restock ' + engine.name}
        setOpen={setShowRestock}
      >
        <RestockForm engine={engine} close={() => setShowRestock(false)} />
      </Popup>
    </div>
  )
}

export default EngineDetail
