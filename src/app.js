App = {
  loading: false,
  contracts: {},
  collection: [],
  newFiction: 0,

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */ })
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */ })
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]

    const bookmark = 0
    App.bookmark = bookmark
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const monolith = await $.getJSON('Monolith.json')
    App.contracts.Monolith = TruffleContract(monolith)
    App.contracts.Monolith.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.monolith = await App.contracts.Monolith.deployed()

    const publishEvent = App.monolith.FictionPublished()
    publishEvent.watch(function (error, result) {
      if (!error) {
        App.filter(result)
      }
    })
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    $('#message').html("Loading...")
    App.updateOtherTab(0)
    
    // Load random piece of fiction
    const pubCount = await App.monolith.publishCount()
    const randomID = Math.floor((Math.random() * pubCount.toNumber()) + 1)
    $('#id').val(randomID)
    await App.read()

    // Update loading state
    $('#message').html("Welcome to Open Fiction")
  },
  
  publish: async () => {
    $('#message').html("Publishing to BlockChain")
    const id = $('#id').val()
    const meta = $('#meta').val()
    const content = $('#content').val()
    await App.monolith.publish(id, meta, content)
    // App.loading = true
    // window.location.reload()
    $('#message').html("")
  },

  payback: async () => {
    $('#message').html("Paying it back")
    const id = $('#id').val()
    const value = $('#value').val()
    await App.monolith.payback(id, { from: web3.eth.coinbase, value: web3.toWei(value, 'ether') })
    $('#message').html("Payed back ^-^")
  },

  read: async () => {
    const id = $('#id').val()
    const fiction = await App.monolith.fictions(id)
    const fromID = fiction[0].toNumber()
    $('#from').data("id", fromID)
    $('#from').html("From: " + fromID)
    $('#meta').val(fiction[1])
    $('#content').val(fiction[2])
    
    // const tokens = await App.monolith.tokens(fiction[1])
    // console.log(tokens.toNumber())
  },

  from: async () => {
    const from = $('#from').data('id')
    $('#id').val(from)
    await App.read()
  },

  filter(fiction) {
    App.collection.push(fiction)

    App.updateOtherTab(1)
    
    $('#watcher').empty()
    const $template = $('#itemTemplate')
    for (var i = App.collection.length - 1; i >= 0; i--) {
      //  Create the html for the item
      const $temp = $template.clone()
      $temp.html(App.collection[i].args.id.toNumber() + " | " + App.collection[i].args.meta)

      // sets the value of the id
      $temp.data('id', App.collection[i].args.id)

      // Put the item in the correct list
      $('#watcher').append($temp)
      $temp.show()
    }
  },

  open(element) {
    const id = $(element).data('id');
    $('#id').val(id.toNumber())
    App.read()
    App.toggleSection()
  },

  toggleSection() {
    App.updateOtherTab(0)
    if ($("#watcher").css("display") === "none") {
      $("#watcher").show(100)
      // $("#reader").hide(100)
    }
    else {
      $("#watcher").hide(100)
      // $("#reader").show(100)
    }
  },

  updateOtherTab(value) {
    if (value > 0) {
      App.newFiction += value
      $('#otherTab').html(App.newFiction)
    }
    else {
      App.newFiction = 0
      $('#otherTab').html("")
    }
  },
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})