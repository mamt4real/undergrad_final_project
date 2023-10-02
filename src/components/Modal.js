import React from 'react'
import '../css/Modal.css'
// import { useStateValue } from '../StateProvider'

function Modal({ closeFunction, modalOptions }) {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <p>
          {modalOptions.title}
          <br />
          <br />
          <span>{modalOptions.subtitle}</span>
        </p>
        <div className='actions flex'>
          <button className='purple' onClick={closeFunction}>
            Cancel
          </button>
          <button
            className='red'
            onClick={() => {
              modalOptions.callback()
              closeFunction()
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
