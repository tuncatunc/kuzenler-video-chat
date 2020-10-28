import React, { useEffect } from 'react'
import useTwilioVideo from '../hooks/use-twilio-video'
import { navigate } from 'gatsby'

export const VideoDisplay = ({ roomId }) => {
  const { state, startVideo, videoRef, leaveRoom } = useTwilioVideo()

  useEffect(() => {
    if (!state.token) {
      navigate('/', { state: { room: roomId } })
    }

    if (!state.activeRoom) {
      startVideo();
      console.log(`Starting Video ${roomId}`)
    }

    window.addEventListener('beforeunload', leaveRoom)

    return () => {
      window.removeEventListener('beforeunload', leaveRoom)
    }
  }, [state, roomId, startVideo, leaveRoom])
  return (
    <>
      <h1>Hi {roomId}</h1>
      <button className="leave-room" onClick={leaveRoom}>Leave Room</button>
      <div className="chat" ref={videoRef}> </div>
    </>
  )
}
