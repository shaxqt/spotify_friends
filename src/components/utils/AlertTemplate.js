import React from 'react'
import AlertTemplate from 'react-alert-template-basic'

const AlertTemplateStyled = ({ message, options, close }) => {
  const style = {
    backgroundColor: '#151515',
    color: 'white',
    padding: '10px',
    textTransform: '',
    fontSize: '12px',
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
    fontFamily: 'inherit',
    width: '350px'
  }
  return (
    <AlertTemplate
      style={style}
      message={message}
      options={options}
      close={close}
    />
  )
}
export default AlertTemplateStyled
