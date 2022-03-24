import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import getWeb3 from '../getWeb3'
import FundraiserFactory from '../contracts/FundraiserFactory.json'

const NewFundraiser = ({ contract, accounts }) => {
  useEffect(() => {
    // async function init() {
    //   try {
    //     const web3 = await getWeb3()
    //     const networkId = await web3.eth.net.getId()
    //     const deployedNetwork = FundraiserFactory.networks[networkId]
    //     const accounts = await web3.eth.getAccounts()
    //     const instance = await new web3.eth.Contract(
    //       FundraiserFactory.abi,
    //       deployedNetwork && deployedNetwork.address
    //     )
    //     setAccounts(accounts)
    //     setContract(instance)
    //     const funds = await instance.methods.fundraisers(10, 0).call()
    //     console.log('funds', funds)
    //     setFunds(funds)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // init()
  }, [])

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
  }))

  const classes = useStyles()

  const [name, setFundraiserName] = useState(null)
  const [website, setFundraiserWebsite] = useState(null)
  const [description, setFundraiserDescription] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [beneficiary, setBeneficiary] = useState(null)

  const handleSubmit = async () => {
    const res = await contract.methods
      .createFundraiser(name, website, imageUrl, description, beneficiary)
      .send({ from: accounts[0] })

    console.log(res)
  }
  return (
    <div>
      {/* <h2>test</h2> */}
      <label>Name</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Name"
        margin="normal"
        onChange={(e) => setFundraiserName(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      <label>Website</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Website"
        margin="normal"
        onChange={(e) => setFundraiserWebsite(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      <label>Description</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Description"
        margin="normal"
        onChange={(e) => setFundraiserDescription(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      <label>Image</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Image"
        margin="normal"
        onChange={(e) => setImageUrl(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      <label>Beneficiary</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Fundraiser Ethereum Address"
        margin="normal"
        onChange={(e) => setBeneficiary(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        className={classes.button}
      >
        Submit
      </Button>
    </div>
  )
}
export default NewFundraiser
