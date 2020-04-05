//outside of errthang
    //create blank global vars
        //player (multiples if setting up for > 1 player)
        //dealer

//initGame()
    //create dealer class
    //create deck
    //shuffle deck
    //prompt buy in()
        //func below
    //prompt for bets()

//playerBuyIn()
    //create player class
    //prompt for name
    //prompt for buy in

//prompt for bets()
    //on 'all bets in button' click 
        //startGame()

//playerBuyIn()
    //create player class
    //prompt for name
    //prompt for buy in
    
//prompt for bets()
    //on 'all bets in button' click 
        //startGame()

//startGame()
    //deal first 2 cards
    //check top card bet
        //payout
    //check for player bj
    //if top card is ace
        //insurance()
//after player action --------->
    //payout()
    //clear board
    //prompt bets



    // <-------------notes--------------->

    // function startGame(){
//     //start game function
//     
//     
//     // check for player bj
//     bJCheck()
// }

//<------------------flow---------------->

//On load - 
// inital deal()
// player enters buyin 

// on mainbet button - 
// startGame()


//     bJChecker()
//         if (player bj) {
//             payout()
//             preDealer() - should only display 2nd card
//             preStart() - displays place bets - hides buy in box
//         }
//         if (dealer bj) {
//             display dealer bj
//             payout() -should take players bet
//             preStart() - displays place bets - hides buy in box
//         }
//     action---
//     bustChecker()-
//         if (bust) {
//             payout() - should take players bet
//         }
//         if (21) {
//             payout()
//             reset()
//             preDealer()
//         }
//         if (stand) {
//             preDealer() -  should start dealerAction()
//         }


//bust checker
// function bustChecker() {
//     //loop through each card and store in temp totals (values are nested)
//     var tempTotals = []
//     for (var i = 0; i < player.hand.length; i++) {
//         tempTotals.push(player.hand[i][0].value)
//     }
//     // running totals =  max potential value (every ace is 11)
//     var runningTotal = tempTotals.reduce((acc, x) => acc + x)
//     //sort thru cards arr - count aces
//     var aceCount = tempTotals.filter(x => x == 11).length
//     var totals = [runningTotal]
//     //check for 21
//     if (runningTotal == 21){
//         document.getElementById('messageBoard').textContent = 'Player has 21'
//         player.pau = true
//         player.bust = true
//         player.total = runningTotal
//         payOut()
//         return
//     }
//     //while there are aces in hand - minus 10 & add to potential totals(totals)
//     while (aceCount > 0) {
//         aceCount--
//         runningTotal -= 10
//         totals.push(runningTotal)
//     }
//     //filter thru all potential totals, keep only ones that aren't busted
//     totals = totals.filter(x => x <= 21)
//     console.log('VALID totals: ' + totals)
//     player.total = runningTotal
//     //if there aren't any valid totals, player has busted
//     if (!totals.length) {
//         player.pau = true
//         player.bust = true
//         // document.getElementById('hitBtn').disabled = true
//         document.getElementById('messageBoard').textContent = 'BUST!'
//         payOut()
//         return
//     }
//     //if multiple total options, display both
//     if (totals > 1) {
//         document.getElementById('messageBoard').textContent = totals[0] + ' or ' + totals[1]
//     }
//     //display total
//     document.getElementById('messageBoard').textContent = 'player has: ' + totals

// }