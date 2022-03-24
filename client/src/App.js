import React, { useState, useEffect } from 'react'
import { Link, Outlet, Routes, Route } from 'react-router-dom'

import FactoryContract from './contracts/FundraiserFactory.json'
import getWeb3 from './getWeb3'
import './App.css'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Home from './components/Home'
import NewFundraiser from './components/NewFundraiser'

const App = () => {
  const [contract, setContract] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [fundraisers, setFundraisers] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3()
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = FactoryContract.networks[networkId]
        const instance = new web3.eth.Contract(
          FactoryContract.abi,
          deployedNetwork && deployedNetwork.address
        )

        setContract(instance)
        setAccounts(accounts)
        setWeb3(web3)
        const fundraisers = await instance.methods.fundraisers(10, 0).call()
        console.log(fundraisers)
        setFundraisers(fundraisers)
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract.
  Check console for details.`
        )
        console.error(error)
      }
    }
    init()
  }, [])

  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  })
  const classes = useStyles()

  console.log('fundraisers', fundraisers)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home fundraisers={fundraisers} web3={web3} accounts={accounts} />
        }
      >
        <Route
          path="/new"
          element={<NewFundraiser contract={contract} accounts={accounts} />}
        />
      </Route>
    </Routes>
  )
}
export default App
