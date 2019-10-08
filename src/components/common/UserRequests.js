import React from 'react'
import SectionHeaderStyled from '../utils/SectionHeaderStyled'
import ContactRequest from '../common/ContactRequest'
import { acceptOrDenyContactRequest } from '../../api/api'
import GridStyled from '../utils/GridStyled'

export default ({ contactRequests, onHandleContactRequest }) => {
  return (
    <GridStyled gap="20px">
      {contactRequests.length > 0 && (
        <SectionHeaderStyled>{'Contact requests'}</SectionHeaderStyled>
      )}
      {contactRequests.length > 0 &&
        contactRequests.map(request => (
          <ContactRequest
            key={request.source}
            display_name={request.display_name}
            onAccept={handleRequestInteract(request)}
            onDeny={handleRequestInteract(request, false)}
          />
        ))}
    </GridStyled>
  )
  async function handleRequestInteract(request, accept = true) {
    try {
      acceptOrDenyContactRequest(request, accept)
      onHandleContactRequest(request)
    } catch (err) {
      console.log(err)
    }
  }
}
