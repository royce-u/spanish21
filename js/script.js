//<--------------------------------------globals & things-------------------------------------->
//global variables
let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 'Jack', 'Queen', 'King', 'Ace']
let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11]
var player
var dealer
let decks

//create deck of cards - 5 - remove 10s 
class Card {
    constructor(suit, rank, value) {
        this.suit = suit
        this.rank = rank
        this.value = value
        //template literals to map to image source here
    }
}

class Deck {
    constructor() {
        this.deck = []
    }
    createDeck(suits, ranks, values) {
        for (let j = 0; j <= 5; j++){
            for (let suit of suits) {
                for (let i = 0; i < ranks.length; i++) {
                    this.deck.push(new Card(suit, ranks[i], values[i]));
                }
            }
        }
        return this.deck;
    }

    shuffle() {
        let counter = this.deck.length, temp, i

        while (counter) {
            i = Math.floor(Math.random() * counter--)
            temp = this.deck[counter]
            this.deck[counter] = this.deck[i]
            this.deck[i] = temp
        }
        return this.deck
    }
    deal() {
        let hit = []
        hit.push(this.deck.pop())
        return hit;
    }
}

class Player {
    constructor(name) {
        this.playerName = name
        this.upCard = ''
        this.downCard = ''
        this.insBet = false
        this.bank = 0
        this.hand = []
        this.total = 0
        this.aceCount = 0
        this.pau = false
        this.bust = false
    }
}

class Dealer {
    constructor() {
        this.dealerUpCard = ''
        this.dealerDownCard = ''
        this.bank = 1000
        this.hand = []
        this.total = 0
    }

}


//<-------------------------------------------intro------------------------------------------>
//prompt for cash in 



// console.log(player.hand)
// console.log('player 1st card: ' + player.hand[0][0].value)
// console.log('player 2nd card: ' + player.hand[1][0].value)
// console.log('dealer 1st card: ' + dealer.hand[0][0].value)
// console.log('dealer 2nd card: ' + dealer.hand[1][0].value)

//<---------------------------------dealer functions -------------------------------->
function initGame() {
    player = new Player()
    dealer = new Dealer()
    decks = new Deck()
    decks.createDeck(suits,ranks,values)
    // //create 6 empty decks
    // for (var i = 0; i < 6; i++) {
    //     decks.push(new Deck())
    // }
    // //add properties to empty decks
    // for (var i = 0; i < decks.length; i++) {
    //     decks[i].createDeck(suits, ranks, values)
    // }
    // //take nested array of arrays - move into flatDecks
    // var flatDecks = []
    // for (var i = 0; i < decks.length; i++) {
    //     flatDecks.push(decks[i].deck)
    // }
    // //move arrays of cards to flatdeck
    // flatDeck = [].concat(...flatDecks)
    console.log(decks)
    console.log(typeof decks)
    document.getElementById('messageBoard').textContent= 'Enter buy-in amount below' 
}

function preStart(){
    document.getElementById('messageBoard').textContent = 'Place your bets below'
    document.getElementById('bets-container').style.display = 'block'
}

function startGame(){
    // initial deal
    for (var i = 0; i < 2; i++) {
        player.hand.push(decks.deal())
        dealer.hand.push(decks.deal())
    }
    //display open hands
    document.getElementById('playerHand').textContent = player.hand[0][0].value + ' ' + player.hand[1][0].value
    document.getElementById('board').textContent = dealer.hand[0][0].value
    //check for bj
    bJChecker()  
}

// console.log('player: ' + player)

//startGame()
    //deal first 2 cards
    //check top card bet
        //payout
    //check for player bj
    //if top card is ace
        //insurance()


// bJCheck()


// bj check
function bJChecker() {
    if (player.hand[0][0].value + player.hand[1][0].value == 21) {
        document.getElementById('messageBoard').textContent = 'Player Blackjack'
        player.pau = true
        player.bust = true
        disableAllButtons()
        preDealer()
        //insert payout function here
    }
    if (dealer.hand[0][0].value + dealer.hand[1][0].value == 21) {
        document.getElementById('board').textContent += ' ' + dealer.hand[1][0].value
        player.pau = true
        player.bust = true
        disableAllButtons()
        setTimeout(function(){
            document.getElementById('messageBoard').textContent = 'Dealer Blackjack'
        },2000)
    }
}

//bust checker
function bustChecker() {
    //loop through each card and store in temp totals (values are nested)
    var tempTotals = []
    for (var i = 0; i < player.hand.length; i++) {
        tempTotals.push(player.hand[i][0].value)
    }
    // running totals =  max potential value (every ace is 11)
    var runningTotal = tempTotals.reduce((acc, x) => acc + x)
    //sort thru cards arr - count aces
    var aceCount = tempTotals.filter(x => x == 11).length
    var totals = [runningTotal]
    //check for 21
    if (runningTotal == 21){
        document.getElementById('messageBoard').textContent = 'Player has 21'
        player.pau = true
        player.bust = true
        preDealer()
        player.total = runningTotal
        return
    }
    //while there are aces in hand - minus 10 & add to potential totals(totals)
    while (aceCount > 0) {
        aceCount--
        runningTotal -= 10
        totals.push(runningTotal)
    }
    //filter thru all potential totals, keep only ones that aren't busted
    totals = totals.filter(x => x <= 21)
    console.log('VALID totals: ' + totals)
    player.total = totals
    //if there aren't any valid totals, player has busted
    if (!totals.length) {
        player.pau = true
        player.bust = true
        // document.getElementById('hitBtn').disabled = true
        document.getElementById('messageBoard').textContent = 'BUST!'
        preDealer()
        return
    }
    //if multiple total options, display both
    if (totals > 1) {
        document.getElementById('messageBoard').textContent = totals[0] + ' or ' + totals[1]
    }
    //display total
    document.getElementById('messageBoard').textContent = 'player has: ' + totals

}

