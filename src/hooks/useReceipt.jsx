import React from 'react'
import '../css/Receipt.css'
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
  Barcode,
} from 'react-thermal-printer'

import 'react-thermal-printer'
import { formatdate, formatMoney } from '../reducer'

function useReceipt(invoice, closeFunction, printCallback) {
  const itm = invoice?.invoiceItemList[0]

  const customFormat = (no) => {
    const money = formatMoney(no)
    const i = money.search(/\d/)
    return `N${money.substring(i)}`
  }

  const receipt = (
    <Printer type='epson' width={32} characterSet='korea'>
      <Text align='center' size={{ width: 1, height: 2 }}>
        Al-Fikra Enterprise
      </Text>
      <Text align='center' bold={true}>
        General Merchandize
      </Text>
      <Text align='center'>No 23 new Jos Road Zaria</Text>
      <Text align='center' style={{ fontStyle: 'italic' }}>
        Phone: 08023740554
      </Text>
      <Br />
      <Text underline='1dot-thick' align='center'>
        Customer Cash Receipt
      </Text>
      <Br />
      <Text bold={true}>Receipt No: {invoice?.id}</Text>
      <Text bold={true}>Customer: {invoice?.clientName}</Text>
      <Text bold={true}>Phone: {invoice?.clientPhone}</Text>
      <Text bold={true}>
        Address: {invoice?.clientAddress?.substring(0, 23)}
      </Text>
      <Text bold={true}>Date: {formatdate(invoice?.invoiceDate)}</Text>
      <Br />

      <Text align='center' bold={true} underline={true}>
        Item Description
      </Text>
      {/* <Row left='Item (Quantity)' right={'Total Price'} /> */}
      <Line character='=' />
      {/* {invoice?.invoiceItemList.map((itm, i) => ( */}
      <Row
        left={<Text bold={true}>Name</Text>}
        right={<Text>{itm?.itemName}</Text>}
      />
      <Row
        left={<Text bold={true}>Engine No.</Text>}
        right={<Text>{itm?.engineNo}</Text>}
      />
      <Row
        left={<Text bold={true}>Quantity</Text>}
        right={<Text>{itm?.qty}</Text>}
      />
      <Row
        left={<Text bold={true}>Unit Price</Text>}
        right={<Text>{customFormat(itm?.total)}</Text>}
      />
      <Line character='=' />

      <Row
        left={<Text bold={true}>Total:</Text>}
        right={<Text>{customFormat(invoice?.invoiceTotal)}</Text>}
      />
      <Barcode align='center' type='UPC-A' content={invoice?.clientPhone} />
      <Text>Signature</Text>
      <Line character='_' />
      <Cut />
    </Printer>
  )

  const Receipt = () => receipt

  const handlePrint = async () => {
    let port
    try {
      const data = await render(receipt)
      port = await window.navigator.serial.requestPort()
      try {
        await port.open({ baudRate: 9600 })
      } catch (error) {
        console.log(error.message)
      }

      const writer = port.writable?.getWriter()
      if (writer != null) {
        await writer.write(data)
        writer.releaseLock()
        printCallback()
        closeFunction()
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
      await port.close()
    }
  }

  const ActionsTab = () => (
    <div className='actions flex'>
      <button className='button red' onClick={() => closeFunction()}>
        Cancel
      </button>
      <button className='button green' onClick={handlePrint}>
        Print
      </button>
    </div>
  )

  return [Receipt, ActionsTab]
}

export default useReceipt
