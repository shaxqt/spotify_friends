import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

export default function Editable({ value, onSubmit, type = 'text' }) {
  const [localValue, setLocalValue] = useState(value)
  const [isEditMode, setIsEditMode] = useState(false)
  const textInput = useRef()

  const focusTextInput = _ => {
    textInput.current.focus()
    textInput.current.select()
  }
  const onChange = e => setLocalValue(e.target.value)

  useEffect(
    _ => (isEditMode && focusTextInput() /*: setLocalValue(value)) */),
    [isEditMode]
  )
  const handleSubmit = event => {
    event.preventDefault()
    onSubmit(localValue)
    setIsEditMode(false)
  }
  const handleCancel = _ => {
    setLocalValue(value)
    setIsEditMode(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <EditableStyled isEditMode={isEditMode}>
        <input
          spellCheck="false"
          readOnly={!isEditMode}
          ref={textInput}
          value={localValue}
          onChange={onChange}
          type={type}
        />
        {isEditMode ? (
          <div>
            {localValue !== value && (
              <i className="fa fa-check" onClick={handleSubmit}></i>
            )}
            <i className="fa fa-times" onClick={handleCancel}></i>
          </div>
        ) : (
          <>
            <i className="fa fa-edit" onClick={_ => setIsEditMode(true)}></i>
          </>
        )}
      </EditableStyled>
    </form>
  )
}
const EditableStyled = styled.div`
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  padding: 10px 20px;
  i {
    font-size: 25px;
    margin-left: 15px;
  }
  input {
    flex-grow: 1;
    color: #fff;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    font-size: 1rem;
    background-color: transparent;
    caret-color: rgb(30, 215, 97);
    &:focus {
      ${({ isEditMode }) =>
        isEditMode && 'border-bottom: 1px solid rgb(30, 215, 97);'}
    }
  }
`
