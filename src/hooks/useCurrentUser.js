import { getCurrentUser, updateUserSettings } from '../api/api'
import { useState, useEffect } from 'react'

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(_ => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(err => err)
      .finally(() => setIsLoading(false))
  }, [])

  const updateDisplayName = async display_name => {
    try {
      if (display_name !== currentUser.display_name) {
        const res = await updateUserSettings({ display_name })
        if (res.success) {
          setCurrentUser(res.item)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const updateUserImagePublic = async isUserImagePublic => {
    try {
      if (isUserImagePublic !== currentUser.isUserImagePublic) {
        const res = await updateUserSettings({ isUserImagePublic })
        if (res.success) {
          setCurrentUser(res.item)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  return [currentUser, updateDisplayName, updateUserImagePublic, isLoading]
}
