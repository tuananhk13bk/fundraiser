import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FundraiserContract from '../contracts/Fundraiser.json'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FilledInput from '@material-ui/core/FilledInput'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import cc from 'cryptocompare'

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 450,
    height: 400,
  },
  media: {
    height: 140,
  },
  input: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    display: 'table-cell',
  },
  card: {
    maxWidth: 450,
    height: 400,
  },
  media: {
    height: 140,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: 'none',
    padding: 4,
  },
}))

const FundraiserCard = ({ web3, fundraiser, accounts }) => {
  const classes = useStyles()

  const [contract, setContract] = useState(null)
  const [fundName, setFundName] = useState(null)
  const [description, setDescription] = useState(null)
  const [totalDonations, setTotalDonations] = useState(null)
  const [donationCount, setDonationCount] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [url, setURL] = useState(null)
  const [donationAmount, setDonationAmount] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    // this will set our state to true and open the modal
  }
  const handleClose = () => {
    setOpen(false)
    // this will close the modal on click away and on button close
  }
  useEffect(() => {
    if (fundraiser) {
      init(fundraiser)
    }
    // we'll add in the Web3 call here
  }, [fundraiser])

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload()
  })

  async function init(fundraiser) {
    try {
      const instance = new web3.eth.Contract(FundraiserContract.abi, fundraiser)
      const name = await instance.methods.name().call()
      const description = await instance.methods.description().call()
      const totalDonations = await instance.methods.totalDonations().call()
      const imageUrl = await instance.methods.imageUrl().call()
      const url = await instance.methods.url().call()
      const isOwner = await instance.methods.owner().call()
      console.log(isOwner)

      if (isOwner === accounts[0]) {
        setIsOwner(true)
      }

      setContract(instance)
      setFundName(name)
      setDescription(description)
      setTotalDonations(totalDonations)
      setImageUrl(imageUrl)
      setURL(url)
    } catch (error) {}
  }

  const submitFunds = async () => {
    const donation = web3.utils.toWei(donationAmount)
    await contract.methods.donate().send({
      from: accounts[0],
      value: donation,
      gas: 650000,
    })
    setOpen(false)
  }

  const withdrawFunds = async () => {
    await contract.methods.withdraw().send({
      from: accounts[0],
    })

    alert('Fund withdrawn!')
  }

  return (
    <div className="fundraiser-card-content">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Donate to {fundName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <img src={imageUrl} width="200px" height="200px" />
            <p>{description}</p>
          </DialogContentText>
          <FormControl className={classes.formControl}>
            $
            <Input
              value={donationAmount}
              id="donation-input"
              placeholder="0.00"
              onChange={(e) => setDonationAmount(e.target.value)}
            />
          </FormControl>
        </DialogContent>
        <div style={{ display: 'flex' }}>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
          <DialogActions>
            <Button variant="contained" onClick={submitFunds} color="primary">
              Donate
            </Button>
          </DialogActions>
          {isOwner && (
            <DialogActions>
              <Button
                variant="contained"
                onClick={withdrawFunds}
                color="success"
              >
                Withdraw
              </Button>
            </DialogActions>
          )}
        </div>
      </Dialog>
      <Card className={classes.card} onClick={handleOpen}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title="Fundraiser Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {fundName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {`TOTAL DONATIONS: ${totalDonations}`}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={handleOpen}>
            View More
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
export default FundraiserCard
