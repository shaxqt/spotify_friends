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
        <Input label="search" value={search} onChange={handleOnChange}></Input>
        <Button text="search" />
      </Form>
      {searchInfo && <small>{searchInfo}</small>}

      <GridStyled gap="15px">
        {searchResults.length > 0 && renderSearchResults(searchResults)}
      </GridStyled>
    </>
  )
  function sendContactRequest(user) {
    const url = 'http://localhost:3333/user/create_contact'
    const body = { target: user.id }
    postRequest(body, url)
      .then(res => {
        if (res.success) {
          //update Search-Result to show that request was created
          const index = searchResults.indexOf(user)
          const newResult = [
            ...searchResults.slice(0, index),
            { ...user, contactInfo: 'request send', isButtonActive: false },
            ...searchResults.slice(index + 1)
          ]
          setSearchResults(newResult)
        }
      })
      .catch(err => err)
  }
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
              const { contactInfo, isButtonActive } = getContactInfo(foundUser)
              return { ...foundUser, contactInfo, isButtonActive }
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
      isButtonActive = false
    if (user.status != null && user.status === 0) {
      if (user.target === user.id) {
        contactInfo = 'contact already requestet'
        isButtonActive = false
      } else if (user.source === user.id) {
        contactInfo = 'you should have a contact request from this user'
        isButtonActive = false
      } else {
        contactInfo = ''
        isButtonActive = true
      }
    } else if (user.status && user.status === 10) {
      if (user.target === user.id) {
        contactInfo = 'contact already requestet'
        isButtonActive = false
      } else if (user.source === user.id) {
        contactInfo = 'you denied this a request from this contact'
        isButtonActive = false
      } else {
        contactInfo = ''
        isButtonActive = true
      }
    } else if (user.status != null && user.status === 20) {
      contactInfo = 'already in your contacts'
      isButtonActive = false
    } else {
      contactInfo = ''
      isButtonActive = true
    }
    return { contactInfo, isButtonActive }
  }
  function renderSearchResults(searchResults) {
    return searchResults.map(userFound => {
      return (
        <User
          key={userFound.id}
          user={userFound}
          isButtonActive={userFound.isButtonActive}
          contactInfo={userFound.contactInfo}
          onClick={() => sendContactRequest(userFound)}
        />
      )
    })
  }
}
