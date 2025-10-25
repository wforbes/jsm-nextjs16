import React from 'react'

const UsersLayout = ({ children } : { children: React.ReactNode }) => {
  return (
    <div>
        <h2>Dashboard Navbar</h2>
        {children}
    </div>
  )
}

export default UsersLayout