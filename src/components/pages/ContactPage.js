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
import LoadingSpinner from '../utils/LoadingSpinner'
export default function ContactPage({ setRequestCount }) {
  const [isLoading, setIsLoading] = useState(false)
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
          maxLength="16"
        />
        <Button text={getButtonText()} />
      </Form>

      {isLoading ? (
        <LoadingSpinner height="200px" />
      ) : (
        <UserSearchResults
          searchResults={searchResults}
          onHandleSearchResult={updateSearchResult}
          query={query}
        />
      )}
      <ContactRequestList
        contactRequests={contactRequests}
        onHandleContactRequest={onHandleContactRequest}
      />
    </Main>
  )
  function getButtonText() {
    let text =
      search.length > 10
        ? search.substring(0, 10) +
          '...'.substring(0, Math.min(search.length - 10, 3))
        : search
    return text === '' ? 'search' : 'search "' + text + '"'
  }
  function fetchContacts() {
    setIsLoading(true)
    getContactRequests()
      .then(requests => {
        setContactRequests(requests)
        searchUser(query)
          .then(setSearchResults)
          .catch(err => err)
          .finally(err => setIsLoading(false))
      })
      .catch(err => setIsLoading(false))
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
  }
}
