import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'

export default function TimeFilter({ activeFilter, setFilter }) {
  return (
    <TimeFilterStyled>
      <TimeLabelStyled>Filter Top Songs</TimeLabelStyled>
      <GridStyled autoFlow="column" alignItems="center" gap="10px">
        <ButtonRowStyled>
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
            last
          >
            lifetime
          </FilterButtonStyled>
        </ButtonRowStyled>
      </GridStyled>
    </TimeFilterStyled>
  )
}

const TimeLabelStyled = styled.label`
  justify-self: start;
  font-size: 1rem;
`
const TimeFilterStyled = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  padding-bottom: 0;
`

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
