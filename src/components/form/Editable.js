import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Editable.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
  type: PropTypes.string,
  maxLength: PropTypes.string
}
Editable.defaultProps = {
  type: 'text',
  isEditable: true,
  maxLength: '20'
}
export default function Editable({
  value,
  onSubmit,
  label,
  isEditable,
  type,
  maxLength
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
  useEffect(_ => setIsEditMode(false), [isEditable])
  return (
    <form onSubmit={handleSubmit}>
      <LabelStyled>
        {label}
        <EditableStyled isEditMode={isEditMode}>
          <input
            maxLength={maxLength}
            spellCheck="false"
            readOnly={!isEditMode}
            ref={textInput}
            type={type}
            value={isEditMode ? localValue : value}
            onChange={handleInputChange}
            onBlur={_ => value === localValue && setIsEditMode(false)}
          />
          {isEditMode ? (
            <div className="icons">
              {localValue !== value && (
                <i className="fa fa-check" onClick={handleSubmit}></i>
              )}
              <i
                className="fa fa-times"
                onClick={_ => setIsEditMode(false)}
              ></i>
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
  function handleInputChange(event) {
    setLocalValue(event.target.value)
  }
  function handleSubmit(event) {
    event.preventDefault()
    setIsEditMode(false)
    onSubmit(localValue)
  }
}
const LabelStyled = styled.label`
  display: grid;
  padding-left: 20px;
  grid-gap: 5px;
`
const EditableStyled = styled.div`
  background-color: #444;
  margin-left: -20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding: 10px 20px;
  i {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    width: 26px;
    margin-bottom: -3px;
    margin-top: -3px;
    font-size: 26px;
    margin-left: 10px;
  }
  &:focus-within {
    background-color: #666;
  }
  .icons {
    height: 20px;
    display: flex;
    flex-direction: row;
  }
  input {
    display: inline-block;
    height: 20px;
    flex-grow: 1;
    color: inherit;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    font-size: 1rem;
    background-color: transparent;
    caret-color: #1db954;
    ${({ isEditMode }) => isEditMode && 'border-bottom: 1px solid #1DB954;'}
  }
`
