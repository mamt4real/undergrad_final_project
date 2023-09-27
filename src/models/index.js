/**
 * Invoice default Model
 */
export const Invoice = {
  clientName: '',
  clientPhone: '',
  clientAddress: '',
  clientCity: '',
  invoiceDateUnix: '',
  invoiceDate: new Date(),
  paymentDueDate: new Date(),
  paymentDueDateUnix: '',
  productDescription: '',
  invoicePending: '',
  invoiceDraft: '',
  invoicePaid: '',
  invoiceItemList: [
    { itemName: '', engineNo: '', qty: 1, price: 0, total: 0, cost: 0 },
  ],
  invoiceTotal: 0,
  printed: false,
  userID: null,
  zakatYearID: null,
}

/**
 * Zakat year default model
 */
export const ZakatYear = {
  id: '',
  /**
   * Net Asset Value as the begining of The Year
   * must be >= nisaab
   */
  openingBalance: 0,
  /**
   * The Nisaab as at the begining of the Year
   */
  nisab: 0,
  /**
   * Start Date of the Year range
   */
  beginDate: new Date(),
  /**
   * End Date of the Year range
   */
  endDate: new Date(),
  /**
   * Date The Due amount is paid (if applicable)
   */
  datePaid: new Date(),
  /**
   * Net Assets Value as at the End of the Year Range
   */
  closingBalance: 0,
  /**
   * Amount Due for The Year (to be calculated at the end of the Year)
   */
  amountDue: 0,
  /**
   * Marker for the Years time
   * (active for current inactive otherwise)
   */
  status: 'inactive',
  /**
   * Marker for Payment
   * one of ('paid', 'not-paid', 'not-applicable')
   */
  paymentStatus: 'not-paid',
  dateCreated: new Date(),
}

/**
 *
 */
export const Product = {
  /**
   * Name of The Product
   * it has be unique
   */
  name: '',
  /**
   * Cost of The Product to the Business owner
   */
  costPrice: 0,
  /**
   * Quantity of the Product in stock
   */
  quantity: 0,
  /**
   * Borderline selling price of the product
   */
  basePrice: 0,
}
