import { AppBar, Toolbar, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import FundraiserCard from './FundraiserCard'
const Home = ({ fundraisers, web3, accounts }) => {
  useEffect(() => {}, [])

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </Typography>
          <Link className="nav-link" to="/new">
            New Fundraiser
          </Link>
        </Toolbar>
      </AppBar>
      <Outlet />
      <div>
        {Array.isArray(fundraisers) &&
          fundraisers.length > 0 &&
          fundraisers.map((v) => (
            <FundraiserCard
              web3={web3}
              fundraiser={v}
              key={v}
              accounts={accounts}
            />
          ))}
      </div>
    </div>
  )
}
export default Home
