import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'

export default function TimeFilter({ activeFilter, setFilter }) {
  return (
    <TimeFilterStyled>
      <TimeLabelStyled>Filter Top Songs</TimeLabelStyled>
      <GridStyled autoFlow="column" alignItems="center" gap="10px">
        <FilterButtonStyled
          active={activeFilter === 'short_term'}
          onClick={_ => setFilter('short_term')}
        >
          4 weeks
        </FilterButtonStyled>
        <FilterButtonStyled
          active={activeFilter === 'medium_term'}
          onClick={_ => setFilter('medium_term')}
        >
          6 Month
        </FilterButtonStyled>
        <FilterButtonStyled
          active={activeFilter === 'long_term'}
          onClick={_ => setFilter('long_term')}
        >
          lifetime
        </FilterButtonStyled>
      </GridStyled>
    </TimeFilterStyled>
  )
}

const TimeLabelStyled = styled.label`
  font-size: 14px;
  justify-self: start;
`
const TimeFilterStyled = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  padding-bottom: 0;
`

const FilterButtonStyled = styled.button`
  font-size: 14px;
  border-style: border-box;
  border-radius: 5px;
  padding: 5px;
  outline: none;
  color: ${({ active }) => (active ? '#fff' : '#1db954')};
  border: 1px solid #1db954;
  background-color: ${({ active }) => (active ? '#1db954' : 'transparent')};
`
