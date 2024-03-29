import React from 'react'
import GridStyled from '../utils/GridStyled'
import SectionHeaderStyled from '../utils/SectionHeaderStyled'
import User from '../common/User'
import {
  createOrRetractContactRequest,
  acceptOrDenyContactRequest
} from '../../api/api'

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
    try {
      if (user.isAcceptButtonActive) {
        await acceptOrDenyContactRequest({ source: user.id })
        onHandleSearchResult(user, false, true)
      } else {
        const sendContactRequest = user.isAddButtonActive

        await createOrRetractContactRequest(user, sendContactRequest)
        onHandleSearchResult(user, sendContactRequest)
      }
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
            images={userFound.images}
            display_name={userFound.display_name}
            isAddButtonActive={userFound.isAddButtonActive}
            isRetractButtonActive={userFound.isRetractButtonActive}
            isAcceptButtonActive={userFound.isAcceptButtonActive}
            contactInfo={userFound.contactInfo}
            onClick={_ => handleOnClick(userFound)}
          />
        ))}
    </GridStyled>
  )
}
