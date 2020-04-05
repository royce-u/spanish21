//<--------------------------------------globals & things-------------------------------------->
//global variables
let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 'Jack', 'Queen', 'King', 'Ace']
let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11]
var player
var dealer
let decks
let msgBoard = document.getElementById('messageBoard')
let board = document.getElementById('board')
let playerMainBetBox = document.getElementById('bet-main')
let playerHand = document.getElementById('playerHand')
let playerActionBtns = document.getElementById('player-action-btns')
let betsContainer = document.getElementById('bets-container')


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
        this.mainBet = 0
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
        this.bust = false
        this.discard = []
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
    decks.shuffle()
    document.getElementById('messageBoard').textContent= 'Enter buy-in amount below' 
}

//display place bets & reveals main bet box
function preStart(){
    // document.getElementById('playerBank').textContent = player.bank
    document.getElementById('messageBoard').textContent = 'Place your bets below'
    document.getElementById('bets-container').style.display = 'block'
}
//adds bet amt to player.mainBet - deals open hand - checks for bj
function startGame(){
    playerActionBtns.style.display = 'block'
    betsContainer.style.display = 'none'
    //add bet amount to players bet property
    player.mainBet = parseInt(document.getElementById('main-bet-in').value)
    //subtract bet from players bank & display
    player.bank -= player.mainBet
    console.log('Start Game player.mainBet: ' + [player.mainBet])
    console.log('Start Game player.bank: ' + player.bank)
    document.getElementById('bet-main').textContent = player.mainBet
    // initial deal
    for (var i = 0; i < 2; i++) {
        player.hand.push(decks.deal())
        dealer.hand.push(decks.deal())
    }
    //display opening hand in msg board
    // msgBoard.textContent = 'player has ' + player.hand[0][0].value + ' ' + player.hand[1][0].value
    bustChecker()
    //display open hands
    document.getElementById('playerHand').textContent = player.hand[0][0].value + ' ' + player.hand[1][0].value
    document.getElementById('board').textContent = dealer.hand[0][0].value
    //check for bj
    bJChecker()  
}

// bj check - payout bj
function bJChecker() {
    //if player bj - payout
    if (player.hand[0][0].value + player.hand[1][0].value == 21) {
        playerActionBtns.style.display = 'none'
        player.pau = true
        payOut()
        document.getElementById('board').textContent += ' ' + dealer.hand[1][0].value
        reset()
        preStart()
    }
    //if dealer bj - take
    if (dealer.hand[0][0].value + dealer.hand[1][0].value == 21) {
        playerActionBtns.style.display = 'none'
        player.pau = true
        payOut()
        reset()
        preStart()
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
        player.total = runningTotal
        payOut()
        console.log('player.total: ' + player.total)
        console.log('running total: ' + runningTotal)
        console.log('totals: ' + totals)
        preDealer()
        return
    }
    //while there are aces in hand - minus 10 & add to potential totals(totals)
    while (aceCount > 0) {
        aceCount--
        runningTotal -= 10
        totals.push(runningTotal)
        // console.log('player.total: ' + player.total)
        // console.log('running total: ' + runningTotal)
        // console.log('totals: ' + totals)
    }
    //filter thru all potential totals, keep only ones that aren't busted
    totals = totals.filter(x => x <= 21)
    // console.log('VALID totals: ' + totals)
    player.total = totals
    //if there aren't any valid totals, player has busted
    if (!totals.length) {
        playerActionBtns.style.display = 'none'
        player.bust = true
        console.log('player.total: ' + player.total)
        console.log('running total: ' + runningTotal)
        console.log('totals: ' + totals)
        // document.getElementById('hitBtn').disabled = true
        document.getElementById('messageBoard').textContent = 'BUST!'
        payOut()
        preDealer()
        return
    }
    //if multiple total options, display both
    if (totals.length > 1) {
        document.getElementById('messageBoard').textContent = totals[0] + ' or ' + totals[1]
    }
    //display total
    document.getElementById('messageBoard').textContent = 'player has: ' + totals
}

