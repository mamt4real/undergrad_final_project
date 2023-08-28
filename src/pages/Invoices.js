import React, { useEffect, useState } from 'react'
import '../css/Invoices.css'
import iconDown from '../assets/icon-arrow-down.svg'
import iconPlus from '../assets/icon-plus.svg'
import emptyImage from '../assets/illustration-empty.svg'
import { useStateValue } from '../StateProvider'

import Invoice from '../components/Invoice'
import Loading from '../components/Loading'
import { useOutletContext } from 'react-router-dom'

function Invoices() {
  const [{ invoices }, dispatch] = useStateValue()
  const [displayed, setDisplayed] = useState(invoices)
  const [filter, setFilter] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [fn] = useOutletContext()
  const [loading, setLoading] = useState(false)
  const showInvoiceModal = () => fn(true)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (invoices.length) return
    let isCanceled = false
    setLoading(true)
    // db.getTodaysSales()
    db.getAll('invoices')
      .then((invoices) => {
        if (!isCanceled) dispatch({ type: 'SET_INVOICES', data: invoices })
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))

    return () => {
      isCanceled = true
      setLoading(false)
    }
  }, [])

  const handleFilter = (e) => {
    const text = e.target.innerText
    if (text === 'Clear Filter') return setFilter('All')
    setFilter(text)
  }

  const handleSearch = (e) => {
    setLoading(true)
    db.getInvoiceByPhone(phone)
      .then((data) => {
        dispatch({ type: 'SET_SEARCHED', data })
        setDisplayed(data)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (filter === 'All') setDisplayed(invoices)
    else setDisplayed(invoices.filter((inv) => inv['invoice' + filter]))
  }, [filter, invoices])

  return (
    <div className='home container'>
      {loading && <Loading />}
      <div className='header flex'>
        <div className='left flex flex-column'>
          <h1>Invoices</h1>
          <span>There are a total of {invoices.length} Invoices Today</span>
        </div>
        <div className='right flex'>
          <div
            className='filter flex'
            onClick={() => setShowFilter(!showFilter)}
          >
            <span>Filter by status: {filter}</span>
            <img src={iconDown} alt='' />
            {showFilter && (
              <ul className='filter-menu'>
                <li onClick={handleFilter}>Draft</li>
                <li onClick={handleFilter}>Pending</li>
                <li onClick={handleFilter}>Paid</li>
                <li onClick={handleFilter}>Clear Filter</li>
              </ul>
            )}
          </div>
          <div className='button flex' onClick={() => showInvoiceModal(true)}>
            <div className='inner-button flex'>
              <img src={iconPlus} alt='' />
            </div>
            <span>New Invoice</span>
          </div>
        </div>
      </div>
      <div className='searchbar'>
        <div className='input flex flex-column'>
          <input
            type='Phone'
            id='Phone'
            minLength={11}
            maxLength={11}
            name='Phone'
            placeholder='Search Invoice by Phone No'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button className='button dark-purple' onClick={handleSearch}>
          Search
        </button>
      </div>
      {displayed.length ? (
        <div className='invoices-container custom_scroll'>
          {displayed.map((inv, i) => (
            <Invoice invoice={inv} key={inv.id + i} />
          ))}
        </div>
      ) : (
        <div className='empty flex flex-column'>
          <img src={emptyImage} alt='' />
          <h3>There is nothing here</h3>
          <p>
            Create a new invoice by clicking the new invoice button and get
            started
          </p>
        </div>
      )}
    </div>
  )
}

export default Invoices
