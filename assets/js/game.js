App = {
    init: function() {
      App.initWeb3();
      App.nextQuote();
    },

    nextQuote: function() {
      $("#rightAnswer").fadeOut();
      $("#wrongAnswer").fadeOut();
      $.get('assets/quizz/data.json', function(data) {
        var speakersRow = $('#speakersRow');
        var speakerTemplate = $('#speakerTemplate');
        
        var min = 0;
        var max = data.quotes.length - 1;
        var quotesIndex = Math.floor(Math.random() * (max - min + 1)) + min;

        $('#quote').text(data.quotes[quotesIndex].title);
        App.currentQuoteId = data.quotes[quotesIndex].id;
        speakersRow.html('');
        for (i = 0; i < data.quotes[quotesIndex].proposals.length; i ++) {
          var speakerProposal = data.quotes[quotesIndex].proposals[i] - 1;
          speakerTemplate.find('.speakerName').text(data.speakers[speakerProposal].name);
          speakerTemplate.find('img').attr('src', 'images/speakers/'+data.speakers[speakerProposal].image);
          speakerTemplate.find('.btn-answer').attr('data-id', data.speakers[speakerProposal].id);
          speakersRow.append(speakerTemplate.html());
        }
        speakersRow.fadeIn('fast');
      });
    },

    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
  
        web3.version.getNetwork((err, netId) => {
          App.checkNetwork(netId);
        });

      } else {
        App.noMetamask();
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      return App.initContract();
    },
    initContract: function() {

      $.get('assets/contract/quizz.json', function(abi) {
        var MyContract = web3.eth.contract(abi);
        App.quizzContractInstance = MyContract.at(App.contractAddress()); 
        App.refreshPlayers();
      });

      return App.bindEvents();
    },

    bindEvents: function() {
      $(document).on('click', '.btn-answer', App.handleAnswer);
      $(document).on('click', '.btn-nextQuote', App.handleNextQuote);
    },

    handleNextQuote: function() {

      //$( "#speakersRow").hide();
      App.nextQuote();
     
    },

    handleAnswer: function() {
      event.preventDefault();
      var answerId = parseInt($(event.target).data('id'));

      App.startLoadingMode();
      // send a transaction to a function
      // todo with locked metamask
      console.log("currentQuoteId: "+App.currentQuoteId+ " answerId: "+answerId);
      App.quizzContractInstance.answer(App.currentQuoteId, answerId, function(error, result){
      //App.quizzContractInstance.answer(0, 1, function(error, result){
        if(!error){
            //console.log("call success"+answerId+" and "+result);
            App.showTransactionHash(result);
            App.checkAnswerStatus(result);
          }else{
            console.error(error);
            App.stopLoadingMode();
          }
      });
    },

    checkAnswerStatus: function(transactionHash){
      const event = App.quizzContractInstance.NewAnswer();
      event.watch(function(error, result) {
        if (error) {
          console.log('error', error);
        } else {
          console.log('result.transactionHash', result.transactionHash);
          if(result.transactionHash == transactionHash)
          {
            if(result.args['status'])
            {
              App.rightAnswerMode();
            }
            else
            {
              App.wrondAnswerMode();
            }
            event.stopWatching()
            App.stopLoadingMode();
            App.refreshPlayers();
          }
        }
      });
    },

    refreshPlayers: function(){
      console.log("initPlayers...");
      var playersRow = $('#playersRow');
      playersRow.html('');
      var newAnswerEvent = App.quizzContractInstance.NewPlayer({}, {fromBlock: 0, toBlock: 'latest'})
      newAnswerEvent.get((error, logs) => {
        App.players = [];
        logs.forEach(function(log) {
          console.log('playerAddress', log.args['playerAddress']);
          App.quizzContractInstance.ownerToPlayer(log.args['playerAddress'], function(error, result){
            if(!error){
              var player = {"name":result[0],"score":result[1], "address":log.args['playerAddress']};
              App.players.push(player);
              App.addPlayer(player);
            } else {
                console.error(error);
            }
          });
        }); 
      });
    },

    addPlayer:function(player){
        //todo list.sort((a, b) => a.indexFound - b.indexFound);
        var playersRow = $('#playersRow');
        var playerRow = '<tr id="playerTemplate">'+
        '<td class="ranking">todo</td>'+
        '<td id="name">'+player.address+' ('+player.name+')</td>'+
        '<td class="score">'+player.score+'</td>'+
        '</tr>';
        playersRow.append(playerRow);
    },
  
    newDonationSuccess: function(message) {
      $(".successText").html(message);
      App.stopLoadingMode()
      return App.readCampaignData();
    },
  
    startLoadingMode: function()
    {
      $("#loader").fadeIn();
      $("#loadingText").text("pending transaction, please wait...");
    },

    showTransactionHash: function(transactionHash)
    {
      var url = App.etherscanBaseUrl()+"/tx/"+transactionHash;
      $("#transactionText").fadeIn();
      $("#transactionText").html("Check your <a target='_blank' href="+url+">transaction</a> on etherscan");
    },
  
    stopLoadingMode: function()
    {
      $("#loader").fadeOut();
      $("#loadingText").fadeOut();
      $("#transactionText").fadeOut();
      //$("#loadingText").html("&nbsp");
      
    },
  
    rightAnswerMode: function()
    {
      $("#rightAnswer").fadeIn();
     
    },

    wrondAnswerMode: function()
    {
      $("#wrongAnswer").fadeIn();
    },
  
    successState: function()
    {
      $("#chart-area").hide();
      $("#btn-donate").prop("disabled",true);
      $(".successText").html("This campaign is successfully completed! Thank you all. If you are the beneficiary, <br/> use payoutToBeneficiary() function of the smartcontract to get 100% of the balance.");
    },
    
    //todo check network
    checkNetwork: function(actualNetwork)
    {
      var expectedNetwork = 3;
      var expectedNetworkName = "ropsten";
      var netWorkName = "unknown Network";
  
      switch (actualNetwork) {
        case "1":
          netWorkName = "mainnet";
          break
        case "2":
          netWorkName = "Morden";
          break
        case "3":
          netWorkName = "ropsten";
          break
        case "4":
          netWorkName = "Rinkeby";
          break
        case "42":
          netWorkName = "Kovan"
          break
      }
  
      if(expectedNetwork != actualNetwork)
      {
        $(".wrongNetwork").html("<strong>You are connected to "+netWorkName+". Go to "+expectedNetworkName+" network and reload this page please</strong>");
        $(".wrongNetwork").fadeIn();
        $(".wrongNetworkIcon").fadeIn();
      } 
    },
  
    noMetamask: function()
    {

    },
    
    failState: function(message)
    {
    },
  
    contractAddress: function() {
      return "0x7fda2461ff4163668bfdffe2b6b14e679affe946";
    },
    
    etherscanBaseUrl: function() {
      return "https://ropsten.etherscan.io";
    },
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  