import React from 'react'
import GridStyled from '../utils/GridStyled'
import SectionHeaderStyled from '../utils/SectionHeaderStyled'
import User from '../common/User'
import { createOrRetractContactRequest } from '../../api/api'

export default function UserSearchResults({
  searchResults,
  onHandleSearchResult,
  query
}) {
  const searchInfo = query => {
    if (query !== '') {
      if (searchResults.length === 0) {
        return 'no user found'
      } else if (searchResults.length === 1) {
        return 'one user found'
      } else {
        return searchResults.length + ' users found'
      }
    } else {
      return ''
    }
  }
  const handleOnClick = async user => {
    const sendContactRequest = user.isAddButtonActive
    try {
      await createOrRetractContactRequest(user, sendContactRequest)
      console.log(typeof onHandleSearchResult)
      console.log(user, sendContactRequest)
      onHandleSearchResult(user, sendContactRequest)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <GridStyled gap="20px">
      <SectionHeaderStyled>{searchInfo(query)}</SectionHeaderStyled>
      {searchResults &&
        searchResults.map(userFound => (
          <User
            key={userFound.id}
            display_name={userFound.display_name}
            isAddButtonActive={userFound.isAddButtonActive}
            isRetractButtonActive={userFound.isRetractButtonActive}
            contactInfo={userFound.contactInfo}
            onClick={_ => handleOnClick(userFound)}
          />
        ))}
    </GridStyled>
  )
}
