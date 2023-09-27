import React, { useState } from 'react'
import Popup from './Popup'
import { Box, Typography } from '@mui/material'
import { getYearRange } from '../utils/helpers'
import { formatMoney } from '../reducer'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import { useEffect } from 'react'
import { getCurrentNisaabRate } from '../firebase/zakatyears'

function CalculateZakat({ zakatYear, netAssets }) {
  const [openPopup, setOpen] = useState(false)
  const [currentNisaab, setCurrentNisaab] = useState(zakatYear?.nisab || 0)
  const [expenses, setExpenses] = useState(0)
  const [amountDue, setAmountDue] = useState((1 / 40) * netAssets)

  useEffect(() => {
    getCurrentNisaabRate().then(setCurrentNisaab)
  }, [])
  useEffect(() => {
    const assets = netAssets - expenses
    if (assets >= currentNisaab) {
      setAmountDue((1 / 40) * assets)
    } else {
      setAmountDue(0)
    }
  }, [expenses, currentNisaab, netAssets])

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <Popup
        title={`Calculate Zakat for ${getYearRange(zakatYear)}`}
        open={openPopup}
        setOpen={setOpen}
      >
        <form className='loginform' onSubmit={handleSubmit}>
          <Box
            width={'100%'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <div className='input flex flex-column'>
              <label htmlFor='netAssets'>
                <PaidOutlinedIcon /> Net Assets (sales + assets)
              </label>
              <input
                type='text'
                id='netAssets'
                name='netAssets'
                readOnly
                defaultValue={formatMoney(netAssets)}
              />
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='nisaab'>
                <CurrencyExchangeOutlinedIcon /> Current Nisaab
              </label>
              <input
                type='text'
                id='nisaab'
                name='nisaab'
                readOnly
                value={formatMoney(currentNisaab)}
              />
            </div>
            <div className='input flex flex-column'>
              <label htmlFor='expenses'>
                <PaidOutlinedIcon />
                Year's Expenses (if any)
              </label>
              <input
                type='number'
                id='expenses'
                name='expenses'
                value={expenses}
                min={0}
                max={netAssets}
                onChange={(e) => setExpenses(e.target.valueAsNumber)}
              />
            </div>
          </Box>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={'85%'}
            mb={2}
          >
            <Typography variant='title' fontSize={'small'} fontStyle={'bold'}>
              <Box gap={1} display={'flex'} alignItems={'center'}>
                <PaidOutlinedIcon fontSize='small' />
                <span>Amount Due:</span>
              </Box>
            </Typography>
            <Typography fontSize={'large'}>
              {amountDue ? formatMoney(amountDue) : 'N/A'}
            </Typography>
          </Box>
          <Box display={'flex'} justifyContent={'center'} gap={2}>
            <button className='button red' onClick={() => setOpen(false)}>
              Cancel
            </button>{' '}
            <button className='button dark-purple' type='submit'>
              Calculate
            </button>
          </Box>
        </form>
      </Popup>
      <button className='button dark-purple' onClick={() => setOpen(true)}>
        Calculate
      </button>
    </div>
  )
}

export default CalculateZakat
