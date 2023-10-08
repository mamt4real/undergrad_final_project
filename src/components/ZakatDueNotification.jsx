import React, { useState, useEffect } from 'react'
import { useStateValue } from '../StateProvider'
import Popup from './Popup'
import { Box, Typography } from '@mui/material'
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined'
import { cleanDate, dayDifference } from '../utils/dateFunctions'
import { useNavigate } from 'react-router-dom'

function ZakatDueNotification() {
  const { activeYear } = useStateValue()[0]
  const navigate = useNavigate()
  const [openPopup, setOpen] = useState(false)

  useEffect(() => {
    if (!activeYear) return
    if (cleanDate(activeYear?.endDate).getTime() <= Date.now()) setOpen(true)
  }, [activeYear])

  return (
    <Popup title='Zakat Due Notification' open={openPopup} setOpen={setOpen}>
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={1.5}
        flexDirection={'column'}
      >
        <Box
          width={'80px'}
          height={'80px'}
          m='auto'
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            border: 'solid 2px red',
            borderRadius: '50%',
          }}
        >
          <PriorityHighOutlinedIcon fontSize='large' color='red' />
        </Box>
        <Typography variant='h6' color={'red'} textAlign={'center'}>
          Your Zakat Year is Over Due by{' '}
          {dayDifference(new Date(), activeYear?.endDate)} Day(s).
        </Typography>
        <Typography variant='subtitle' color={'orange'}>
          You need to Complete the Calculation
        </Typography>

        <Box display={'flex'} gap={1} mt={2}>
          <button className='red' onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className='purple'
            onClick={() => {
              setOpen(false)
              navigate('/admin/zakat')
            }}
          >
            Complete
          </button>
        </Box>
      </Box>
    </Popup>
  )
}

export default ZakatDueNotification
