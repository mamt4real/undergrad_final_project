import { CalendarToday } from '@mui/icons-material'
import React, { useState } from 'react'

import { formatMoney } from '../utils/helpers'
import '../css/Reports.css'
import { Typography } from '@mui/material'
import { useStateValue } from '../StateProvider'
import {
  engineCount,
  salesByUser,
  transformInvoices,
} from '../firebase/factory'
import ChartBar from '../components/charts/ChartBar'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import { Link } from 'react-router-dom'
import { getDateRangedInvoices } from '../firebase/invoices'

function Reports() {
  const [{ invoices, staffs }, dispatch] = useStateValue()
  const [loading, setLoading] = useState(false)
  const [fetchedInvoices, setFetched] = useState(invoices)
  const [filters, setFilters] = useState({
    dateFrom: new Date().toLocaleString('en-CA').split(',')[0],
    dateTo: new Date().toLocaleString('en-CA').split(',')[0],
  })
  const [stats, setStats] = useState({
    totalSales: 0,
    averageMonthly: 0,
    totalProducts: 0,
    profitPercentage: 0.0,
    totalProfit: 0,
    mostSold: '',
    engineChartData: [],
    usersChartData: [],
  })

  const filtersChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }
  const updateStats = () => {
    const transformed = transformInvoices(fetchedInvoices)
    const months = Math.abs(
      filters.dateTo.split('-')[1] - filters.dateFrom.split('-')[1] + 1
    )
    const engineChartData = engineCount(transformed)
    const totalSales = transformed.reduce((sub, sale) => sub + sale.total, 0)
    const averageMonthly = totalSales / months
    const totalCost = transformed.reduce(
      (sub, sale) => sub + sale.cost * sale.qty,
      0
    )
    const totalProfit = totalSales - totalCost
    const profitPercentage = Number(
      (totalProfit * 100) / (totalCost || 1)
    ).toFixed(1)
    const totalProducts = transformed.reduce(
      (sub, sale) => parseInt(sale.qty) + sub,
      0
    )
    const usersChartData = salesByUser(transformed, staffs)
    setStats({
      engineChartData,
      totalSales,
      totalProducts,
      averageMonthly,
      usersChartData,
      totalProfit,
      profitPercentage,
    })
  }
  useEffect(() => {
    updateStats()
  }, [fetchedInvoices])

  const fetchData = () => {
    setLoading(true)
    getDateRangedInvoices(filters.dateFrom, filters.dateTo)
      .then((data) => setFetched(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <div className='reports container dashboard'>
      {loading && <Loading />}
      <section className='left flex flex-column'>
        {/* Filter Container  */}
        <div className='filter_container'>
          <h3>Filter Records</h3>
          <div className='flex'>
            <div className='input flex flex-column'>
              <label htmlFor='dateFrom'>
                <CalendarToday />
                From
              </label>
              <input
                type='date'
                id='dateFrom'
                name='dateFrom'
                required
                value={filters.dateFrom}
                onChange={filtersChange}
              />
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='dateTo'>
                <CalendarToday />
                To
              </label>
              <input
                type='date'
                id='dateTo'
                name='dateTo'
                required
                value={filters.dateTo}
                onChange={filtersChange}
              />
            </div>
          </div>
          <button className='button dark-purple' onClick={fetchData}>
            Retrieve
          </button>
        </div>

        {/* Quick Metrics */}
        <div className='quick_metrics'>
          <h3>Metrics</h3>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Total Sales
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(stats.totalSales)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Total Profit
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(stats.totalProfit)} ({stats.profitPercentage}%)
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Avg Monthly Sales
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(stats.averageMonthly)}
            </Typography>
          </div>
          <div className='metric'>
            <Typography variant='title' className='key'>
              Total Products Sold
            </Typography>
            <Typography variant='subtitle' className='money'>
              {stats.totalProducts}
            </Typography>
          </div>
        </div>

        <Link
          to={`/admin/reports/preview?from=${filters.dateFrom}&to=${filters.dateTo}`}
        >
          <button
            className='preview-btn button purple'
            onClick={() =>
              dispatch({
                type: 'SET_REPORTS',
                data: transformInvoices(fetchedInvoices),
              })
            }
          >
            Preview Records
          </button>
        </Link>
      </section>
      <section className='right flex flex-column'>
        <div>
          <ChartBar
            data={stats.engineChartData}
            title='Products Sold'
            datakeys={['value']}
          />
        </div>
        <div className=''>
          <ChartBar
            data={stats.usersChartData}
            title='Users Sales'
            datakeys={['amt']}
            grid={true}
          />
        </div>
      </section>
    </div>
  )
}

export default Reports
