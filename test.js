let cards;
let dealerCards;
let deck;
let hasBlackJack = false;
let isAlive = true;


let messageElement;
let cardsElement;
let cardsText = "Cards: ";
let sumElement;
let sumText = "Sum: ";
let sum = 0;
let dealerSum = 0;

let textSection = document.getElementById("textSection");
let textSectionHTML = '<p id="messageElement">Hit or Stand?</p><p id="cardsElement">Cards:</p><p id="sumElement">Sum:</p>';
let buttonSection = document.getElementById("buttonSection");
let startButtonsHTML = '<button id="startButton" onclick="startGame()">Start</button>';
let gameButtonsHTML = '<button id="hitButton" onclick="hit()">Hit</button> <button id="standButton" onclick="stand()">Stand</button>';

let dealerSection = document.getElementById("dealerSection");
let dealerSectionHTML = '<p id="dealerMessageElement">Dealer\'s Cards</p><p id="dealerCardsElement">Cards:</p><p id="dealerSumElement">Sum:</p>';
let dealerMessageElement;
let dealerCardsElement;
let dealerSumElement;

let winMessageElement = document.getElementById("winMessage");

function startGame() {
    textSection.innerHTML = textSectionHTML;
    buttonSection.innerHTML = gameButtonsHTML;
    dealerSection.innerHTML = dealerSectionHTML;

    //get added elements
    cardsElement = document.getElementById("cardsElement");
    sumElement = document.getElementById("sumElement");
    messageElement = document.getElementById("messageElement");
    dealerCardsElement = document.getElementById("dealerCardsElement");
    dealerSumElement = document.getElementById("dealerSumElement");
    dealerMessageElement = document.getElementById("dealerMessageElement");


    generateDeck();

    //player cards
    cards = [];
    cards[0] = drawCard();
    cards[1] = drawCard();
    sum = calculateCardsSum(cards);

    cardsElement.innerHTML = "Cards: " + cards[0].card;
    addSuitToCardsElement(cards, cardsElement, 0);
    cardsElement.innerHTML += ", " + cards[1].card;
    addSuitToCardsElement(cards, cardsElement, 1);

    sumElement.innerText = "Sum: " + sum;

    //dealer cards
    dealerCards = [];
    dealerCards[0] = drawCard();
    dealerCards[1] = drawCard();
    dealerSum = calculateCardsSum(dealerCards);

    dealerCardsElement.innerHTML = "Cards: " + dealerCards[0].card;
    addSuitToCardsElement(dealerCards, dealerCardsElement, 0);
    dealerCardsElement.innerHTML += ", ??";

    dealerSumElement.innerText = "Sum: ??";

    winMessageElement.innerText = ""

}

function hit() {
    cards.push(drawCard());
    sum = calculateCardsSum(cards);

    cardsElement.innerHTML += ", " + cards[cards.length - 1].card;
    addSuitToCardsElement(cards, cardsElement, cards.length - 1);
    sumElement.innerText = "Sum: " + sum;

    if (sum > 21) {
        dealerCardsElement.innerHTML = "Cards: " + dealerCards[0].card;
        addSuitToCardsElement(dealerCards, dealerCardsElement, 0);
        dealerCardsElement.innerHTML += ", " + dealerCards[1].card;
        addSuitToCardsElement(dealerCards, dealerCardsElement, 1);
        dealerSumElement.innerText = "Sum: " + dealerSum;

        messageElement.innerText = "Bust!";
        messageElement.style.color = "firebrick";
        buttonSection.innerHTML = startButtonsHTML;
        winMessageElement.innerText = "You lose! :("
    }

}

function stand() {
    dealerCardsElement.innerHTML = "Cards: " + dealerCards[0].card;
    addSuitToCardsElement(dealerCards, dealerCardsElement, 0);
    dealerCardsElement.innerHTML += ", " + dealerCards[1].card;
    addSuitToCardsElement(dealerCards, dealerCardsElement, 1);

    dealerSumElement.innerText = "Sum: " + dealerSum;

    dealerTakeTurn();
}

function dealerTakeTurn() {
    if (dealerSum < 18 && dealerSum < sum) {
        dealerMessageElement.innerText = "Drawing Cards...";
        dealerHit();
        if (dealerSum < 18 && dealerSum < sum) {
            setTimeout(dealerTakeTurn, 1000);
        } else {
            endGame();
        }

    } else {
        endGame();
    }
}

function endGame() {
    if (sum == dealerSum) {
        winMessageElement.innerText = "Draw!"
    } else {
        if (sum > dealerSum && sum < 22 || dealerSum > 21) {
            winMessageElement.innerText = "You win! :)"
        } else {
            winMessageElement.innerText = "You lose! :("
        }
    }

    buttonSection.innerHTML = startButtonsHTML;
}

function calculateCardsSum(cards) {
    let aceEleven = 0;
    let aceOne = 0;
    for (let i = 0; i < cards.length; i++) {
        aceOne += cards[i].value;
        if (cards[i].value === 1) {
            aceEleven += 11;
        } else {
            aceEleven += cards[i].value;
        }
    }
    if (aceEleven > 21) {
        return aceOne;
    } else {
        return aceEleven;
    }
}

function addSuitToCardsElement(cards, cardsElement, cardIndex) {
    if (cards[cardIndex].suit === "♥" || cards[cardIndex].suit === "♦") {
        cardsElement.innerHTML += '<span class="redSuit">' + cards[cardIndex].suit + '</span>';
    } else {
        cardsElement.innerHTML += '<span class="blackSuit">' + cards[cardIndex].suit + '</span>';
    }
}

function generateDeck() {
    deck = [];
    for (let i = 0; i < 13; i++) {
        deck.push(["♥", "♦", "♣", "♠"]);
    }
}

function drawCard() {
    let resultCard = null;
    do {
        let cardIndex = Math.floor(Math.random() * deck.length);
        if (deck[cardIndex].length > 0) {
            let suitIndex = Math.floor(Math.random() * deck[cardIndex].length);
            let cardChar;
            let cardValue;
            switch (cardIndex) {
                case 0: //ace
                    cardChar = "A";
                    cardValue = 1;
                    break;
                case 10: //jack
                    cardChar = "J";
                    cardValue = 10;
                    break;
                case 11: //queen
                    cardChar = "Q";
                    cardValue = 10;
                    break;
                case 12: //king
                    cardChar = "K";
                    cardValue = 10;
                    break;
                default:
                    cardChar = cardIndex + 1;
                    cardValue = cardIndex + 1;
                    break;
            }

            resultCard = { card: cardChar, value: cardValue, suit: deck[cardIndex][suitIndex] };
            deck[cardIndex].splice(suitIndex, 1);
        }

    } while (resultCard === null)

    return resultCard;
}

function dealerHit() {
    dealerCards.push(drawCard());
    dealerSum = calculateCardsSum(dealerCards);

    dealerCardsElement.innerHTML += ", " + dealerCards[dealerCards.length - 1].card;
    addSuitToCardsElement(dealerCards, dealerCardsElement, dealerCards.length - 1);
    dealerSumElement.innerText = "Sum: " + dealerSum;
}