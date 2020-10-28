import React, { useEffect } from 'react'
import { Router } from '@reach/router'
import Layout from '../components/Layout'
import { VideoDisplay } from '../components/VideoDisplay'
import { navigate } from 'gatsby'

const BounceToHome = () => {
  useEffect(() => {
    navigate('/', { replace: true })
  }, [])

  return null
}

const Room = () => {
  return (
    <Layout>
      <Router>
        <VideoDisplay path={"/room/:roomId"} />
        <BounceToHome default/>
      </Router>
    </Layout>
  )
}

export default Room