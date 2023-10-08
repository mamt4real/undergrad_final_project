import React from 'react'
import Popup from './Popup'
import { useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { CalendarMonth, EditOutlined } from '@mui/icons-material'
import { getYearRange } from '../utils/helpers'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { formatMoney } from '../utils/helpers'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined'
import { toDdMmmYy } from '../utils/dateFunctions'
import { markYearAsPaid } from '../firebase/zakatyears'
import { useOutletContext } from 'react-router-dom'

function ZakatYearInfo({ zakatYear }) {
  const [openPopup, setOpen] = useState(false)
  const setShowModal = useOutletContext()[1]

  const markAsPaid = async () => {
    const effectAction = async () => {
      try {
        const updated = await markYearAsPaid(zakatYear?.id)
        for (const key in updated) zakatYear[key] = updated[key]
        setOpen(false)
        alert('updated successfully')
      } catch (error) {
        console.error(error)
        alert('Error updating year\n' + error.message)
      }
    }
    setOpen(false)
    setShowModal({
      open: true,
      title: `Are you sure you want to mark ${getYearRange(
        zakatYear
      )} zakat as paid?`,
      subtitle: "This action can't be reversed!",
      callback: () =>
        effectAction()
          .then()
          .catch((err) => alert(err.message)),
    })
  }

  return (
    <div className='zakatyearinfo'>
      <Popup title='Zakat Year Infomation' open={openPopup} setOpen={setOpen}>
        <Box
          display={'flex'}
          sx={{ gap: { xs: 1, md: 2, lg: 2.5 } }}
          flexDirection={'column'}
        >
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <CalendarMonth /> Date Range
            </Typography>
            <Typography>{getYearRange(zakatYear)}</Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <AccountBalanceWalletOutlinedIcon /> Opening Balance
            </Typography>
            <Typography>{formatMoney(zakatYear?.openingBalance)}</Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <MonetizationOnOutlinedIcon /> Opening Nisaab
            </Typography>
            <Typography>{formatMoney(zakatYear?.nisab)}</Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <AccountBalanceWalletOutlinedIcon /> Closing Balance
            </Typography>
            <Typography>{formatMoney(zakatYear?.closingBalance)}</Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <MonetizationOnOutlinedIcon /> Closin Nisaab
            </Typography>
            <Typography>{formatMoney(zakatYear?.closingNisab)}</Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <AttachMoneyOutlinedIcon /> Amount Due
            </Typography>
            <Typography>
              {zakatYear?.amountDue ? formatMoney(zakatYear?.amountDue) : 'N/A'}
            </Typography>
          </Box>

          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <PriceCheckOutlinedIcon /> Payment Status
            </Typography>
            <Typography component={'div'}>
              <div
                style={{ marginRight: 0 }}
                className={`status-button flex ${
                  zakatYear?.paymentStatus === 'paid'
                    ? 'paid'
                    : zakatYear?.paymentStatus === 'not-paid'
                    ? 'pending'
                    : 'draft'
                }`}
              >
                <span>{zakatYear?.paymentStatus}</span>
              </div>
            </Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography
              flex={1}
              gap={0.8}
              fontWeight={'bold'}
              display={'flex'}
              alignItems={'center'}
            >
              <CalendarMonth /> Date Paid
            </Typography>
            <Typography>
              {zakatYear.paymentStatus === 'paid'
                ? toDdMmmYy(zakatYear?.datePaid)
                : 'N/A'}
            </Typography>
          </Box>
        </Box>
        {zakatYear?.status !== 'active' && (
          <Box mt={2} display={'flex'} justifyContent={'center'}>
            {zakatYear?.paymentStatus === 'not-paid' && (
              <button className='orange' onClick={() => markAsPaid()}>
                Mark as Paid
              </button>
            )}
            <button className='green' onClick={() => {}}>
              Print
            </button>
          </Box>
        )}
      </Popup>
      <IconButton onClick={() => setOpen(true)}>
        <Tooltip title='Zakat Yea Info'>
          <EditOutlined />
        </Tooltip>
      </IconButton>
    </div>
  )
}

export default ZakatYearInfo
