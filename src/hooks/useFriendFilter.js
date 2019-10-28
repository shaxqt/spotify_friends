import { useCallback } from 'react'

export default function useFriendFilter(tops, friendIdFilter) {
  const filter = useCallback(() => {
    let filteredTops = []
    if (
      Array.isArray(tops) &&
      tops.length > 0 &&
      Array.isArray(friendIdFilter) &&
      friendIdFilter.length > 0
    ) {
      for (const song of tops) {
        for (const friend of song.friends) {
          if (friendIdFilter.includes(friend.id)) {
            filteredTops = [...filteredTops, song]
            break
          }
        }
      }
    } else {
      filteredTops = tops
    }
    return filteredTops
  }, [tops, friendIdFilter])

  return filter()
}