//dealer action
function dealerAction() {
    //loops thru nested cards to get value
    var tempTotals = []
    for (var i = 0; i < dealer.hand.length; i++) {
        tempTotals.push(dealer.hand[i][0].value)
    }
    //runningTotal = highest possible total
    var runningTotal = tempTotals.reduce((acc, x) => acc + x)
    var aceCount = tempTotals.filter(x => x == 11).length
    //totals = possible totals (including Aces)
    var totals = [runningTotal]
    //if hard 17 (with an ace)
    if (runningTotal == 27 && aceCount == 1) {
        document.getElementById('messageBoard').textContent = 'Dealer has ' + runningTotal
        dealer.total = runningTotal
        payOut()
    }
    //if running total > soft 21 - minus 10
    if (runningTotal > 21 && aceCount > 0){
        while (aceCount > 0) {
            aceCount--
            runningTotal -= 10
            //if NOT hard 17 w/ ace - add
            if (runningTotal !== 17) {
                dealer.hand.push(decks.deal())
                document.getElementById('board').textContent += ' ' + dealer.hand[dealer.hand.length - 1][0].value
                document.getElementById('messageBoard').textContent = 'Dealer: ' + runningTotal
            }
            else {
                dealerAction()
            }
        }
        // console.log('running total: ' + runningTotal)
        // console.log('ace count: ' + aceCount)
    }
    //if soft 17 - hit
    else if (runningTotal == 17 && aceCount > 1){
        document.getElementById('messageBoard').textContent = 'Dealer: ' + runningTotal
        dealer.hand.push(decks.deal())
        // console.log('running total: ' + runningTotal)
        // console.log('totals: ' + totals)  
        document.getElementById('board').textContent += ' ' + dealer.hand[dealer.hand.length - 1][0].value
        dealerAction()
    }
    //if under 16 - hit
    else if (runningTotal < 17) {
        dealer.hand.push(decks.deal())
        // console.log('running total: ' + runningTotal)
        // console.log('totals: ' + totals)  
        document.getElementById('board').textContent += ' ' + dealer.hand[dealer.hand.length - 1][0].value
        dealerAction()
    }
    //if > hard 17 && < hard 21 - stand
    else if (runningTotal >= 17 && runningTotal <= 21){
        document.getElementById('messageBoard').textContent = 'Dealer has ' + runningTotal
        dealer.total = runningTotal
        // console.log('running total: ' + runningTotal)
        // console.log('totals: ' + totals)  
        // console.log('ace count: ' + aceCount)  
        payOut()
        // document.getElementById('board').textContent += dealer.hand[1][0].value
        return
    }
    //if > hard 21 - bust
    else if (runningTotal > 21) {
        dealer.bust = true
        document.getElementById('messageBoard').textContent = runningTotal + ' Dealer BUST'
        // console.log('running total: ' + runningTotal)
        // console.log('totals: ' + totals)
        payOut()
        // document.getElementById('board').textContent += dealer.hand[1][0].value
        return
    }
    
    
}

//intro to dealer action
function preDealer() {
    //display dealers 2nd card
    document.getElementById('board').textContent += ' ' + dealer.hand[1][0].value
    //if player busts or gets bj - don't run dealer action
    // if (player.bust == false && player.pau == false) {
    //     dealerAction()
    // }
    // reset()
}

function cashIn() {
    //add entered amount to players bank
    player.bank = parseInt(document.getElementById('buy-in-amt').value)
    //hide buy-in button
    document.getElementById('cash-container').style.display = 'none'
    //display changing money 
    document.getElementById('messageBoard').textContent = 'Changing  $'
    //add money to player bank
    document.getElementById('playerBank').textContent = player.bank
    //display good luck message
    document.getElementById('messageBoard').textContent = 'Good Luck!'
    //
    preStart()

}

