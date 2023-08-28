import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Invoice.css'
import arrowRight from '../assets/icon-arrow-right.svg'
import { formatdate, formatMoney } from '../reducer'

function Invoice({ invoice }) {
  return (
    <Link className='invoice flex' to={`/invoices/${invoice.id}`}>
      <div className='left flex'>
        <span className='tracking-number'>#{invoice.id}</span>
        <span className='due-date'>{formatdate(invoice.paymentDueDate)}</span>
        <span className='person'>{invoice.clientName}</span>
      </div>

      <div className='right flex'>
        <span className='price'>{formatMoney(invoice.invoiceTotal)}</span>
        <div
          className={`status-button flex ${invoice.invoicePaid ? 'paid' : ''} ${
            invoice.invoicePending ? 'pending' : ''
          } ${invoice.invoiceDraft ? 'draft' : ''}`}
        >
          <span>
            {invoice.invoicePaid
              ? 'Paid'
              : invoice.invoiceDraft
              ? 'Draft'
              : 'Pending'}
          </span>
        </div>
        <div className='icon'>
          <img src={arrowRight} alt='' />
        </div>
      </div>
    </Link>
  )
}

export default Invoice
