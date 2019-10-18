import React, { useState, useEffect, useContext } from 'react'
import Input from '../form/Input'
import Button from '../form/Button'
import Form from '../form/Form'
import { findRemove, findReplace } from '../../utils/utils'
import Main from '../utils/Main'
import { searchUser, getContactRequests } from '../../api/api'
import UserSearchResults from '../common/UserSearchResults'
import ContactRequestList from '../common/ContactRequestList'
import SocketContext from '../../context/SocketContext'

export default function ContactPage({ onRequestAccepted, setRequestCount }) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState('')
  const [contactRequests, setContactRequests] = useState([])
  const socket = useContext(SocketContext)

  useEffect(
    _ => {
      fetchContacts()
      socket.on('update_requests', data => {
        fetchContacts()
      })
    },
    [query]
  )
  useEffect(_ => setRequestCount(contactRequests.length), [contactRequests])

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

      <UserSearchResults
        searchResults={searchResults}
        onHandleSearchResult={updateSearchResult}
        query={query}
      />
      <ContactRequestList
        contactRequests={contactRequests}
        onHandleContactRequest={onHandleContactRequest}
      />
    </Main>
  )
  function fetchContacts() {
    getContactRequests()
      .then(requests => {
        setContactRequests(requests)
        searchUser(query)
          .then(setSearchResults)
          .catch(err => err)
      })
      .catch(err => err)
  }

  function updateSearchResult(user, create, wasAccepted = false) {
    let newContactInfo = create ? 'request sent' : 'request retracted'
    newContactInfo = wasAccepted ? 'request accepted' : newContactInfo
    setSearchResults(
      findReplace(searchResults, user, {
        ...user,
        contactInfo: newContactInfo,
        isAddButtonActive: !create && !wasAccepted,
        isRetractButtonActive: create && !wasAccepted,
        isAcceptButtonActive: false
      })
    )
    wasAccepted && onRequestAccepted() // updates friends page
  }
  function onHandleContactRequest(request, accept = true) {
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
            contactInfo: accept ? 'request accepted' : 'request denied'
          })
        )
      }
    }
    accept && onRequestAccepted() // updates friends page
  }
}
