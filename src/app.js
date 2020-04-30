App = {
  loading: false,
  contracts: {},
  collection: [],

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
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

    $('#message').html("Loading...");

    // await App.read()

    // Update loading state
    $('#message').html(App.account);
  },

  // renderTasks: async () => {
  //   // Load the total task count from the blockchain
  //   const publishCount = await App.monolith.publishCount()
  //   const $taskTemplate = $('.taskTemplate')

  //   // Render out each task with a new task template
  //   for (var i = 1; i <= publishCount; i++) {
  //     // Fetch the task data from the blockchain
  //     const task = await App.monolith.fictions(i)
  //     const taskId = task[0].toNumber()
  //     const taskContent = task[1]
  //     const taskCompleted = task[2]

  //     // Create the html for the task
  //     const $newTaskTemplate = $taskTemplate.clone()
  //     $newTaskTemplate.find('.content').html(taskContent)
  //     $newTaskTemplate.find('input')
  //       .prop('name', taskId)
  //       .prop('checked', taskCompleted)
  //     // .on('click', App.toggleCompleted)

  //     // Put the task in the correct list
  //     if (taskCompleted) {
  //       $('#completedTaskList').append($newTaskTemplate)
  //     } else {
  //       $('#taskList').append($newTaskTemplate)
  //     }
  
  //     // Show the task
  //     $newTaskTemplate.show()
  //   }
  // },
  
  publish: async () => {
    $('#message').html("Publishing to BlockChain");
    const id = $('#id').val()
    const meta = $('#meta').val()
    const content = $('#content').val()
    await App.monolith.publish(id, App.account, meta, content)
    // App.loading = true
    // window.location.reload()
    $('#message').html("Published");
  },

  read: async () => {
    const id = $('#id').val()
    const fiction = await App.monolith.fictions(id)
    const from = fiction[0].toNumber()
    const meta = fiction[2]
    const content = fiction[3]
    $('#from').html(fiction[0].toNumber())
    $('#meta').val(fiction[2])
    $('#content').val(fiction[3])
    
    const tokens = await App.monolith.tokens(fiction[1])
    console.log(tokens.toNumber())
  },

  from: async () => {
    const from = $('#from').html()
    $('#id').val(from)
    await App.read()
  },


  // search: async () => {
  //   const publishCount = await App.monolith.publishCount()
  //   const fiction = await App.monolith.fictions(publishCount)
  //   // search over the the x most recent
  //   // compare
  //   const search = $('#search').val()
  //   if (search === fiction[1]) {
  //     console.log("True")
  //   }
  //   else{
  //     console.log("False")
  //   }
  // },

  // robust and simple system for now
  // just worry about the meta for now
  // just worry about the full list no filter for now
  // filtering will come with scale

  filter(fiction) {
    App.collection.push(fiction)

    $('#otherTab').html(App.collection.length)
    
    $('#watcher').empty()
    const $template = $('#itemTemplate')
    for (var i = 0; i < App.collection.length; i++) {
      //  Create the html for the item
      const $temp = $template.clone()
      $temp.find('.id').html(App.collection[i].args.id.toNumber())
      $temp.find('.meta').html(App.collection[i].args.meta)

      // sets the value of the id
      $temp.data('id', App.collection[i].args.id)


      // $temp.on('click', App.open())
      // , App.read(), App.toggleSection())
      // set to the right things
      
      // Put the item in the correct list
      $('#watcher').append($temp)
      
      // Show the item
      $temp.show()
    }
  },

  open(element) {
    const id = $(element).data('id'); // retrieves the value of userid
    $('#id').val(id.toNumber())
    App.read()
    App.toggleSection()
  },

  toggleSection() {
    if ($("#watcher").css("display") === "none") {
      $("#watcher").show(100)
      $("#reader").hide(100)
    }
    else {
      $("#watcher").hide(100)
      $("#reader").show(100)
    }
  },
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})