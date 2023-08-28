import React, { useState } from 'react'
import {
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material'
import useTable from '../hooks/useTable'
import { EditOutlined, PlusOne } from '@mui/icons-material'
import Popup from '../components/Popup'
import '../css/Users.css'
import EngineForm from '../components/EngineForm'
import { formatMoney } from '../reducer'
import { useStateValue } from '../StateProvider'

import { Link } from 'react-router-dom'

const headCells = [
  { id: 'name', label: 'Product Name' },
  { id: 'costPrice', label: 'Cost Price' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'basePrice', label: 'Selling Price' },
  { id: 'actions', label: 'Actions', disableSort: true },
]

function Products() {
  const [edited, setEdited] = useState(null)
  const [openPopup, setOpen] = useState(false)
  const [filter, setFilter] = useState({ fn: (items) => items })
  const { products } = useStateValue()[0]

  const { TableContainer, TblHead, TblPagination, recordsAfterPagination } =
    useTable(products, headCells, filter)

  const handleNew = (e) => {
    setEdited(null)
    setOpen(true)
  }

  const handleSearch = (e) => {
    let query = e.target.value
    setFilter({
      fn: (items) =>
        query
          ? items.filter((item) =>
              item.name?.toLowerCase().includes(query.toLowerCase())
            )
          : items,
    })
  }
  return (
    <div className='container users'>
      <h1>Manage Products</h1>
      <div className='flex' style={{ alignItems: 'center', margin: '1rem 0' }}>
        <input
          placeholder='Search Products'
          type='text'
          id='email'
          name='email'
          className='search_input'
          onChange={handleSearch}
        />

        <button onClick={handleNew} className='button green new_btn'>
          <PlusOne /> Add
        </button>
      </div>
      <TableContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagination().map((e, i) => (
            <TableRow key={i + 1}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{formatMoney(e.costPrice)}</TableCell>
              <TableCell>{e.quantity}</TableCell>
              <TableCell>{formatMoney(e.basePrice)}</TableCell>
              <TableCell>
                <Link to={`/admin/products/${e.id}`}>
                  <Tooltip title='Details'>
                    <IconButton
                      sx={{ backgroundColor: 'primary.dark' }}
                      variant='contained'
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
      <TblPagination />
      <Popup title='Add Product' open={openPopup} setOpen={setOpen}>
        <EngineForm engine={edited} close={() => setOpen(false)} />
      </Popup>
    </div>
  )
}

export default Products
