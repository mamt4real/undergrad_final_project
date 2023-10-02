import React from 'react'
import { Download, Print, ArrowBack } from '@mui/icons-material'
import { useStateValue } from '../StateProvider'
import { formatMoney } from '../utils/helpers'
import '../css/Reportspreview.css'
import { Link, useSearchParams } from 'react-router-dom'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import { useRef } from 'react'
import { toDdMmmYy } from '../utils/dateFunctions'

function ReportsPreview() {
  const tableRef = useRef(null)

  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const { reports } = useStateValue()[0]

  return (
    <div className='container reppreview flex flex-column'>
      <h2>
        Reports from <span>{from}</span> to <span>{to}</span>
      </h2>
      <section className='actions flex'>
        <Link to='/admin/reports'>
          <button className='button dark-purple'>
            <ArrowBack /> Back
          </button>
        </Link>
        <div className='flex'>
          <DownloadTableExcel
            filename={`invoice_report_${from?.replace('-', '')}_${to?.replace(
              '-',
              ''
            )}`}
            sheet='users'
            currentTableRef={tableRef.current}
          >
            <button className='button purple'>
              <Download />
              Excel
            </button>
          </DownloadTableExcel>

          <button className='button orange'>
            <Print />
            Print
          </button>
        </div>
      </section>
      <section className='records custom_scroll'>
        <table className='reppreview__table' border='border' ref={tableRef}>
          <thead>
            <tr>
              <th className='no'>#</th>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Sale</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((rec, i) => (
              <tr key={rec.id}>
                <td className='no'>{i + 1}</td>
                <td>{toDdMmmYy(rec.date)}</td>
                <td>{rec.itemName}</td>
                <td>{rec.qty}</td>
                <td className='money'>{formatMoney(rec.total)}</td>
                <td className='money'>
                  {formatMoney(rec.total - rec.cost * rec.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default ReportsPreview
