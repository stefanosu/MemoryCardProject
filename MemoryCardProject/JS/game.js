// TODO: fix matching array/scoring issue, clean up code, README

/*
   * Create a list that holds all of your cards
   */

const allCards = [
  "fa-diamond",
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-anchor",
  "fa-bolt",
  "fa-bolt",
  "fa-cube",
  "fa-cube",
  "fa-leaf",
  "fa-leaf",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bomb",
  "fa-bomb"
];

const card = document.getElementsByClassName("card");

// ***** Move counter *****

let moveCount = 0;
const moves = document.querySelector(".moves");
moves.textContent = 0;

function addMove() {
  moveCount++; // increase moves
  moves.textContent = moveCount; // Displays amount of moves in score panel
}

/*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Add HTML to generate cards
function createCard(card) {
  return `<li class="card" data-card="${card}"> <i class="fa ${card}"> </i> </li>`;
}

const deck = document.querySelector(".deck");

// shuffle deck, clear moves, clear arrays used for matching, reset stars
function startGame() {
  let cardTemplate = shuffle(allCards).map(function(card) {
    return createCard(card);
  });
  deck.innerHTML = cardTemplate.join("");
  moves.textContent = 0;
  let matchedCards = [];
  let flippedCards = [];
  startTimer();
}

startGame();

let stars = document.querySelectorAll(".fa-star");
let starTotal = 3; // To call for scoring in the modal

function starCount(stars) {
  // Remove one star after 16 moves
  if (moveCount === 16) {
    stars[0].style.display = "none";
    starTotal = 2;
  }
  if (moveCount === 26) {
    // Remove another star after 26 moves
    stars[1].style.display = "none";
    starTotal = 1;
  }
  if (moveCount === 36) {
    // Zero stars after 36 moves
    stars[2].style.display = "none";
    starTotal = 0;
  }
}

/*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
   */
let flippedCards = [];
let matchedCards = [];

// Function to flip the cards and compare/ match them.  Credit for assistance and event.target tutorial, as well as moral support, to Julian Johannesen in the FEND track.
deck.addEventListener("click", flipIt, false);

function flipIt(event) {
  if (event.target == deck) {
    // If deck is clicked, don't count it
    return;
  }

  if (
    flippedCards.length <= 2 &&
    !event.target.classList.contains("open") &&
    !event.target.classList.contains("show") &&
    !event.target.classList.contains("match")
  ) {
    flippedCards.push(event.target);
    event.target.classList.add("show", "open");
    starCount(stars);
  }

  // Compare the two currently flipped cards to see if they match, if so keep flipped
  if (
    flippedCards.length == 2 &&
    flippedCards[0].dataset.card == flippedCards[1].dataset.card
  ) {
    flippedCards[0].classList.add("match");
    flippedCards[0].classList.add("open");
    flippedCards[0].classList.add("show");
    matchedCards.push(flippedCards);

    flippedCards[1].classList.add("match");
    flippedCards[1].classList.add("open");
    flippedCards[1].classList.add("show");

    winning(); // Check to see if the game has been won
  }

  // If the two cards don't match, flip back over
  if (flippedCards.length == 2) {
    setTimeout(function() {
      flippedCards.forEach(function(card) {
        card.classList.remove("open", "show");
      });
      flippedCards = [];
    }, 1000);
    addMove();
  }
}

// timer reference: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_setinterval2 and Chris N FEND via slack

let seconds = 0;
let minutes = 0;

function startTimer() {
  // Begin counting
  timer = setInterval(insertTime, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function insertTime() {
  seconds++;

  if (seconds < 10) {
    seconds = `0${seconds}`; // :00 for seconds under 10
  }

  if (seconds >= 60) {
    minutes++;
    seconds = 0;
  }

  document.querySelector(".timer").textContent = minutes + ":" + seconds;
}

function winning() {
  if (matchedCards.length === allCards.length / 2) {
    //When matched cards length is equal to allCards length
    stopTimer(); // Stop the timer
    modal(); // Display scoring modal
  } else {
    console.log("Keep Trying");
  }
}

// *****Modal*****
// Upon winning, modal opens with scoring information

function modal() {
  let modal = document.getElementById("winnerModal");
  let button = document.getElementById("again");

  modal.style.display = "block";

  document.querySelector(".stopwatch").textContent = minutes + ":" + seconds;
  document.querySelector(".moveTotal").textContent = moveCount;
  document.querySelector(".starScore").textContent = starTotal;

  // On click, hide modal, reset scoring and arrays, and restart game

  button.addEventListener("click", function(e) {
    modal.style.display = "none";
    clearInterval(timer);
    seconds = 0;
    minutes = 0;
    moveCount = 0;
    matchedCards = [];
    flippedCards = [];
    starTotal = 3;
    stars[0].style.display = "block";
    stars[1].style.display = "block";
    stars[2].style.display = "block";
    startGame();
  });

  // Click the X to close modal, game does not restart

  let exit = document.querySelector(".close");
  exit.addEventListener("click", function(e) {
    modal.style.display = "none";
  });
}

// ***** Restart Button function *****

let restart = document.querySelector(".restart");
restart.addEventListener("click", function(newGame) {
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  moveCount = 0;
  matchedCards = [];
  flippedCards = [];
  stars[0].style.display = "block";
  stars[1].style.display = "block";
  stars[2].style.display = "block";
  startGame();
});

// In addition to noted assistance above, I referenced live webinar walkthrough with Mike Wales, Ryan Waite via chat and live webinar, FEND Project 2 slack channel, https://developer.mozilla.org, and https://www.w3schools.com for functions and process.

