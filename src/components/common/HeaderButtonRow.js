import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'

export default function HeaderButtonRow({
  label,
  labelValues,
  activeFilter,
  setFilter
}) {
  return (
    <HeaderSelectStyled>
      <HeaderLabelStyled>{label}</HeaderLabelStyled>
      <GridStyled autoFlow="column" alignItems="center" gap="10px">
        <ButtonRowStyled>
          {labelValues.map(({ label, value }, index) => (
            <FilterButtonStyled
              key={value}
              active={activeFilter === value}
              onClick={_ => setFilter(value)}
              last={index === labelValues.length - 1}
            >
              {label}
            </FilterButtonStyled>
          ))}
        </ButtonRowStyled>
      </GridStyled>
    </HeaderSelectStyled>
  )
}

const ButtonRowStyled = styled.div`
  border-radius: 8px;
  border: 1px solid #1db954;
  overflow: hidden;
`
const FilterButtonStyled = styled.button`
  font-size: 14px;
  outline: none;
  padding: 4px 8px;
  color: ${({ active }) => (active ? '#fff' : '#1db954')};
  background-color: ${({ active }) => (active ? '#1db954' : 'transparent')};
  border: none;
  border-right: ${({ last }) => (last ? 'none' : '1px solid #1db954')};
`
const HeaderSelectStyled = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  padding-bottom: 0;
`
const HeaderLabelStyled = styled.label`
  justify-self: start;
  font-size: 1rem;
`
