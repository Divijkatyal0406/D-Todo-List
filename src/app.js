App = {
  loading: false,
  contracts: {},
  // current:new Date(),
  // dates:[],

  load: async () => {
    // Load app...
    // console.log("app loading...")
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
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = (await web3.eth.getAccounts())[0];
  },

  loadContract: async () => {
    const todoList = await $.getJSON('TodoList.json');
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider)

    App.todoList = await App.contracts.TodoList.deployed();
    
  },
  render: async () => {
    // $('#account').html(App.account)
    if (App.loading) {
      return
    }
    App.setLoading(true)
    $('#account').html(App.account)
    await App.renderTasks()
    App.setLoading(false)
  },

  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')
    for (var i = taskCount; i >=1; i--) {
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]
      // const priority=task[3]


      

      // const tt=$('.todotime').val()

      // var utcDate =$('#newTask').val();  // ISO-8601 formatted date returned from server
      // utcDate+=".000Z";
      // var today = new Date(utcDate);
      // console.log(App.current)

      var today = new Date();
      console.log(today.toString());
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;
      // Create the html for the task
      
      
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('.time').html(today)
      $newTaskTemplate.find('input')
      .prop('name', taskId)
      .prop('checked', taskCompleted)
      .on('click', App.toggleCompleted)
  
      // priority++;
      // Put the task in the correct list
      if (taskCompleted) {
        // var uu=document.getElementById("completedTaskList");
        // uu.append($newTaskTemplate)
        // uu.setAttribute("class", "list-group-item list-group-item-action")

        $('#completedTaskList').append($newTaskTemplate)
        // $newTaskTemplate.setAttribute("class","list-group-item active")
        console.log($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    const priority=$('#priority_num').val()
    
    // const time = $('#todotime').val()

    var utcDate =$('#newTask').val();  // ISO-8601 formatted date returned from server
    utcDate+=".000Z";
    var localDate = new Date(utcDate);
    // App.dates.push(utcDate)

    console.log(localDate)
    // App.current=localDate
    // console.log(App.current)
    // https://stackoverflow.com/questions/67273763/blockchain-tutorial-error-the-send-transactions-from-field-must-be-defined
    // await App.todoList.createTask(content)
    await App.todoList.createTask(content,{from: App.account})
    // refresh the page to refetch the tasks
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId, {from: App.account})
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})