export const initialState = {
  invoices: [],
  products: [],
  invoicesLoaded: null,
  currentInvoice: null,
  activeYear: null,
  invoiceModal: null,
  searched: [],
  reports: [],
  modal: null,
  showModal: null,
  staffs: [],
  user: null,
  userType: null,
  token: null,
}

export const formatMoney = (amount) => {
  if (isNaN(amount)) amount = 0.0
  return Number(amount).toLocaleString('us-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatdate = (dateObj) => {
  const date = dateObj?.hasOwnProperty('seconds')
    ? new Date(dateObj?.seconds * 1000 + dateObj?.nanoseconds / 1000000)
    : new Date(dateObj)

  return date.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

const updateFunction = (collection, modified, isDelete = false) => {
  const index = collection.findIndex((ses) => ses.id === modified?.id)
  const updated = [...collection]
  if (isDelete) updated.splice(index, 1)
  else updated[index] = modified
  return updated
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_INVOICES':
      return {
        ...state,
        invoices: action.data,
      }
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: updateFunction(state.invoices, action.data),
      }
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: updateFunction(state.invoices, { id: action.data }, true),
      }
    case 'ADD_INVOICE':
      state.invoices.splice(0, 0, action.data)
      return state

    case 'SET_CURRENT_INVOICE':
      return {
        ...state,
        currentInvoice:
          state.invoices.find((inv) => inv.id === action.data) ||
          state.searched.find((inv) => inv.id === action.data),
      }

    case 'SET_SEARCHED': {
      return {
        ...state,
        searched: action.data,
      }
    }
    case 'SET_REPORTS': {
      return {
        ...state,
        reports: action.data,
      }
    }
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.data,
      }
    case 'UPDATE_ENGINE':
      return {
        ...state,
        products: updateFunction(state.products, action.data),
      }
    case 'DELETE_ENGINE':
      return {
        ...state,
        products: updateFunction(state.products, { id: action.data }, true),
      }
    case 'ADD_ENGINE':
      state.products.splice(0, 0, action.data)
      return state
    case 'SET_STAFFS':
      return {
        ...state,
        staffs: action.data,
      }
    case 'UPDATE_STAFF':
      return {
        ...state,
        staffs: updateFunction(state.staffs, action.data),
      }
    case 'DELETE_STAFF':
      return {
        ...state,
        staffs: updateFunction(state.staffs, { id: action.data }, true),
      }
    case 'ADD_STAFF':
      state.staffs.splice(0, 0, action.data)
      return state
    case 'TOGGLE_INVOICE_MODAL':
      return {
        ...state,
        invoiceModal: !state.invoiceModal,
      }
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modal: !state.modal,
      }
    case 'SET_INVOICES_LOADED':
      return { ...state, invoicesLoaded: true }
    case 'SET_USER':
      return {
        ...state,
        user: action.data,
      }
    case 'SET_USER_TYPE':
      return {
        ...state,
        userType: action.data,
      }
    case 'UPDATE_USER': {
      return {
        ...state,
        user: { ...state.user, [action.key]: action.value },
      }
    }
    case 'SET_ACTIVE_YEAR':
      return {
        ...state,
        activeYear: action.data,
      }
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
      }
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
      }
    default:
      console.error(`Action ${action.type} not Implemented`)
      return state
  }
}
