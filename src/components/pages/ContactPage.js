import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Input from '../form/Input'
import Button from '../form/Button'
import Form from '../form/Form'
import User from '../common/User'
import ContactRequest from '../common/ContactRequest'
import GridStyled from '../utils/GridStyled'
import { postRequest } from '../../api/fetch'
import { findRemove, findReplace } from '../../utils/utils'
import Main from '../utils/Main'

export default function ContactPage(props) {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [contactRequests, setContactRequests] = useState([])
  const [searchInfo, setSearchInfo] = useState('')

  useEffect(() => {
    getContactRequests()
  }, [])

  return (
    <Main>
      <Form paddingTop="200px" onSubmit={searchUser}>
        <Input
          placeholder="search"
          value={search}
          inputIcon="fa fa-search"
          onChange={e => setSearch(e.currentTarget.value)}
        ></Input>
        <Button text="search" />
      </Form>

      <GridStyled gap="20px">{renderSearchResults(searchResults)}</GridStyled>
      <GridStyled gap="20px">{renderContactRequests()}</GridStyled>
    </Main>
  )
  function renderSearchResults(searchResults) {
    if (searchInfo) {
      const searchResult = searchResults.map(userFound => {
        return (
          <User
            key={userFound.id}
            display_name={userFound.display_name}
            isAddButtonActive={userFound.isAddButtonActive}
            isRetractButtonActive={userFound.isRetractButtonActive}
            contactInfo={userFound.contactInfo}
            onClick={getCreateOrRetractContactRequest(
              userFound,
              userFound.isAddButtonActive
            )}
          />
        )
      })
      const header =
        searchResult.length === 1
          ? '1 user found'
          : searchResult.length + ' users found'
      return (
        <>
          <SectionHeaderStyled>{header}</SectionHeaderStyled>
          {searchResult}
        </>
      )
    }
  }

  function renderContactRequests() {
    if (contactRequests.length > 0) {
      const requests = contactRequests.map(request => {
        return (
          <ContactRequest
            key={request.source}
            display_name={request.display_name}
            onAccept={getAcceptOrDenyContactRequest(request)}
            onDeny={getAcceptOrDenyContactRequest(request, false)}
          />
        )
      })
      const header =
        contactRequests.length === 1
          ? '1 contact request'
          : contactRequests.length + ' contact requests'
      return (
        <>
          <SectionHeaderStyled>{header}</SectionHeaderStyled>
          {requests}
        </>
      )
    }
  }
  function searchUser() {
    const url = '/user/get_user'
    const body = { query_string: search }
    postRequest(body, url)
      .then(res => {
        if (res.success) {
          setSearchResults(
            res.items.map(foundUser => {
              const {
                contactInfo,
                isAddButtonActive,
                isRetractButtonActive
              } = getContactInfo(foundUser)
              return {
                ...foundUser,
                contactInfo,
                isAddButtonActive,
                isRetractButtonActive
              }
            })
          )
          if (res.items.length === 0) {
            setSearchInfo('no User found')
          } else {
            setSearchInfo(res.items.length + ' user found')
          }
        } else {
          setSearchResults([])
          setSearchInfo('no User found hits')
        }
      })
      .catch(err => console.log(err))
  }

  function getContactRequests() {
    postRequest({}, '/user/get_requests')
      .then(res => {
        if (res.success) {
          setContactRequests(res.items)
        }
      })
      .catch(err => console.log(err))
  }
  function getCreateOrRetractContactRequest(user, create = true) {
    const url = create ? '/user/create_contact' : '/user/retract_contact'
    const newContactInfo = create ? 'request sent' : 'request retracted'
    return () => {
      postRequest({ target: user.id }, url)
        .then(res => {
          if (res.success) {
            setSearchResults(
              findReplace(searchResults, user, {
                ...user,
                contactInfo: newContactInfo,
                isAddButtonActive: !create,
                isRetractButtonActive: create
              })
            )
          }
        })
        .catch(err => err)
    }
  }
  function getAcceptOrDenyContactRequest(request, accept = true) {
    const url = accept ? '/user/accept_request' : '/user/deny_request'
    const body = { source: request.source }
    return () => {
      postRequest(body, url)
        .then(res => {
          if (res.success) {
            setContactRequests(findRemove(contactRequests, request))
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
        })
        .catch(err => err)
    }
  }
  function getContactInfo(user) {
    let contactInfo = '',
      isAddButtonActive = false,
      isRetractButtonActive = false
    if (user.status != null && user.status === 0) {
      if (user.target === user.id) {
        contactInfo = 'contact already requestet'
        isRetractButtonActive = true
        isAddButtonActive = false
      } else if (user.source === user.id) {
        contactInfo = 'you should have a contact request'
        isAddButtonActive = false
      } else {
        contactInfo = ''
        isAddButtonActive = true
      }
    } else if (user.status && user.status === 10) {
      if (user.target === user.id) {
        contactInfo = 'contact already requestet'
        isAddButtonActive = false
      } else if (user.source === user.id) {
        contactInfo = 'you denied the request'
        isAddButtonActive = false
      } else {
        contactInfo = ''
        isAddButtonActive = true
      }
    } else if (user.status != null && user.status === 20) {
      contactInfo = 'already in your contacts'
      isAddButtonActive = false
    } else {
      contactInfo = ''
      isAddButtonActive = true
    }
    return { contactInfo, isAddButtonActive, isRetractButtonActive }
  }
}

const SectionHeaderStyled = styled.h2`
  padding-top: 30px;
  text-align: center;
`
