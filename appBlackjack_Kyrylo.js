var gameDeck = [];
var suits = ["Hearts", "Diamonds", "Clubs", "Spades"]; //♦♠♣♥
var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
var playerHand = [];
var dealerHand = [];
const gameField = document.getElementById("game-field");
const menuPopup = document.getElementById("menu-popup");
var resultBoxColor = "startingColor";

document.getElementById("start-game").addEventListener("click", function () {
	menuPopup.style.display = "none";
	gameField.classList.remove("none-hidden");
	startRound();
});

document.getElementById("play-again").addEventListener("click", function () {
	menuPopup.style.display = "none";
	gameField.classList.remove("none-hidden");
	resetGame();
});

function createDeck() {
	let deck = [];
	suits.forEach(suit => {
		ranks.forEach(rank => {
			let color = (suit == "Hearts" || suit == "Diamonds") ? "red" : "black";
			deck.push({rank, suit, color});
		});
	});
	return deck;
}

function shuffleDeck(deck) {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		tmp = deck[i];
		deck[i] = deck[j];
		deck[j] = tmp;
	}
}

function drawCard(deck) {
	return deck.length != 0 ? deck.shift() : deck.length;
}

function stand() {
	
    let hiddenCard = document.getElementById("hidden-card");
	let hiddenCardObj = dealerHand[0];
	let rankShort = hiddenCard.querySelector(".card-letter").textContent;
	
	document.querySelectorAll(".game-button").forEach(button => {
			button.disabled = true;
	});
	
    if (hiddenCard) {
        flipCard(hiddenCard.id, "right");
		hiddenCard.id = `card-${rankShort}-${hiddenCardObj.suit.toLowerCase()}`;
    }
	
	setTimeout(() => {
		document.getElementById("dealer-score").textContent = calculateHandValue(dealerHand, true);
	}, 500);
	
	let dealerTurn = setInterval(() => {
		let dealerTotal = calculateHandValue(dealerHand, true);
		
        if (dealerTotal < 17) {
            dealerHit();
            dealerTotal = calculateHandValue(dealerHand, true);
        } else {
            clearInterval(dealerTurn);
            determineWinner();
        }
    }, 1000);
}

function calculateHandValue(hand, isDealer) {
	let total = 0;
	let aces = 0;
	
	hand.forEach((card, index) => {
		if (isDealer && index === 0 && document.getElementById("hidden-card")) {
			total += 0;
		} else if (["Jack", "Queen", "King"].includes(card.rank)) {
			total += 10;
		} else if (card.rank === "Ace") {
			total += 11;
			aces++;
		} else {
			total += parseInt(card.rank);
		}
	});

	while (total > 21 && aces > 0) {
		total -= 10;
		aces--;
	}
	
	return total;
}

function determineWinner() {
	if (resultBoxColor != "startingColor") {
		menuPopup.querySelector("#message-box-div").classList.remove(`message-box-${resultBoxColor}`);
	}
	
	let playerTotal = calculateHandValue(playerHand, false);
	let dealerTotal = calculateHandValue(dealerHand, true);
	let message = "";

	if (dealerTotal > 21) {
		message = "Dealer busts! Player wins!";
		resultBoxColor = "green";
	} else if (playerTotal > 21) {
		message = "Player busts! Dealer wins!";
		resultBoxColor = "red";
	} else if (playerTotal > dealerTotal && playerTotal <= 21) {
		message = "Player wins!";
		resultBoxColor = "green";
	} else if (dealerTotal > playerTotal && dealerTotal <= 21) {
		message = "Dealer wins!";
		resultBoxColor = "red";
	} else {
		message = "It's a tie!";
		resultBoxColor = "blue";
	}
	
	menuPopup.querySelector("#message-text").textContent = message;
	menuPopup.querySelector("#message-box-div").classList.add(`message-box-${resultBoxColor}`);
	
	setTimeout(() => {
		menuPopup.querySelector("#start-game").classList.add("none-hidden");
		menuPopup.querySelector("#logo").style.display = "none";
		menuPopup.querySelector("#message-box-div").classList.remove("none-hidden");
		menuPopup.querySelector("#play-again").classList.remove("none-hidden");
		menuPopup.style.display = "flex";
	}, 1000);
}

