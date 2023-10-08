import { uid } from 'uid'
import { oneDay, oneMonth } from '../utils/dateFunctions'
// Dummy Users
export const users = Array(4)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    email: `user${i + 1}@example.com`,
    password: '12345pass',
    name: 'User ' + ['One', 'Two', 'Three', 'Four'][i],
    role: ['admin', 'client'][i === 0 ? 0 : 1],
  }))

// Dummy Products
const temp = [
  'TIGER ELEMAX',
  'YAMAHA',
  'TECH',
  'TECH',
  'BIBUT',
  '4ft X 4ft Window',
]
export const products = temp.map((name) => {
  const costPrice = Math.round(Math.random() * 10000000) / 100
  const profit = Math.round(Math.random() * 20 * costPrice) / 100
  return {
    id: uid(6),
    name,
    costPrice,
    quantity: Math.ceil(Math.random() * 100),
    basePrice: costPrice + profit,
    lastOrderDate: new Date(),
  }
})

// Dummy Zakat Years
export const zakatYears = [
  {
    id: uid(6),
    openingBalance: 1_500_000 - Math.random() * 700_000,
    closingBalance: null,
    nisab: 700_000 + Math.random() * 100_000,
    beginDate: new Date(Date.now() - oneMonth),
    endDate: new Date(Date.now() + 11 * oneMonth),
    datePaid: null,
    amountDue: null,
    status: 'active',
    paymentStatus: 'not-paid',
    dateCreated: new Date(),
  },
  {
    id: uid(6),
    openingBalance: 1_500_000 - Math.random() * 700_000,
    nisab: 700_000 + Math.random() * 100_000,
    closingNisab: 700_000 + Math.random() * 100_000,
    beginDate: new Date(Date.now() - 13 * oneMonth),
    endDate: new Date(Date.now() - oneMonth),
    datePaid: new Date(Date.now() - oneMonth + oneDay),
    closingBalance: 750_000 + Math.random() * 1_000_000 - 500_000,
    amountDue: (1 / 40) * Math.random() * 1_500_000,
    status: 'inactive',
    paymentStatus: 'paid',
    dateCreated: new Date(),
  },
]

// Dummy RInvoices
const data = Array(15)
  .fill(null)
  .map((_, i) => {
    let invoiceTotal = 0
    const invoiceDate = new Date(
      i < 8 ? 2022 : 2023,
      Math.round(Math.random() * 12),
      Math.round(Math.random() * 25)
    )
    return {
      id: uid(6),
      billerStreetAddress: 'Street Address' + (i + 1),
      billerCity: 'City' + (i + 1),
      billerZipCode: 'Zip Code' + (i + 1),
      billerCountry: 'Country' + (i + 1),
      clientName: 'Name' + (i + 1),
      clientPhone: Math.floor(Math.random() * 100_000_000_000),
      clientEmail: 'email' + (i + 1) + '@example.com',
      clientAddress: 'strret address' + (i + 1),
      clientCity: 'client City' + (i + 1),
      clientZipCode: 'zip code' + (i + 1),
      clientCountry: 'client country ' + (i + 1),
      invoiceDateUnix: '',
      invoiceDate,
      paymentTerms: i % 2 ? 30 : 60,
      paymentDueDate: new Date(
        invoiceDate.getTime() + oneDay * (30 * ((i % 2) + 1))
      ),
      paymentDueDateUnix: new Date(Date.now() + (i + 1) * 86400),
      productDescription: '',
      invoicePending: !!(i % 2),
      invoiceDraft: '',
      invoicePaid: !(i % 2),
      invoiceItemList: Array(i + 1)
        .fill()
        .map((_, i) => {
          const engine = products[Math.floor(Math.random() * products.length)]
          invoiceTotal += engine.basePrice * (i + 1)
          return {
            itemName: engine.name,
            engineNo: Math.floor(Math.random() * 10000000),
            qty: i + 1,
            price: engine.basePrice,
            cost: engine.costPrice,
            total: engine.basePrice * (i + 1),
          }
        }),
      invoiceTotal,
      userID: i % users.length,
      zakatYearID: zakatYears[i < 8 ? 1 : 0].id,
    }
  })

// Dummy chart data
export const userSalesData = [
  {
    name: 'Jan',
    'Active User': 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    'Active User': 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    'Active User': 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    'Active User': 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    'Active User': 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    'Active User': 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    'Active User': 1234,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Aug',
    'Active User': 6610,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Sep',
    'Active User': 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Oct',
    'Active User': 3410,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Nov',
    'Active User': 5590,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Dec',
    'Active User': 2390,
    pv: 4300,
    amt: 2100,
  },
]

export default data
