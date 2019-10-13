import React from 'react'
import SectionHeaderStyled from '../utils/SectionHeaderStyled'
import ContactRequest from './ContactRequest'
import { acceptOrDenyContactRequest } from '../../api/api'
import GridStyled from '../utils/GridStyled'

export default function ContactRequestList({
  contactRequests,
  onHandleContactRequest
}) {
  const handleRequestInteract = async (request, accept = true) => {
    try {
      await acceptOrDenyContactRequest(request, accept)
      onHandleContactRequest(request, accept)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <GridStyled gap="20px">
      {contactRequests.length > 0 && (
        <SectionHeaderStyled>{'Contact requests'}</SectionHeaderStyled>
      )}
      {contactRequests.length > 0 &&
        contactRequests.map(request => (
          <ContactRequest
            key={request.source}
            image={getImage(request)}
            display_name={request.display_name}
            onAccept={_ => handleRequestInteract(request)}
            onDeny={_ => handleRequestInteract(request, false)}
          />
        ))}
    </GridStyled>
  )
}

function getImage(request) {
  if (Array.isArray(request.images) && request.images.length > 0) {
    return request.images[0].url
  }
}