//dealer action
function dealerAction() {
    var tempTotals = []
    for (var i = 0; i < dealer.hand.length; i++) {
        tempTotals.push(dealer.hand[i][0].value)
    }
    var runningTotal = tempTotals.reduce((acc, x) => acc + x)
    var aceCount = tempTotals.filter(x => x == 11).length
    var totals = [runningTotal]
    //if 21 - quit
    if (runningTotal == 21) {
        document.getElementById('board').textContent += ' ' + dealer.hand[dealer.hand.length - 1][0].value
        document.getElementById('messageBoard').textContent = 'Dealer has ' + runningTotal
        console.log('running total: ' + runningTotal)
        console.log('ace count: ' + aceCount)
        return
    }
    //if > hard 21 - bust
    else if (runningTotal > 21 && aceCount == 0) {
        document.getElementById('messageBoard').textContent = runningTotal + ' Dealer BUST'
        dealer.total = runningTotal
        console.log('running total: ' + runningTotal)
        return
    }
    //if soft 17 - hit
    else if (runningTotal == 17 && aceCount == 1){
        document.getElementById('messageBoard').textContent = 'Dealer: ' + runningTotal
        dealer.hand.push(flatD.deal())
        document.getElementById('board').textContent += ' ' + dealer.hand[dealer.hand.length - 1][0].value
        console.log('running total: ' + runningTotal)
        console.log('ace count: ' + aceCount)
    }
    //if > hard 16 && < hard 21 - stand
    else if (runningTotal >= 17 && runningTotal < 21){
        document.getElementById('messageBoard').textContent = 'Dealer has ' + runningTotal
        dealer.total = runningTotal
        console.log('running total: ' + runningTotal)  
        console.log('ace count: ' + aceCount)  
        return
    }
    //if soft and > 21
    else if (aceCount > 1 && runningTotal > 21) {
        aceCount -= 1
        runningTotal -= 10
        document.getElementById('messageBoard').textContent = 'Dealer has ' + runningTotal
        dealer.total = runningTotal
        console.log('running total: ' + runningTotal)
        console.log('ace count: ' + aceCount)
        dealerAction()
    }
    //if running total is less than 17 - hit
    else if (runningTotal < 17){
        // while (aceCount > 0) {
        //     if (runningTotal < 21)
        //     aceCount--
        //     runningTotal -= 10
        // }
        dealer.hand.push(flatDeck.deal())
        document.getElementById('board').textContent += ' ' + dealer.hand[dealer.hand.length - 1][0].value
        document.getElementById('messageBoard').textContent = 'Dealer: ' + runningTotal
        console.log('running total: ' + runningTotal)
        console.log('ace count: ' + aceCount)
        dealerAction()
    }
    
}

//intro to dealer action
function preDealer() {
    //display dealers 2nd card
    document.getElementById('board').textContent += ' ' + dealer.hand[1][0].value
    //run reset function here
    //if player busts or gets bj - don't run dealer action
    if (player.bust == false || player.pau == false) {
        dealerAction()
    }
}

function cashIn() {
    //add entered amount to players bank
    player.bank = document.getElementById('buy-in-amt').value
    //hide buy-in button
    document.getElementById('cash-container').style.visibility = 'hidden';
    document.getElementById('messageBoard').textContent = 'Changing  $' + player.bank
    setInterval(function(){
        document.getElementById('messageBoard').textContent = 'Good Luck!'    
    }, 2000)
    preStart()
}

// <---------------------------------player functions -------------------------------->
function hit() {
    player.hand.push(flatDeck.deal())
    document.getElementById('playerHand').textContent += ' ' + player.hand[player.hand.length - 1][0].value
    bustChecker()
}

//stand
function stand() {
    //if the array of potential totals are more than 1
    if (player.total.length > 1) {
        //take the higher potential total and assign it to players hand
        player.total = Math.max(player.total[0], player.total[1])
    }
    //if player stands on 1st 2 cards - add total to player.total
    if (player.hand.length == 2) {
        player.total = player.hand[0][0].value + player.hand[1][0].value
    }

    console.log('player.total: ' + player.total)
    //log players playable total
    document.getElementById('messageBoard').textContent = 'Player stands at ' + player.total
    //set delay to clear board & turn it over to the dealer
    setTimeout(function () {
        document.getElementById('messageBoard').textContent = ''
        preDealer()
        // disableAllButtons()
    }, 2000)
}

// disable all buttons
function disableAllButtons(){
    document.getElementById('hitBtn').disabled = true
    document.getElementById('standBtn').disabled = true
    document.getElementById('splitBtn').disabled = true
    document.getElementById('doubleBtn').disabled = true
}

//event listeners
document.addEventListener('DOMContentLoaded', initGame)
document.getElementById('hitBtn').addEventListener('click', hit)
document.getElementById('standBtn').addEventListener('click', stand)
document.getElementById('buy-in-btn').addEventListener('click', cashIn)
document.getElementById('main-bet-in-btn').addEventListener('click', startGame)

