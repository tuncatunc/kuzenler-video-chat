import React, { createContext, useContext, useReducer, useRef } from 'react'
import axios from 'axios'
import { connect, createLocalVideoTrack } from 'twilio-video'

const TWILIO_TOKEN_URL = 'https://blue-ant-2098.twil.io/create-room-token'
const DEFAULT_STATE = {
  identity: false,
  room: false,
  token: false,
  activeRoom: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'join':
      return { ...state, token: action.token, identity: action.identity, room: action.room }
    case 'set-active-room':
      return { ...state, activeRoom: action.activeRoom }
    case 'disconnect':
      state.activeRoom && state.activeRoom.disconnect();
      return DEFAULT_STATE;
    default:
      return DEFAULT_STATE;
  }
}

const TwilioVideoContext = createContext()

const TvilioVideoProvider = ({ children }) => (
  <TwilioVideoContext.Provider value={useReducer(reducer, DEFAULT_STATE)}>
    {children}
  </TwilioVideoContext.Provider>
)


export const wrapRootElement = ({ element }) => (
  <TvilioVideoProvider>
    {element}
  </TvilioVideoProvider>
)

const handleRemoteParticipant = container => participant => {
  const id = participant.sid

  const addTrack = track => {
    const container = document.getElementById(id)

    // Create HTML element to show the track
    const media = track.attach()

    container.appendChild(media)
  }

  const el = document.createElement('div')
  el.id = id
  el.className = 'remote-participant'

  const nameEl = document.createElement('h4')
  nameEl.innerText = participant.identity
  el.appendChild(nameEl)

  // Attach new element to DOM
  container.appendChild(el)

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      addTrack(publication.track)
    }
  })

  // If new tracks get added later, add those, too.
  participant.on('trackSubscribed', addTrack);

  // When tracks are no longer available, remove the elements displaying them.
  participant.on('trackUnsubscribed', track => {
    // Get a list of elements from detach and remove them from the DOM.
    track.detach().forEach(el => el.remove());
    const container = document.getElementById(id);
    if (container) container.remove();
  });
}
const useTwilioVideo = () => {
  const [state, dispatch] = useContext(TwilioVideoContext);
  const videoRef = useRef()
  const { room, token } = state

  const getRoomToken = async ({ identity, room }) => {
    const result = await axios.post(TWILIO_TOKEN_URL, { identity, room })

    dispatch({ type: 'join', token: result.data, identity, room })
  }

  const connectToRoom = async () => {
    if (!token) {
      return
    }

    const activeRoom = await connect(
      token,
      {
        name: room,
        audio: true,
        video: { width: 640 },
        logLevel: 'info'
      }
    ).catch(error => {
      console.error(`Error connecting to TWILIO ${error.message}`)
    })
    console.log(`Connected to Room ${room}`);

    const localTrack = await createLocalVideoTrack().catch(error => {
      console.error(`Unable to create local track ${error.message}`)
    })
    console.log(`Created local Track`);

    // If local element ref is not attached to DOM
    // if (!videoRef.current.hasChildNodes()) {
    const localEl = localTrack.attach()
    localEl.className = 'local-video'

    videoRef.current.appendChild(localEl)
    console.log(`Track ${localTrack} is attached to videoRef`);
    // }

    // Currying 🍛 is delicious
    const handleParticipant = handleRemoteParticipant(videoRef.current)

    // Handle participants who already connected to the room
    activeRoom.participants.forEach(handleParticipant)

    // Handler participants after I connected to room
    activeRoom.on('participantConnected', handleParticipant)

    dispatch({ type: 'set-active-room', activeRoom })

  }

  const startVideo = () => connectToRoom();

  const leaveRoom = () => dispatch({ type: 'disconnect' })

  return { state, getRoomToken, startVideo, videoRef, leaveRoom }
}

export default useTwilioVideo;
