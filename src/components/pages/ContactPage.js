import React, { useState, useEffect } from 'react'
import Input from '../form/Input'
import Button from '../form/Button'
import Form from '../form/Form'
import User from '../common/User'
import GridStyled from '../utils/GridStyled'
import { postRequest } from '../../api/fetch'

export default function ContactPage(props) {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchInfo, setSearchInfo] = useState('')

  return (
    <>
      <Form paddingTop="200px" onSubmit={searchUser}>
        <Input
          placeholder="search"
          value={search}
          inputIcon="fa fa-search"
          onChange={handleOnChange}
        ></Input>
        <Button text="search" />
      </Form>
      {searchInfo && <small>{searchInfo}</small>}

      <GridStyled gap="15px">
        {searchResults.length > 0 && renderSearchResults(searchResults)}
      </GridStyled>
    </>
  )

  function handleOnChange(event) {
    setSearch(event.currentTarget.value)
  }
  function searchUser() {
    const url = 'http://localhost:3333/user/get_user'
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
        contactInfo = 'you should have a contact request from this user'
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
        contactInfo = 'you denied this a request from this contact'
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
  function renderSearchResults(searchResults) {
    return searchResults.map(userFound => {
      const onUserInteract = getUserInteract(userFound)
      return (
        <User
          key={userFound.id}
          user={userFound}
          isAddButtonActive={userFound.isAddButtonActive}
          isRetractButtonActive={userFound.isRetractButtonActive}
          contactInfo={userFound.contactInfo}
          onClick={onUserInteract}
        />
      )
    })
  }
  function getUserInteract(user) {
    if (user.isAddButtonActive) {
      return () =>
        postContactRequest('http://localhost:3333/user/create_contact', user, {
          contactInfo: 'request sent',
          isAddButtonActive: false,
          isRetractButtonActive: true
        })
    } else if (user.isRetractButtonActive) {
      return () =>
        postContactRequest('http://localhost:3333/user/retract_contact', user, {
          contactInfo: 'request retract',
          isAddButtonActive: true,
          isRetractButtonActive: false
        })
    }
  }
  function postContactRequest(url, user, newValsOnSuccess) {
    const body = { target: user.id }
    postRequest(body, url)
      .then(res => {
        if (res.success) {
          const index = searchResults.indexOf(user)
          const newResult = [
            ...searchResults.slice(0, index),
            { ...user, ...newValsOnSuccess },
            ...searchResults.slice(index + 1)
          ]
          setSearchResults(newResult)
        }
      })
      .catch(err => err)
  }
}
