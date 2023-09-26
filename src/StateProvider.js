import React, { createContext, useContext, useReducer } from 'react'

export const StateContext = createContext()

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

/**
 *
 * @returns {[object,(payload:{type:"SET_ACTIVE_YEAR"| "SET_CURRENT_INVOICE" | "SET_INVOICES" | "SET_PRODUCTS" | "SET_USER" | "SET_INVOICES_LOADED" | "SET_REPORTS" | "SET_SEARCHED" | "SET_STAFFS" | "UPDATE_ENGINE" | "UPDATE_INVOICE" | "UPDATE_STAFF" | "UPDATE_USER" | "ADD_ENGINE" | "ADD_INVOICE" | "ADD_STAFF" | "DELETE_ENGINE" | "DELETE_INVOICE" | "DELETE_STAFF" | "TOGGLE_INVOICE_MODAL" | "TOGGLE_MODAL" | "LOGOUT" , data:any})=>void]}
 */
export const useStateValue = () => useContext(StateContext)
