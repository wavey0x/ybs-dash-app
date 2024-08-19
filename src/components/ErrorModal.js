// ErrorModal.js

import React from 'react';
import Modal from 'react-modal';
import './ErrorModal.css';

const ErrorModal = ({ isOpen, onRequestClose, errorMessage }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      className="error-modal-content"
      overlayClassName="error-modal-overlay"
    >
      <div className="modal-header">
        <button className="error-modal-close-button" onClick={onRequestClose}>
          &times;
        </button>
      </div>
      <div className="error-modal-body">
        <p>{errorMessage}</p>
      </div>
    </Modal>
  );
};

export default ErrorModal;