function resetGame() {
	let dealerHandElement = document.getElementById("dealer-hand");
	let playerHandElement = document.getElementById("player-hand");
	let dealerScoreElement = document.getElementById("dealer-score");
	let playerScoreElement = document.getElementById("player-score");
	
	while (dealerHandElement.firstChild) {
		removeCardFromHand(dealerHandElement);
	};
	while (playerHandElement.firstChild) {
		removeCardFromHand(playerHandElement);
	};
	
	dealerScoreElement.textContent = "";
	playerScoreElement.textContent = "";
	
	startRound();
}

function startRound() {
	document.querySelectorAll(".game-button").forEach(button => {
			button.disabled = true;
	});
	gameDeck = createDeck();
	shuffleDeck(gameDeck);
	setTimeout(() => {
		hit();
	}, 500);
	setTimeout(() => {
		dealerHit();
	}, 1000);
	setTimeout(() => {
		hit();
	}, 1500);
	setTimeout(() => {
		dealerHit();
	}, 2000);
	setTimeout(() => {
		document.querySelectorAll(".game-button").forEach(button => {
			button.disabled = false;
		});
	}, 3000);
}

function hit() {
	if (gameDeck.length === 0) return;
	
	let newCard = drawCard(gameDeck);
	document.getElementById("deck-text").textContent = gameDeck.length;
	let cardElement = renderCard(newCard);
	
	document.body.querySelector("#game-field").appendChild(cardElement);
	cardElement.style.display = "none";
	flipCard(cardElement.id, "left");
	
	let handElement = document.getElementById("player-hand");
	animateCardToHand(cardElement, playerHand.length, handElement);
	
	playerHand.push(newCard);
	
	setTimeout(() => {
		flipCard(cardElement.id, "right");
		document.getElementById("player-score").textContent = calculateHandValue(playerHand, false);
	}, 600);
	if (calculateHandValue(playerHand, false) >= 21) {
		determineWinner();
		document.querySelectorAll(".game-button").forEach(button => {
			button.disabled = true;
		});
	}
}

function dealerHit() {
	if (gameDeck.length === 0) return;
	
	let newCard = drawCard(gameDeck);
	document.getElementById("deck-text").textContent = gameDeck.length;
	let cardElement = renderCard(newCard);
	
	document.body.querySelector("#game-field").appendChild(cardElement);
	cardElement.style.display = "none";
	flipCard(cardElement.id, "left");
	
	let handElement = document.getElementById("dealer-hand");
	animateCardToHand(cardElement, dealerHand.length, handElement);
	
	dealerHand.push(newCard);
	
	if (dealerHand.length != 1) {
		setTimeout(() => {
				flipCard(cardElement.id, "right");
				document.getElementById("dealer-score").textContent = calculateHandValue(dealerHand, true);
		}, 500);
	} else {
		cardElement.id = "hidden-card";
	}
}

function renderCard(card) {
	let rankShort;
	let suitSymbol;
	
	if (isNaN(parseInt(card.rank))) {
		rankShort = card.rank.charAt(0).toUpperCase();
	} else {
		rankShort = card.rank;
	}
	
	switch (card.suit) {
		case "Hearts":
			suitSymbol = "♥";
			break;
		case "Diamonds":
			suitSymbol = "♦";
			break;
		case "Clubs":
			suitSymbol = "♣";
			break;
		case "Spades":
			suitSymbol = "♠";
			break;
	}
	
	let cardWrapper = document.createElement("div");
	cardWrapper.classList.add("card-wrapper");
	let cardId = `card-${rankShort}-${card.suit.toLowerCase()}`;
	cardWrapper.id = cardId;
	
	let cardContainer = document.createElement("div");
	cardContainer.classList.add("card-container");
	
	let cardDiv = document.createElement("div");
	cardDiv.classList.add("card");
	
	let cardFront = document.createElement("div");
	cardFront.classList.add("card-front");
	cardFront.style.color = card.color;
	
	let topCorner = document.createElement("div");
	topCorner.classList.add("card-corner");
	
	let topLetter = document.createElement("span");
	topLetter.classList.add("card-letter");
	topLetter.textContent = rankShort;

	let topSymbol = document.createElement("span");
	topSymbol.classList.add("card-symbol");
	topSymbol.textContent = suitSymbol;
	
	topCorner.appendChild(topLetter);
	topCorner.appendChild(topSymbol);
	
	let middleSymbol = document.createElement("div");
	middleSymbol.classList.add("card-middle-symbol");
	middleSymbol.textContent = suitSymbol;
	
	let bottomCorner = document.createElement("div");
	bottomCorner.classList.add("card-corner", "bottom");

	let bottomLetter = document.createElement("span");
	bottomLetter.classList.add("card-letter");
	bottomLetter.textContent = rankShort;

	let bottomSymbol = document.createElement("span");
	bottomSymbol.classList.add("card-symbol");
	bottomSymbol.textContent = suitSymbol;

	bottomCorner.appendChild(bottomLetter);
	bottomCorner.appendChild(bottomSymbol);
	
	cardFront.appendChild(topCorner);
	cardFront.appendChild(middleSymbol);
	cardFront.appendChild(bottomCorner);
	
	let cardBack = document.createElement("div");
	cardBack.classList.add("card-back");
	
	let backImg = document.createElement("img");
	backImg.src = "assets/cardback.png";
	
	cardBack.appendChild(backImg);
	
	cardDiv.appendChild(cardFront);
	cardDiv.appendChild(cardBack);
	cardContainer.appendChild(cardDiv);
	cardWrapper.appendChild(cardContainer);
	
	return cardWrapper;
}

