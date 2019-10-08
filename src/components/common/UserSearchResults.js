import React, { useEffect, useState } from 'react'
import GridStyled from '../utils/GridStyled'
import SectionHeaderStyled from '../utils/SectionHeaderStyled'
import User from '../common/User'
import { createOrRetractContactRequest } from '../../api/api'

export default ({ searchResult, onHandleSearchResult, query }) => {
  const searchInfo = getSearchInfo(query)
  return (
    <GridStyled gap="20px">
      <SectionHeaderStyled>{searchInfo}</SectionHeaderStyled>
      {searchResult &&
        searchResult.map(userFound => (
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
  async function handleOnClick(user) {
    const sendContactRequest = user.isAddButtonActive
    try {
      await createOrRetractContactRequest(user, sendContactRequest)
      onHandleSearchResult(user, sendContactRequest)
    } catch (err) {
      console.log('UserSearchResults handleOnClick error', err)
    }
  }
  function getSearchInfo(query) {
    if (query !== '') {
      if (searchResult.length === 0) {
        return 'no user found'
      } else if (searchResult.length === 1) {
        return 'one user found'
      } else {
        return searchResult.length + ' users found'
      }
    } else {
      return ''
    }
  }
}
