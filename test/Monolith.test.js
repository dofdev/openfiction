const Monolith = artifacts.require('./contracts/Monolith.sol')

contract('Monolith', (accounts) => {
  before(async () => {
    this.monolith = await Monolith.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.monolith.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('reads fiction', async () => {
    // const publishCount = await this.monolith.publishCount()
    const fiction = await this.monolith.fictions(1)
    assert.equal(fiction.content, 'for ray')
    // assert.equal(fiction.completed, false)
    // assert.equal(publishCount.toNumber(), 1)
  })

  // it('publish fictions', async () => {
  //   const result = await this.monolith.publish('A new fiction')
  //   const publishCount = await this.monolith.publishCount()
  //   assert.equal(publishCount, 2)
  //   const event = result.logs[0].args
  //   assert.equal(event.id.toNumber(), 2)
  //   assert.equal(event.content, 'A new fiction')
  //   assert.equal(event.completed, false)
  // })
})