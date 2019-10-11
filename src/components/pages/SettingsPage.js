import React, { useState } from 'react'
import Editable from '../form/Editable'
import Form from '../form/Form'
import Main from '../utils/Main'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Hans Peter')

  return (
    <Main>
      <Editable value={displayName} onSubmit={setDisplayName} />
    </Main>
  )
}
