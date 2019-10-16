import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  type: PropTypes.string,
  inputIcon: PropTypes.string
}
Input.defaultProps = {
  type: 'text'
}
export default function Input({
  label,
  placeholder,
  onChange,
  value,
  type = 'text',
  inputIcon
}) {
  if (label) {
    return (
      <LabelStyled>
        {label}
        {renderInput()}
      </LabelStyled>
    )
  } else {
    return renderInput()
  }
  function renderInput() {
    return (
      <IconInputStyled>
        <i className={inputIcon}></i>
        <InputStyled
          spellCheck="false"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          type={type}
        />
      </IconInputStyled>
    )
  }
}

const IconInputStyled = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 20px auto;
  align-items: center;
  border-radius: 20px;
  padding: 10px 20px;
  background-color: #444;
  &:focus-within {
    background-color: #666;
  }
  & > i {
    color: #888;
  }
  &:focus-within > i {
    color: #1db954;
  }
`
const InputStyled = styled.input`
  outline: none;
  border: none;
  font-size: 1rem;
  background: none;
  color: inherit;
  &::placeholder {
    color: #888;
  }
`
const LabelStyled = styled.label`
  display: grid;
  grid-gap: 5px;
`
