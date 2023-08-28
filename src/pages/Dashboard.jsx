// import { TrendingDown, TrendingUp } from '@mui/icons-material'
import { Card, CardContent, CardHeader } from '@mui/material'
import React, { useEffect } from 'react'
import ChartLine from '../components/charts/ChartLine'
import ChartPie from '../components/charts/ChartPie'
import '../css/Dashboard.css'
import {
  transformInvoices,
  monthlySales,
  engineCount,
} from '../firebase/factory'
import { formatMoney } from '../reducer'

import { useState } from 'react'
import Loading from '../components/Loading'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    today: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthly: [],
    products: [],
  })
  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true)
      try {
        const data = await db.getThisYearInvoices()
        const transformed = transformInvoices(data)
        const monthly = monthlySales(transformed)
        const products = engineCount(transformed)
        const total = (sales) =>
          sales.reduce((sub, sale) => sub + sale.total, 0)

        const cost = (sales) =>
          sales.reduce((sub, sale) => sub + sale.cost * sale.qty, 0)
        const mSales = transformed.filter(
          (sale) => sale.date?.getMonth() === new Date().getMonth()
        )
        const todaySales = mSales.filter(
          (sale) => sale.date?.getDate() === new Date().getDate()
        )
        const today = {
          sales: total(todaySales),
        }
        today.profit = today.sales - cost(todaySales)
        const thisMonth = { sales: total(mSales) }
        thisMonth.profit = thisMonth.sales - cost(mSales)

        const lastMonthSales = transformed.filter(
          (sale) => sale.date?.getMonth() === new Date().getMonth() - 1
        )
        const lastMonth = { sales: total(lastMonthSales) }
        lastMonth.profit = lastMonth.sales - cost(lastMonthSales)

        setStats({
          today,
          monthly,
          products,
          thisMonth,
          lastMonth,
        })
      } catch (error) {
        console.log(error)
        alert(error.message)
      }
      setLoading(false)
    }

    loadDetails()
  }, [])

  return (
    <div className='dashboard container'>
      {loading && <Loading />}
      {/* Dashboard */}
      <div className='tiles_container'>
        <Card color='primary'>
          <CardHeader
            title='Today'
            className='purple'
            sx={{ p: { lg: 1.2, xs: 0.8 } }}
          />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='key'>Sales</span>
              <span className='money'>{formatMoney(stats.today.sales)}</span>
              {/* <TrendingUp /> */}
            </div>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='key'>Profit</span>
              <span className='money'>{formatMoney(stats.today.profit)}</span>
              {/* <TrendingUp /> */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            sx={{ p: { lg: 1.2, xs: 0.8 } }}
            title='This Month'
            className='green'
          />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='key'>Sales</span>
              <span className='money'>
                {formatMoney(stats.thisMonth.sales)}
              </span>
              {/* <TrendingUp /> */}
            </div>
            <div className='flex'>
              <span className='key'>Profit</span>
              <span className='money'>
                {formatMoney(stats.thisMonth.profit)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            sx={{ p: { lg: 1.2, xs: 0.8 } }}
            title='Last Month'
            className='orange'
          />
          <CardContent>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='key'>Sales</span>
              <span className='money'>{formatMoney(stats.lastMonth)}</span>
              {/* <TrendingDown /> */}
            </div>
            <div className='flex' style={{ alignItems: 'center' }}>
              <span className='key'>Profit</span>
              <span className='money'>
                {formatMoney(stats.lastMonth.profit)}
              </span>
              {/* <TrendingUp /> */}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='charts_container'>
        <div className='left'>
          <ChartPie title={'Product Purchase'} data={stats.products} />
        </div>
        <div className='right'>
          <ChartLine
            data={stats.monthly}
            datakey={'amt'}
            title='This Years Sales Distribution'
            grid={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
