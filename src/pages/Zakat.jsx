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
import { getYearRange, toNDigits } from '../utils/helpers'
import {
  getEstimatedAmountDue,
  getZakatYearsSales,
} from '../firebase/zakatyears'
import { ZakatYear } from '../models'
import { getCurrentAssetsValue } from '../firebase/products'
import CalculateZakat from '../components/CalculateZakat'

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
  const [currentYear, setCurrentYear] = useState(ZakatYear)
  const [yearSales, setYearSales] = useState(0)
  const [yearDueEst, setYearDueEst] = useState(0)
  const [assetInStock, setAssetsInStock] = useState(0)
  const { activeYear } = useStateValue()[0]

  const { TableContainer, TblHead, TblPagination, recordsAfterPagination } =
    useTable(zakatyears, headCells, filter)

  useEffect(() => {
    let isCanceled = false
    getAll('zakatyears').then((years) => !isCanceled && setZakatyears(years))
    getCurrentAssetsValue().then(
      (value) => !isCanceled && setAssetsInStock(value)
    )
    setCurrentYear(activeYear)
    return () => {
      isCanceled = true
    }
  }, [activeYear])

  useEffect(() => {
    getZakatYearsSales(currentYear?.id).then(setYearSales)
    getEstimatedAmountDue(currentYear).then(setYearDueEst)
  }, [currentYear])

  return (
    <div className='zakat container dashboard reports'>
      {loading && <Loading />}
      <section className='left flex flex-column'>
        {/* Top Level Info  */}
        <h3>Zakat Year</h3>
        <div className='filter_container'>
          <div className='flex jc-space-between'>
            <div
              className={`status-button flex ${
                currentYear?.status === 'active' ? 'paid' : 'draft'
              }`}
            >
              <span>{currentYear?.status}</span>
            </div>

            <div
              className={`status-button flex ${
                currentYear?.paymentStatus === 'paid' ? 'paid' : 'draft'
              }`}
            >
              <span>{currentYear?.paymentStatus}</span>
            </div>
          </div>
          <div className='flex jc-space-between'>
            <div className='input flex flex-column'>
              <label htmlFor='dateFrom'>
                <CalendarToday />
                {toDdMmmYy(currentYear?.beginDate)}
              </label>
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='dateTo'>
                <CalendarToday />
                {toDdMmmYy(currentYear?.endDate)}
              </label>
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
              {formatMoney(currentYear?.openingBalance)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Opening Nisaab
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(currentYear?.nisab)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Year Sales
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(yearSales)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Assets In Stock
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(assetInStock)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Due in (Days)
            </Typography>
            <Typography variant='subtitle' className='money'>
              {dayDifference(new Date(), currentYear?.endDate)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Amount Due (Est.)
            </Typography>
            <Typography variant='subtitle' className='money'>
              {yearSales >= currentYear?.nisab
                ? formatMoney(yearDueEst)
                : 'N/A'}
            </Typography>
          </div>
        </div>
        <CalculateZakat
          zakatYear={currentYear}
          netAssets={yearSales + assetInStock}
        />
        {/* <button className='button dark-purple'>Calculate</button> */}
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
                <TableCell>{getYearRange(y)}</TableCell>
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
