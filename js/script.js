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
    constructor(){
        this.deck = []
    }
    createDeck(suits, ranks, values) {
        for (let suit of suits) {
            for (let i = 0; i < ranks.length; i++) {
                this.deck.push(new Card(suit, ranks[i], values[i]));
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

    deal(){
        let hit = []
            hit.push(this.deck.pop())
        return hit;
    }
}

let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 'Jack', 'Queen', 'King', 'Ace']
let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11]

class Player{
    constructor(name){
        this.playerName = name
        this.upCard = ''
        this.downCard = ''
        this.insBet = false
        this.bank = 0
        this.hand = []
        this.aceCount = 0
    }
}

class Dealer {
    constructor(){
        this.dealerUpCard = ''
        this.dealerDownCard = ''
        this.bank = 1000 
        this.hand = []
    }
   
}

document.getElementById('hitBtn').addEventListener('click', hit)

//intro
    //create: dealer, player, deck
    var player = new Player()
    var dealer = new Dealer()
    let deck1 = new Deck()
    deck1.createDeck(suits, ranks, values)
    //shuffle
    deck1.shuffle()
    //start game function
    startGame()
    // console.log(player.hand)
    console.log('player 1st card: ' + player.hand[0][0].value)
    console.log('player 2nd card: ' + player.hand[1][0].value)
    console.log('dealer 1st card: ' + dealer.hand[0][0].value)
    console.log('dealer 2nd card: ' + dealer.hand[1][0].value)

//dealer functions
    function startGame() {
        //prompt for bet amounts here
        //initial deal
        for (var i = 0; i < 2; i ++) {
            player.hand.push(deck1.deal())
            dealer.hand.push(deck1.deal())
        }
        document.getElementById('playerHand').textContent = player.hand[0][0].value + ' ' + player.hand[1][0].value
        document.getElementById('board').textContent = dealer.hand[0][0].value
        // check for player bj
        bJCheck()
    }

    //bj function
    function bJCheck() {
        if (player.hand[0][0].value + player.hand[1][0].value == 21){
            console.log('player blackjack')
            document.getElementById('messageBoard').textContent = 'Player Blackjack'
            //insert payout function here
        }
        if (dealer.hand[0][0].value + dealer.hand[1][0].value == 21) {
            console.log('dealer bj')
            document.getElementById('messageBoard').textContent = 'Dealer Blackjack'
        }
    }

    //bust checker
    function bustChecker() {
        //loop through each card and store totals
        var tempTotals = []
        for (var i = 0; i < player.hand.length; i++) {
            tempTotals.push(player.hand[i][0].value)
        }
        // Start running total at max value (every ace is 11)
        var runningTotal = tempTotals.reduce((acc, x) => acc + x)
        var aceCount = tempTotals.filter(x => x == 11).length
        var totals = [runningTotal]
        var bust = false
      
        while (aceCount > 0){
            aceCount--
            runningTotal -= 10
            // console.log('runningTotal now: ' + runningTotal)
            totals.push(runningTotal)
        }
      
        // console.log('all total: ' + totals)
        totals = totals.filter(x => x <= 21)
        console.log('VALID totals: ' + totals)
      
        if (!totals.length) {
          bust = true
          console.log('busted')
        }
        return totals
      }

//player functions
    //hit  
    function hit(){
        player.hand.push(deck1.deal())
        document.getElementById('playerHand').textContent += ' ' + player.hand[player.hand.length - 1][0].value
        console.log(player.hand)
        bustChecker()
    }

    








//intro

//start game function
    //enter number of players
    //place bets

//dealer functions
    //clear board
    //deal

//player functions
    //create split function
        //add new div
            //max of 4 hands
    //create double function
        //add new div
            //no double double 
    //create surrender function
        //trash cards
        //return half of bet
    //create insurance function
        //remove cards
        //take bet
        //insurance payout 

//create payout functions
    //insurance
    //blackjack
    //special 21 payouts
    //top/bottom match bet payout
    //insurance
    //double 
    //split