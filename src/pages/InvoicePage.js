import React, { useEffect, useState } from 'react'
import {
  Link,
  useOutletContext,
  useParams,
  useNavigate,
} from 'react-router-dom'
import '../css/InvoicePage.css'
import { useStateValue } from '../StateProvider'
import arrowLeft from '../assets/icon-arrow-left.svg'
import { formatdate, formatMoney } from '../reducer'

import Loading from '../components/Loading'
import Popup from '../components/Popup'
import useReceipt from '../hooks/useReceipt'
import { updateProductQuantities } from '../firebase/products'
import { deleteOne, updateOne } from '../firebase/crud'

function InvoicePage() {
  const { invoiceID } = useParams()
  const navigate = useNavigate()
  const [{ currentInvoice, user }, dispatch] = useStateValue()
  const [showReceipt, setShowRceipt] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fn, setShowModal] = useOutletContext()

  const printCallback = () => {
    if (!currentInvoice.printed) {
      // update quantities reduction
      updateProductQuantities(currentInvoice.invoiceItemList)
        .then(() => {
          // update status to printed
          updateOne('invoices', {
            ...currentInvoice,
            printed: true,
            invoicePending: false,
            invoiceDraft: false,
            invoicePaid: true,
          })
            .then((updated) => {
              dispatch({
                type: 'UPDATE_INVOICE',
                data: {
                  ...currentInvoice,
                  printed: true,
                  invoicePending: false,
                  invoiceDraft: false,
                  invoicePaid: true,
                },
              })
              dispatch({
                type: 'SET_CURRENT_INVOICE',
                data: updated ? updated?.id : currentInvoice?.id,
              })
            })
            .catch(console.log)
        })
        .catch(console.log)
    }
  }

  const [Receipt, ActionsTab] = useReceipt(
    currentInvoice,
    () => setShowRceipt(false),
    printCallback
  )

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_INVOICE', data: invoiceID })
    return () => dispatch({ type: 'SET_CURRENT_INVOICE', data: null })
  }, [invoiceID, dispatch])

  const toggleInvoiceEdit = (id) => {
    fn(true)
  }

  const deleteInvoice = (id) => {
    const effectDelete = async () => {
      setSubmitting(true)
      try {
        // const docref = db.doc(db.db, 'invoices', id)
        await deleteOne('invoices', id)
        dispatch({ type: 'DELETE_INVOICE', data: id })
        dispatch({ type: 'SET_CURRENT_INVOICE', data: null })
      } catch (error) {
        console.log(error)
        alert(error.message)
      }
      setSubmitting(false)
    }
    setShowModal({
      open: true,
      title: 'Are you sure you want to delete this invoice?',
      subtitle: "This action can't be reversed!",
      callback: () =>
        effectDelete()
          .then(() => navigate('/invoices'))
          .catch((err) => alert(err.message)),
    })
  }

  const handlePrint = (e) => {
    setShowRceipt(true)
  }

  if (!currentInvoice) return <div></div>
  return (
    <div className='invoicepage container'>
      <Link to={'/invoices'} className='nav-link'>
        <img src={arrowLeft} alt='' /> Go back
      </Link>
      {/* header */}
      {submitting && <Loading />}
      <div className='header flex'>
        <div className='left flex'>
          <div
            className={`status-button flex ${
              currentInvoice.invoicePaid
                ? 'paid'
                : currentInvoice.invoicePending
                ? 'pending'
                : currentInvoice.invoiceDraft
                ? 'draft'
                : ''
            }`}
          >
            <span>
              {currentInvoice.invoicePaid
                ? 'Paid'
                : currentInvoice.invoiceDraft
                ? 'Draft'
                : 'Pending'}
            </span>
          </div>
        </div>
        <div className='right flex'>
          {!currentInvoice.printed &&
            (user?.id === currentInvoice?.userID || user?.role === 'admin') && (
              <>
                <button
                  className='orange'
                  onClick={() => toggleInvoiceEdit(currentInvoice?.id)}
                >
                  Edit
                </button>
                <button
                  className='red'
                  onClick={() => deleteInvoice(currentInvoice?.id)}
                >
                  Delete
                </button>
              </>
            )}
          <button className='green' onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>

      {/* invoice details */}

      <div className='invoice-details flex flex-column'>
        <div className='top flex'>
          <div className='left flex flex-column'>
            <p>
              <span>#</span>
              {currentInvoice?.id}
            </p>
            <p>{currentInvoice.productDescription}</p>
          </div>

          <div className='right flex flex-column'>
            <p>Al-Fikra General Enterpises</p>
            <p>No 23 New Jos Road</p>
            <p>Zaria, Kaduna</p>
            <p>Nigeria</p>
          </div>
        </div>

        <div className='middle flex'>
          <div className='payment flex flex-column'>
            <h4>Invoice Date</h4>
            <p>{formatdate(currentInvoice.invoiceDate)}</p>

            <h4>Payment Date</h4>
            <p>{formatdate(currentInvoice.paymentDueDate)}</p>
          </div>
          <div className='bill flex flex-column'>
            <h4>Bill to</h4>
            <p>{currentInvoice.clientName}</p>
          </div>
          <div className='send-to flex flex-column'>
            <h4>Sent to</h4>
            <p>{currentInvoice.clientPhone}</p>
            <p>{currentInvoice.clientAddress}</p>
            <p>{currentInvoice.clientEmail}</p>
          </div>
        </div>

        <div className='bottom flex flex-column'>
          <div className='billing-items'>
            <div className='heading flex'>
              <p>Item Name</p>
              <p>Item No</p>
              <p>QTY</p>
              <p>Price</p>
              <p>Total</p>
            </div>
            {currentInvoice.invoiceItemList?.map((item, i) => (
              <div className='item flex' key={i + 1}>
                <p>{item.itemName}</p>
                <p>{item.engineNo}</p>
                <p>{item.qty}</p>
                <p>{formatMoney(item.price)}</p>
                <p>{formatMoney(item.total)}</p>
              </div>
            ))}
          </div>
          <div className='total flex'>
            <p>Amount Due</p>
            <p>{formatMoney(currentInvoice.invoiceTotal)}</p>
          </div>
        </div>
      </div>
      <Popup title='Receipt' open={showReceipt} setOpen={setShowRceipt}>
        <div className='receipt'>
          <Receipt />
          <ActionsTab />
        </div>
      </Popup>
    </div>
  )
}

export default InvoicePage
