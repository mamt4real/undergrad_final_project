import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { CalendarToday } from '@mui/icons-material'
import {
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { formatMoney } from '../reducer'
import { useStateValue } from '../StateProvider'
import { cleanDate, dayDifference, toDdMmmYy } from '../utils/dateFunctions'
import useTable from '../hooks/useTable'
import { getAll } from '../firebase/crud'
import { toNDigits } from '../utils/helpers'

const headCells = [
  { id: 'year', label: 'Year' },
  { id: 'openingBalance', label: 'Opeining Bal' },
  { id: 'closingBalance', label: 'Closinging Bal' },
  { id: 'nisaab', label: 'Nisaab' },
  { id: 'paymentStatus', label: 'Payment Status' },
]

function Zakat() {
  const [loading, setLoading] = useState(false)
  const [zakatyears, setZakatyears] = useState([])
  const [filter, setFilter] = useState({ fn: (items) => items })

  const { activeYear: currentYear } = useStateValue()[0]
  const { TableContainer, TblHead, TblPagination, recordsAfterPagination } =
    useTable(zakatyears, headCells, filter)

  useEffect(() => {
    let isCanceled = false
    getAll('zakatyears').then((years) => !isCanceled && setZakatyears(years))
    return () => {
      isCanceled = true
    }
  }, [])

  const getYear = (year) => {
    const start = cleanDate(year.beginDate)
    const stop = cleanDate(year.endDate)
    return `${toNDigits(
      start.getMonth() + 1,
      2
    )}/${start.getFullYear()} - ${toNDigits(
      stop.getMonth() + 1,
      2
    )}/${stop.getFullYear()}`
  }

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
      <section
        className='right flex flex-column'
        style={{ alignItems: 'center' }}
      >
        <h3>Zakat History</h3>
        <TableContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagination().map((y, i) => (
              <TableRow key={i + 1 + y.id}>
                <TableCell>{getYear(y)}</TableCell>
                <TableCell>{formatMoney(y.openingBalance)}</TableCell>
                <TableCell>{formatMoney(y.closingBalance)}</TableCell>
                <TableCell>{formatMoney(y.nisab)}</TableCell>
                <TableCell>{y.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        <TblPagination />
      </section>
    </div>
  )
}

export default Zakat
