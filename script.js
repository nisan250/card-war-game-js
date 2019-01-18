var suits = ["spades", "hearts", "clubs", "diams"];
var cardFace = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var cards = [];
var players = [[], []];
var firstRun = true;
var gameover = false;
var timer;
var amountRounds = 0;

// DOM elements
var startButton = document.querySelector("#dealCards");
var startButton10 = document.querySelector("#dealCards10");
var startButton50 = document.querySelector("#dealCards50");
var p1 = document.querySelector("#player1 .hand");
var p2 = document.querySelector("#player2 .hand");
var s1 = document.querySelector("#player1 .score");
var s2 = document.querySelector("#player2 .score");


// event listeners
startButton.addEventListener('click', play);
startButton10.addEventListener('click', function() {
    rounds(10);
});
startButton50.addEventListener('click', function() {
    rounds(50);
});


// functions
        // HELPERS
function rounds(times) {
    amountRounds = times;

    timer = setInterval(function() {
        play();
    }, 100);
}

function outputMessage(message) {
    console.log(document.querySelector("#message"));
    document.getElementById('message').innerHTML = message;
}

        // -------------

function play() {
    if(timer) {
        amountRounds--;
        outputMessage('Rounds Left' + amountRounds);
        if(amountRounds < 1) {
            window.clearInterval(timer);
        }
    }
    if(firstRun) {
        firstRun = false;
        buildCards();
        shuffleArray(cards);
        dealCards(cards);
    }
    attack();
}

function attack() {
    if(!gameover) {
        var card1 = players[0].shift();
        var card2 = players[1].shift();
        var pot = [card1, card2];

        p1.innerHTML = showCard(card1, 0);
        p2.innerHTML = showCard(card2, 0);
        // check winners
        checkWinner(card1, card2, pot);
        s1.innerHTML = players[0].length;
        s2.innerHTML = players[1].length;
        // update scoreds
    } else {
        console.log('Game Over');
        outputMessage('Game Over');
    }
}

function checkWinner(card1, card2, pot) {
    if((players[0].length <= 4) || (players[1].length <= 4)) {
        if(players[0].length <= 4) {
            players[1] = players[1].concat(pot);
        } else{
            players[0] = players[0].concat(pot);
        }
        gameover = true;
        return;
    }
    if(card1.cardValue > card2.cardValue) {
        console.log('Hand 1 Wins', card1.cardValue, card2.cardValue);
        outputMessage('Player 1 Wins');
        players[0] = players[0].concat(pot);
    } else if(card1.cardValue < card2.cardValue) {
        console.log('Hand 2 Wins', card1.cardValue, card2.cardValue);
        outputMessage('Player 2 Wins');
        players[1] = players[1].concat(pot);
    } else {
        battlemode(pot);
        console.warn('Tie - Battle Mode', card1.cardValue, card2.cardValue);
        outputMessage('Battle Mode');
    }
    console.log('players', players)
}

function battlemode(pot) {
    var card1, card2;
    var pos = (pot.length/2);
    if((players[0].length < 4) || (players[1].length < 4)) {
        return
    } else {
        for(var i = 0; i < 4; i++) {
            card1 = players[0].shift();
            pot = pot.concat(card1);
            p1.innerHTML += showCard(card1, (pos+i));
        }
        for(var i = 0; i < 4; i++) {
            card2 = players[1].shift();
            pot = pot.concat(card2);
            p2.innerHTML += showCard(card2, (pos+i));
        }
        checkWinner(card1, card2, pot);
    }
}

//visualation
function showCard(c,p) {
    var move = p * 40;
    var bgColor = (c.icon == "H" || c.icon == "D") ? "red" : "black";
    var bCard = '<div class="icard ' + c.suit +' " style="left:' + move + 'px">';
    bCard += '<div class="cardtop suit">' + c.num + '<br></div>';
    bCard += '<div class="cardmid suit"></div>';
    bCard += '<div class="cardbottom suit">' + c.num + '<br></div></div>';
    return bCard;
}


// first Run
function buildCards() {
    cards = [];
    for(s in suits) {
        var suitNew = suits[s][0].toUpperCase();
        // console.log('suitsNew', suitNew);
        for(n in cardFace) {
            var card = {
                suit: suits[s],
                num: cardFace[n],
                cardValue: parseInt(n) +2,
                icon: suitNew
            }
            cards.push(card);
        }
    }
}

function dealCards(array) {
    for(var i=0; i<array.length; i++) {
        var m = i % 2;
        players[m].push(array[i]);
    }
}

function shuffleArray(array) {
    for(var x = array.length - 1; x > 0; x--) {
       var ii = Math.floor(Math.random() * (x + 1));
       var temp = array[x];
       array[x] = array[ii];
       array[ii] = temp;
    }
    return array;
}