function payOut() {
    //---------------------blackjack payouts---------------------
    //if player bj - pay
    if (player.hand[0][0].value + player.hand[1][0].value == 21) {
        dealer.bank -= (player.mainBet * 3/2)
        player.mainBet += (player.mainBet * 3/2)
        msgBoard.textContent = 'Player Blackjack'
        console.log('player.mainBet: ' + player.mainBet)
    }
    //if dealer bj - scoop
    else if (dealer.hand[0][0].value + dealer.hand[1][0].value == 21 && player.hand[0][0].value + player.hand[1][0].value !== 21) {
        dealer.bank += player.mainBet
        player.mainBet = 0
        msgBoard.textContent += 'Dealer Blackjack'
        console.log('player.mainBet: ' + player.mainBet)
    }
    //if dealer wins or player bust- scoop
    if (player.bust == true || dealer.total > player.total) {
        dealer.bank += player.mainBet
        player.mainBet = 0
        msgBoard.textContent += ' - Lose'
        console.log('player.mainBet: ' + player.mainBet)
    }
    //if dealer bust or lose - pay
    else if (dealer.bust == true || dealer.total < player.total) {
        //subtract amount from dealer bank
        dealer.bank -= player.mainBet
        //pay player double
        player.mainBet += player.mainBet
        msgBoard.textContent += ' - Winner'
        console.log('player.mainBet: ' + player.mainBet)
    }
    //if player gets 21
    else if (player.total == 21) {
        dealer.bank -= player.mainBet
        player.mainBet += player.mainBet
        msgBoard.textContent += ' - Winner'
        console.log('player.mainBet: ' + player.mainBet)
    }
    //if push - push
    else if (dealer.total == player.total) {
        msgBoard.textContent += ' - PUSH'
        console.log('player.mainBet: ' + player.mainBet)
    }
    //reveal buyin/cashout buttons
    document.getElementById('buyin-cashout-btns').style.display = 'block'
    
}

function reset() {
    betsContainer.style.display = 'block'
    //place all cards in discard rack
    // for (var i = 0; i < player.hand.length; i++) {
    //     dealer.discard.push(player.hand[i])
    // }
    // for (var j = 0; j < dealer.hand.length; j++) {
    //     dealer.discard.push(dealer.hand[j])
    // }
    console.log('player.bank: ' + player.bank)
    player.hand = []
    dealer.hand = []
    //clear board
    msgBoard.textContent= 'Place your bets below'
    board.textContent= ' '
    playerHand.textContent = ' '

    //clear attributes
    dealer.bust = false
    dealer.pau = false
    player.bust = false
    player.pau = false
    player.total = 0
    dealer.total = 0
    //move bets into banks
    player.bank += player.mainBet
    player.mainBet = 0
    console.log('reset player.bank:' + player.bank)
    document.getElementById('buyin-cashout-btns').style.display = 'none'
    

}

// <---------------------------------player functions -------------------------------->
function hit() {
    player.hand.push(decks.deal())
    document.getElementById('playerHand').textContent += ' ' + player.hand[player.hand.length - 1][0].value
    bustChecker()
}

//stand
function stand() {
    //hide action buttons
    playerActionBtns.style.display = 'none'
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
        // disableAllButtons()
        preDealer()
        dealerAction()
    }, 2000)
}

// disable all buttons
function disableAllButtons(){
    document.getElementById('hitBtn').disabled = true
    document.getElementById('standBtn').disabled = true
    document.getElementById('splitBtn').disabled = true
    document.getElementById('doubleBtn').disabled = true
}

function cashout() {
    player.bank += player.mainBet
    msgBoard.textContent = 'Cashing out $ ' + player.bank
}

//event listeners
document.addEventListener('DOMContentLoaded', initGame)
document.getElementById('hitBtn').addEventListener('click', hit)
document.getElementById('standBtn').addEventListener('click', stand)
document.getElementById('buy-in-btn').addEventListener('click', cashIn)
document.getElementById('main-bet-in-btn').addEventListener('click', startGame)
document.getElementById('cashout-btn').addEventListener('click', cashout)
document.getElementById('nextHand').addEventListener('click', reset)


