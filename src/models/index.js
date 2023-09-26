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
