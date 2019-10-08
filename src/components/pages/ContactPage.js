import React, { useState, useEffect } from 'react'
import Input from '../form/Input'
import Button from '../form/Button'
import Form from '../form/Form'
import { findRemove, findReplace } from '../../utils/utils'
import Main from '../utils/Main'
import { searchUser } from '../../api/api'
import UserSearchResult from '../common/UserSearchResults'
import UserRequests from '../common/UserRequests'

export default function ContactPage(props) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState('')
  const [contactRequests, setContactRequests] = useState([])

  useEffect(
    _ => {
      searchUser(query).then(setSearchResults)
    },
    [query]
  )

  return (
    <Main>
      <Form paddingTop="200px" onSubmit={_ => setQuery(search)}>
        <Input
          placeholder="search"
          inputIcon="fa fa-search"
          onChange={e => setSearch(e.target.value)}
        ></Input>
        <Button text="search" />
      </Form>

      <UserSearchResult
        searchResult={searchResults}
        onHandleSearchResult={updateSearchResult}
        query={query}
      />
      <UserRequests
        contactRequests={contactRequests}
        onHandleContactRequest={onHandleContactRequest}
      />
    </Main>
  )

  function updateSearchResult(user, create) {
    const newContactInfo = create ? 'request sent' : 'request retracted'
    console.log(user, create)
    setSearchResults(
      findReplace(searchResults, user, {
        ...user,
        contactInfo: newContactInfo,
        isAddButtonActive: !create,
        isRetractButtonActive: create
      })
    )
  }
  function onHandleContactRequest(request) {
    // remove from contact-requests
    setContactRequests(findRemove(contactRequests, request))
    // update message shown in searc-results
    if (searchResults.length > 0) {
      const handledContact = searchResults.find(
        userFound => userFound.id === request.source
      )
      if (handledContact) {
        setSearchResults(
          findReplace(searchResults, handledContact, {
            ...handledContact,
            contactInfo: 'request accepted'
          })
        )
      }
    }
  }
}
