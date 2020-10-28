import React from 'react'
import Layout from '../components/Layout'
import { Join } from '../components/Join'

export default ({ location }) => (
  <Layout>
    <Join location={location} />
  </Layout>
)