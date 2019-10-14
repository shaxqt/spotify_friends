import React from 'react'
import styled from 'styled-components'

export default function Checkbox({ label, info, value, onChange }) {
  const initValue = value
  return (
    <CheckboxStyled>
      <LabelStyled>
        {label}
        <input
          type="checkbox"
          id={label}
          checked={initValue}
          onChange={e => onChange(e.target.checked)}
        ></input>
        <label htmlFor={label}></label>
      </LabelStyled>
      {info && <InfoStyled>{info}</InfoStyled>}
    </CheckboxStyled>
  )
}
const InfoStyled = styled.small`
  color: #666;
`
const LabelStyled = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`
const CheckboxStyled = styled.section`
  input {
    display: none;
    &,
    &:after,
    &:before,
    & *,
    & *:after,
    & *:before,
    & + .tgl-btn {
      box-sizing: border-box;
      &::selection {
        background: none;
      }
    }

    + label {
      outline: 0;
      display: block;
      width: 60px;
      height: 30px;
      position: relative;
      cursor: pointer;
      user-select: none;
      &:after,
      &:before {
        position: relative;
        display: block;
        content: '';
        width: 50%;
        height: 100%;
      }
      &:after {
        left: 0;
      }
      &:before {
        display: none;
      }
    }
    &:checked + label:after {
      left: 50%;
    }
  }
  input {
    + label {
      background: #666;
      border-radius: 20px;
      padding: 2px;
      transition: all 0.4s ease;
      &:after {
        border-radius: 2em;
        background: #eee;
        transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
          padding 0.3s ease, margin 0.3s ease;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
      }
      &:hover:after {
        will-change: padding;
      }
      &:active {
        box-shadow: inset 0 0 0 2em rgb(30, 215, 97);
        &:after {
          padding-right: 0.8em;
        }
      }
    }
    &:checked + label {
      background: rgb(30, 215, 97);
      &:active {
        box-shadow: none;
        &:after {
          margin-left: -0.8em;
        }
      }
    }
  }
`
