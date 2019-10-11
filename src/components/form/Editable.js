import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Editable.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string
}
Editable.defaultProps = {
  type: 'text'
}
export default function Editable({
  value,
  onSubmit,
  label,
  isEditable,
  type = 'text'
}) {
  const [localValue, setLocalValue] = useState(value)
  const [isEditMode, setIsEditMode] = useState(false)
  const textInput = useRef()

  useEffect(
    _ => {
      if (isEditMode) {
        textInput.current.focus()
        textInput.current.select()
      } else {
        textInput.current.setSelectionRange(0, 0)
      }
    },
    [isEditMode]
  )
  useEffect(
    _ => {
      if (!isEditable) handleCancel()
    },
    [isEditable]
  )

  const handleInputChange = event => setLocalValue(event.target.value)
  const handleSubmit = e => {
    e.preventDefault()
    setIsEditMode(false)
    onSubmit(localValue)
  }
  const handleCancel = e => {
    setLocalValue(value)
    setIsEditMode(false)
  }
  return (
    <form onSubmit={handleSubmit}>
      <LabelStyled>
        {label}
        <EditableStyled isEditMode={isEditMode}>
          <input
            spellCheck="false"
            readOnly={!isEditMode}
            ref={textInput}
            type={type}
            value={localValue}
            onChange={handleInputChange}
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
      </LabelStyled>
    </form>
  )
}
const LabelStyled = styled.label`
  display: grid;
  grid-gap: 5px;
`
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
  &:focus-within {
    background-color: #666;
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
    ${({ isEditMode }) =>
      isEditMode && 'border-bottom: 1px solid rgb(30, 215, 97);'}
  }
`
