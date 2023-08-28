import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  CardActions,
} from '@mui/material'
import { Mail, Person, Badge } from '@mui/icons-material'
import React, { useState } from 'react'
import { useStateValue } from '../StateProvider'
import '../css/Profile.css'
import { formatMoney } from '../reducer'
import { transformInvoices } from '../firebase/factory'
import Popup from '../components/Popup'
import UpdatePassword from '../components/UpdatePassword'

function Profile() {
  const [openPopup, setOpen] = useState(false)
  const { user, invoices } = useStateValue()[0]
  const mySales = transformInvoices(
    invoices.filter((sale) => sale.userID === user.id)
  )
  const stats = {
    totalSales: mySales.reduce((sub, sale) => sub + sale.total, 0),
    totalProducts: mySales.reduce((sub, sale) => sub + parseInt(sale.qty), 0),
  }

  return (
    <div className='container profile'>
      <section className='left'>
        <h3>Profile</h3>
        <Card>
          <CardHeader
            className='dark-purple'
            avatar={<Avatar color='primary' />}
            title={user?.email?.split('@')[0]}
          />
          <CardContent>
            <Typography>
              <span className='key'>
                {' '}
                <Person /> Name
              </span>
              <span>{user?.name}</span>
            </Typography>
            <Typography>
              <span className='key'>
                <Mail />
                Email
              </span>
              <span>{user?.email}</span>
            </Typography>
            <Typography>
              <span className='key'>
                <Badge />
                Role
              </span>
              <span>{user?.role}</span>
            </Typography>
          </CardContent>
          <CardActions disableSpacing className='profile__actions'>
            {/* <Button aria-label='add to favorites'>Edit</Button> */}
            <button className='button green' onClick={() => setOpen(true)}>
              Update Password
            </button>
            {/* <Button aria-label='edit'>Edit</Button> */}
          </CardActions>
        </Card>
      </section>
      <section className='right'>
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
          {/* <div className='metric'>
            <Typography variant='title' className='key'>
              Avg Monthly Sales
            </Typography>
            <Typography variant='subtitle' className='money'>
              {formatMoney(stats.averageMonthly)}
            </Typography>
          </div> */}
          <div className='metric'>
            <Typography variant='title' className='key'>
              Total Products Sold
            </Typography>
            <Typography variant='subtitle' className='money'>
              {stats.totalProducts}
            </Typography>
          </div>
        </div>
      </section>
      <Popup title='Update Paswword' open={openPopup} setOpen={setOpen}>
        <UpdatePassword close={() => setOpen(false)} />
      </Popup>
    </div>
  )
}

export default Profile