function flipCard(cardId, direction) {
	let cardElement = document.getElementById(cardId);
	if (!cardElement) return;
	
	let cardInner = cardElement.querySelector(".card");
	let cardFront = cardInner.querySelector(".card-front");
	let cardTransformDeg = isNaN(parseInt(cardInner.style.transform.replace(/[^0-9-]/g, ""))) ? 0 : parseInt(cardInner.style.transform.replace(/[^0-9-]/g, ""));
	
	if (direction === "right") {
		cardTransformDeg += 180;
	} else if (direction === "left") {
		cardTransformDeg -= 180;
    }
	
	cardInner.style.transform = `rotateY(${cardTransformDeg}deg)`;
	
	if (Math.abs(cardTransformDeg % 360) == 0 || cardTransformDeg == 0) {
		cardFront.style.display = "flex";
	} else if (Math.abs(cardTransformDeg % 360) == 180) {
		cardFront.style.display = "none";
	}
}

function animateCardToHand(cardElement, index, handElement) {
	document.body.querySelector("#game-field").appendChild(cardElement);
	cardElement.style.display = "none";
	
	let cardHeight = parseInt(window.getComputedStyle(cardElement.querySelector(".card-container")).height);
	
	let deckPosition = { x: window.innerWidth / 2, y: -cardHeight - 10};
	let handPosition = handElement.getBoundingClientRect();
	
	let scrollOffset = window.scrollY;
	
	cardElement.style.position = "absolute";
	cardElement.style.left = `${deckPosition.x}px`;
	cardElement.style.top = `${deckPosition.y + scrollOffset}px`;
	cardElement.style.display = "block";
	
	setTimeout(() => {
		cardElement.style.left = `${handPosition.left + index * 50}px`;
		cardElement.style.top = `${handPosition.top + scrollOffset}px`;
	}, 100);
	
	setTimeout(() => {
		handElement.appendChild(cardElement);
		cardElement.style.position = "relative";
		cardElement.style.left = "0px";
		cardElement.style.top = "0px";
	}, 1200);
}

function removeCardFromHand(handElement) {
	if (!handElement.firstChild) return;
	
	let cardToRemove = handElement.lastChild;
	
	let handRect = handElement.getBoundingClientRect();
	let scrollOffset = window.scrollY;
	
	let cardRect = cardToRemove.getBoundingClientRect();

	cardToRemove.style.position = "absolute";
	cardToRemove.style.left = `${cardRect.left}px`;
	cardToRemove.style.top = `${cardRect.top + scrollOffset}px`;
	
	document.body.querySelector("#game-field").appendChild(cardToRemove);
	
	setTimeout(() => {
		cardToRemove.style.left = `${window.innerWidth + 200}px`;
	}, 50);

	switch (handElement.id) {
			case "player-hand":
				drawCard(playerHand);
				break;
			case "dealer-hand":
				drawCard(dealerHand);
				break;
		}
	setTimeout(() => {
		cardToRemove.remove();
	}, 1000);
}

