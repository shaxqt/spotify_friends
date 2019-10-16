import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Portal = ({ children, handleBackgroundClick }) =>
  ReactDOM.createPortal(
    <BackgroundStyled onClick={handleBackgroundClick}>
      {children}
    </BackgroundStyled>,
    document.getElementById('modal')
  )

export default function Modal({ children, title, show, toggle }) {
  return (
    <>
      {show && (
        <Portal handleBackgroundClick={toggleModal}>
          <ModalStyled>
            <div>{title}</div>
            <div className="hr"></div>
            <div>{children}</div>
          </ModalStyled>
        </Portal>
      )}
    </>
  )
  function toggleModal(event) {
    if (event.target === event.currentTarget) {
      toggle()
    }
  }
}

const ModalStyled = styled.div`
  padding: 20px;
  background-color: #333;
  border-radius: 20px;
  min-width: 200px;
  display: grid;
  grid-gap: 12px;

  .hr {
    width: 100%;
    border-bottom: 1px solid #666;
  }
`
const BackgroundStyled = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
`
