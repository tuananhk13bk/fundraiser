const FundraiserContract = artifacts.require('Fundraiser')

contract('Fundraiser', (accounts) => {
  let fundraiser
  const name = 'Beneficiary Name'
  const url = 'beneficiaryname.org'
  const imageUrl = 'https://placekitten.com/600/350'
  const description = 'Beneficiary description'
  const beneficiary = accounts[1]
  const owner = accounts[0]

  beforeEach(async () => {
    fundraiser = await FundraiserContract.new(
      name,
      url,
      imageUrl,
      description,
      beneficiary,
      owner
    )
  })

  describe('initialization', () => {
    it('gets the beneficiary name', async () => {
      const actual = await fundraiser.name()
      assert.equal(actual, name, 'names should match')
    })

    it('gets the beneficiary url', async () => {
      const actual = await fundraiser.url()
      assert.equal(actual, url, 'url should match')
    })
    it('gets the beneficiary image url', async () => {
      const actual = await fundraiser.imageUrl()
      assert.equal(actual, imageUrl, 'imageUrl should match')
    })
    it('gets the beneficiary description', async () => {
      const actual = await fundraiser.description()
      assert.equal(actual, description, 'description should match')
    })

    it('gets the beneficiary', async () => {
      const actual = await fundraiser.beneficiary()
      assert.equal(actual, beneficiary, 'beneficiary addresses should match')
    })

    it('gets the owner', async () => {
      const actual = await fundraiser.owner()
      assert.equal(actual, owner, 'owners should match')
    })
  })

  describe('setBeneficiary', () => {
    const newBeneficiary = accounts[2]

    it('updated beneficiary when called by owner account', async () => {
      await fundraiser.setBeneficiary(newBeneficiary, { from: owner })
      const actualBeneficiary = await fundraiser.beneficiary()
      assert.equal(
        actualBeneficiary,
        newBeneficiary,
        'beneficiaries should match'
      )
    })

    it('throws an error when called from a non-owner account', async () => {
      try {
        await fundraiser.setBeneficiary(newBeneficiary, { from: accounts[3] })
        assert.fail('only the owner is able to do this action')
      } catch (error) {
        const expectedError = 'Ownable: caller is not the owner'
        const actualError = error.reason
        assert.equal(actualError, expectedError, 'should not be permitted')
      }
    })
  })

  describe('making donations', () => {
    const value = web3.utils.toWei('0.0289')
    const donor = accounts[2]

    it('increases myDonationsCount', async () => {
      const currentDonationsCount = await fundraiser.myDonationsCount({
        from: donor,
      })

      await fundraiser.donate({ from: donor, value })

      const newDonationsCount = await fundraiser.myDonationsCount({
        from: donor,
      })

      assert.equal(
        1,
        newDonationsCount - currentDonationsCount,
        'myDonationsCount should increase by 1'
      )
    })
    it('includes donation in myDonation', async () => {
      await fundraiser.donate({ from: donor, value })
      const { values, dates } = await fundraiser.myDonation({ from: donor })

      assert.equal(value, values[0], 'values should match')
      assert(dates[0], 'date should be present')
    })

    it('increases the totalDonations amount', async () => {
      const currentTotalDonations = await fundraiser.totalDonations()
      await fundraiser.donate({ from: donor, value })
      const newTotalDonations = await fundraiser.totalDonations()

      const diff = newTotalDonations - currentTotalDonations
      assert.equal(diff, value, 'difference should match donation value')
    })

    it('increases donationsCount', async () => {
      const currentDonationsCount = await fundraiser.donationsCount()
      await fundraiser.donate({ from: donor, value })
      const newDonationsCount = await fundraiser.donationsCount()

      assert.equal(
        1,
        newDonationsCount - currentDonationsCount,
        'donationsCount should increase by 1'
      )
    })

    it('emits the DonationReceived event', async () => {
      const tx = await fundraiser.donate({ from: donor, value })
      const expectedEvent = 'DonationReceived'
      const actualEvent = tx.logs[0].event

      assert(expectedEvent, actualEvent, 'events should match')
    })
  })

  describe('withdrawing funds', () => {
    beforeEach(async () => {
      await fundraiser.donate({
        from: accounts[2],
        value: web3.utils.toWei('0.3'),
      })
    })

    describe('access controls', () => {})
    it('throws an error when called from a non-owner account', async () => {
      try {
        await fundraiser.withdraw({ from: accounts[3] })
        assert.fail('withdraw was not restricted to owners')
      } catch (error) {
        const expectedError = 'Ownable: caller is not the owner'
        const actualError = error.reason
        assert.equal(expectedError, actualError, 'should not be permitted')
      }
    })

    it('permits the owner to call the function', async () => {
      try {
        await fundraiser.withdraw({ from: owner })
        assert(true, 'no errors were thrown')
      } catch (error) {
        assert.fail('should not have thrown an error')
      }
    })

    it('transfers balance to beneficiary', async () => {
      const currentContractBalance = await web3.eth.getBalance(
        fundraiser.address
      )
      const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary)

      await fundraiser.withdraw({ from: owner })

      const newContractBalance = await web3.eth.getBalance(fundraiser.address)
      const newBeneficiaryBalance = await web3.eth.getBalance(beneficiary)
      const BeneficiaryDifference =
        newBeneficiaryBalance - currentBeneficiaryBalance

      assert.equal(newContractBalance, 0, 'contract should have 0 balance')
      assert.equal(
        BeneficiaryDifference,
        currentContractBalance,
        'beneficiary should receive all the funds'
      )
    })

    it('emits WithDraw event', async () => {
      const tx = await fundraiser.withdraw({ from: owner })
      const expectedEvent = 'Withdraw'
      const actualEvent = tx.logs[0].event

      assert.equal(actualEvent, expectedEvent, 'events should match')
    })
  })

  describe('fallback function', () => {
    const value = web3.utils.toWei('0.0289')

    it('increase the totalDonations amount', async () => {
      const currentTotalDonations = await fundraiser.totalDonations()
      await web3.eth.sendTransaction({
        to: fundraiser.address,
        from: accounts[9],
        value,
      })
      const newTotalDonations = await fundraiser.totalDonations()
      const diff = newTotalDonations - currentTotalDonations

      assert.equal(diff, value, 'difference should match the donation value')
    })

    it('increase the donationsCount', async () => {
      const currentDonationsCount = await fundraiser.donationsCount()
      await web3.eth.sendTransaction({
        to: fundraiser.address,
        from: accounts[9],
        value,
      })
      const newDonationsCount = await fundraiser.donationsCount()

      assert.equal(
        1,
        newDonationsCount - currentDonationsCount,
        'donationsCount should increase by 1'
      )
    })
  })
})
