import React from 'react'
import styled from 'styled-components'

export default function({ label, onChange, value, type = 'text' }) {
  return (
    <LabelStyled>
      {label}
      <IconInputStyled>
        <i className="fa fa-search"></i>
        <InputStyled
          spellCheck="false"
          onChange={onChange}
          value={value}
          type={type}
        />
      </IconInputStyled>
    </LabelStyled>
  )
}

const IconInputStyled = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 20px auto;
  align-items: center;

  border-radius: 15px;
  padding: 8px 14px;
  background-color: #333;
  color: #eee;
  &:focus-within {
    background-color: #555;
  }
  & > i {
    color: #555;
  }
  &:focus-within > i {
    color: rgb(30, 215, 97);
  }
`
const InputStyled = styled.input`
  outline: none;
  border: none;
  font-size: 1rem;
  background: none;
  color: #eee;
`
const LabelStyled = styled.label`
  display: grid;
  grid-gap: 5px;
  color: #eee;
`
