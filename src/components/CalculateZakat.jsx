import React, { useState } from 'react'
import Popup from './Popup'
import { Box, Typography } from '@mui/material'
import { getYearRange } from '../utils/helpers'
import { formatMoney } from '../reducer'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import { useEffect } from 'react'
import {
  getCurrentNisaabRate,
  terminateZakatYear,
} from '../firebase/zakatyears'
import { cleanDate } from '../utils/dateFunctions'
import { useStateValue } from '../StateProvider'

function CalculateZakat({ zakatYear, grossAssets }) {
  const dispatch = useStateValue()[1]
  const [openPopup, setOpen] = useState(false)
  const [currentNisaab, setCurrentNisaab] = useState(zakatYear?.nisab || 0)
  const [expenses, setExpenses] = useState(0)
  const [amountDue, setAmountDue] = useState((1 / 40) * grossAssets)

  const isEnabled = () => {
    // return true
    if (!zakatYear) return false
    return cleanDate(zakatYear.endDate).getTime() <= Date.now()
  }

  useEffect(() => {
    getCurrentNisaabRate().then(setCurrentNisaab)
  }, [])
  useEffect(() => {
    const assets = grossAssets - expenses
    if (assets >= currentNisaab) {
      setAmountDue((1 / 40) * assets)
    } else {
      setAmountDue(0)
    }
  }, [expenses, currentNisaab, grossAssets])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newActive = await terminateZakatYear(
        zakatYear,
        grossAssets - expenses
      )
      dispatch({ type: 'SET_ACTIVE_YEAR', data: newActive })
      setOpen(false)
      alert('Zakat Calculated Successfully')
    } catch (error) {
      console.error(error)
      alert('error in calculating the zakat')
    }
  }

  return (
    <div className='calculatezakat'>
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
              <label htmlFor='grossAssets'>
                <PaidOutlinedIcon /> Gross Assets (sales + assets)
              </label>
              <input
                type='text'
                id='grossAssets'
                name='grossAssets'
                readOnly
                defaultValue={formatMoney(grossAssets)}
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
                max={grossAssets}
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
                <span>Net Assets:</span>
              </Box>
            </Typography>
            <Typography fontSize={'large'}>
              {amountDue ? formatMoney(grossAssets - expenses) : 'N/A'}
            </Typography>
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
      <button
        disabled={!isEnabled()}
        className='button dark-purple'
        onClick={() => setOpen(true)}
      >
        {isEnabled() ? `Calculate` : 'N/A'}
      </button>
    </div>
  )
}

export default CalculateZakat
