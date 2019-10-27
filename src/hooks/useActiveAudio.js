import { useState, useCallback } from 'react'
export default function useActiveAudio() {
  const [activeAudio, setActiveAudio] = useState({
    audio: null,
    preview_url: '',
    isPlaying: false
  })

  const togglePreview = useCallback(preview_url => {
    if (preview_url != null && preview_url !== '') {
      if (activeAudio.preview_url === preview_url) {
        if (activeAudio.isPlaying) {
          activeAudio.audio.pause()
          setActiveAudio({ ...activeAudio, isPlaying: false })
        } else {
          activeAudio.audio.play()
          setActiveAudio({ ...activeAudio, isPlaying: true })
        }
      } else {
        if (activeAudio.audio) {
          activeAudio.audio.pause()
        }
        let audio = new Audio(preview_url)
        audio.play()
        setActiveAudio({ audio, isPlaying: true, preview_url })
      }
    }
  })
  return [activeAudio, togglePreview]
}
