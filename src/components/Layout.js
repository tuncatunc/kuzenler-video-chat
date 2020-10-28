import React from 'react'
import { Link } from 'gatsby'

import './Layout.css'

const Layout = ({ children }) => (
  <>
    <header>
      <Link to="/">Video Chat App</Link>
    </header>
    <main>
      {children}
    </main>
  </>
)

export default Layout
