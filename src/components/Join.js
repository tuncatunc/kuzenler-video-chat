import React, { useState, useEffect } from 'react'
import useTwilioVideo from '../hooks/use-twilio-video'
import { navigate } from 'gatsby'

export const Join = ({ location }) => {
  const defaultRoom = (location && location.state && location.state.room) || ''
  const [identity, setIdentity] = useState('')
  const [room, setRoom] = useState(defaultRoom)
  const { state, getRoomToken } = useTwilioVideo()

  const handleSubmit = event => {
    event.preventDefault()

    getRoomToken({ type: 'join', identity, room })
  }

  useEffect(() => {
    console.log(state)
    if (state.token && state.room) {
      navigate(`/room/${state.room}`)
    }
  }, [state])

  return (
    <>
      <h1>Start or Join a Video Call</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <form className="start-form" onSubmit={handleSubmit}>
        <label htmlFor="identity">
          Display name
          <input
            type="text"
            name="identity"
            id="identity"
            value={identity}
            onChange={event => setIdentity(event.target.value)} />
        </label>
        <label htmlFor="room">
          Room
          <input
            type="text"
            name="room"
            id="room"
            value={room}
            onChange={event => setRoom(event.target.value)} />
        </label>
        <button type="submit">Join Video Chat</button>
      </form>
    </>
  )
}


export default Join;