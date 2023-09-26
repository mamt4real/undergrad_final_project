import React, { useState } from 'react'
import Loading from '../components/Loading'
import { CalendarToday } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { formatMoney, formatdate } from '../reducer'
import { useStateValue } from '../StateProvider'
import { dayDifference, toDdMmmYy } from '../utils/dateFunctions'

function Zakat() {
  const [loading, setLoading] = useState(false)
  const { activeYear: currentYear } = useStateValue()[0]

  return (
    <div className='zakat container dashboard reports'>
      {loading && <Loading />}
      <section className='left flex flex-column'>
        {/* Top Level Info  */}
        <h3>Zakat Year</h3>
        <div className='filter_container'>
          <div className='flex'>
            <div
              className={`status-button flex ${
                currentYear.status === 'active' ? 'paid' : 'draft'
              }`}
            >
              <span>{currentYear.status}</span>
            </div>

            <div
              className={`status-button flex ${
                currentYear.paymentStatus === 'paid' ? 'paid' : 'draft'
              }`}
            >
              <span>{currentYear.paymentStatus}</span>
            </div>
          </div>
          <div className='flex'>
            <div className='input flex flex-column'>
              <label htmlFor='dateFrom'>
                <CalendarToday />
                From:
              </label>
              {toDdMmmYy(currentYear.beginDate)}
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='dateTo'>
                <CalendarToday />
                To:
              </label>
              {toDdMmmYy(currentYear.endDate)}
            </div>
          </div>
        </div>
        {/* Quick Metrics */}
        <div className='quick_metrics'>
          {/* <h3>Metrics</h3> */}
          <div className='metric'>
            <Typography variant='title' className='key'>
              Opening Balance
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(currentYear.openingBalance)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Opening Nisaab
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(currentYear.nisab)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Current Balance
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(currentYear.openingBalance)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Due in (Days)
            </Typography>
            <Typography variant='subtitle' className='money'>
              {dayDifference(new Date(), currentYear.endDate)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Amount Due (Est.)
            </Typography>
            <Typography variant='subtitle' className='money'>
              {currentYear.openingBalance >= currentYear.nisab
                ? formatMoney(currentYear.averageMonthly)
                : 'N/A'}
            </Typography>
          </div>
        </div>
        <button className='button dark-purple'>Calculate</button>
      </section>
      <section className='right flex flex-column'>
        This section would show details of previous Zakat Years
      </section>
    </div>
  )
}

export default Zakat
