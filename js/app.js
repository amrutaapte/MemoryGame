

// Object holding strings for querySelector to easily access the DOM
obj = {
    scorePanel: '.score-panel',
    stars: '.stars',
    moves: '.moves',
    restartBtn: '.restart',
    deck: '.deck',
    card: '.card',
    match: '.match',
    timer: '.timer',
    btnStart: '.btn-start',
    btnRestart: '.btn-restart',
    resultMoves: '.result-moves',
    resultStars: '.result-stars',
    resultTime: '.result-time',
};

//Computes the current total time and passes to displayTimer
const runTimer = function() {
    startTime = Date.now(); 
    timerInterval = setInterval(function() {
        totalTime = Date.now() - startTime;
        displayTimer(totalTime);
    }, 1000);
};

//Renders the time on UI in format 00:00 (MM:SS)
 const displayTimer = function(ms) {
    const formattedTime = formatTime(ms);
    document.querySelector(obj.timer).textContent = `${formattedTime.minutes}:${formattedTime.seconds}`;
};

// Resets the timer display to 00:00

const resetTimer = function() {
    displayTimer(0);
};

//Stops the timer
const stopTimer = function() {
    clearInterval(timerInterval);
};


// Converts miliseconds to an object separated as minutes and seconds (if seconds < 10, then it has a preceding 0)
const formatTime = function(ms) {
    // Convert ms to s
    const unformattedSeconds = Math.floor(ms / 1000);
    // If applies, extract amount of minutes
    const minutes = unformattedSeconds >= 60 ? Math.floor(unformattedSeconds / 60) : 0;
    // Removing the minutes and get the rest of the time as seconds
    const seconds = minutes > 0 ? unformattedSeconds - (minutes * 60) : unformattedSeconds;
    
    return {
        minutes,
        seconds: seconds < 10 ? '0' + seconds : seconds
    };
};


const cardObject = {
   
    cardImg : [ 'fa-diamond',
                'fa-anchor',
                'fa-bolt',
                'fa-leaf',
                'fa-cube',
                'fa-bicycle',
                'fa-bomb',
                'fa-paper-plane-o'],
    cardIsOpen : false,
    cradIsMatched : false,            
    cardOpen : function(currCard){
                    $(currCard).addClass('open show');
                    this.cardIsOpen = true;
               },
    cardClose : function(currCard){
                    $(currCard).removeClass('open show');
                    this.cardIsOpen = false;
                },           
    cardHTML : function(cardImage, id){
                    return `<li class="card" id="${id}" ><i class="fa ${cardImage}"></i></li>`
               },
    cardMatch : function(currCard){
                    $(currCard).addClass('match');
                    $(currCard).unbind();
                    this.cradIsMatched = true;
                }                                            
};

const deckObject = {
    cardsInDeck : [...cardObject.cardImg, ...cardObject.cardImg],
    shuffle : function(){
                    let array = this.cardsInDeck;
                    var currentIndex = array.length, temporaryValue, randomIndex;

                    while (currentIndex !== 0) {
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;
                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    }


                    return array;
              },
    shuffleDeck : function(){
                    let c = this.shuffle();

                    $(obj.card).remove();

                    let id=0;
                    c.map(function(cardImage){
                        let cardHTML = cardObject.cardHTML(cardImage, id);
                        $(obj.deck).append(cardHTML);
                        id++;
                    });        
                }          
};


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//temporary array to hold opened cards
openedCards = []; 
moves = 0;
matched = 0;   

//initialize deck 
deckObject.shuffleDeck();


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


// event handler for card click
function cardClick(){

    if(openedCards.length<2){
		
        cardObject.cardOpen(this);
        openedCards.push(this);

        //if two cards are open, compare the innerHTML and match them
        if(openedCards.length === 2){ 

        	if((openedCards[0]).getAttribute('id') !== (openedCards[1]).getAttribute('id')){
				if((openedCards[0]).innerHTML === (openedCards[1]).innerHTML ){
					cardObject.cardMatch(openedCards[0]);
                    cardObject.cardMatch(openedCards[1]);
					matched++;
                    console.log(matched);
                   	openedCards = [];			
				}
		    }else{
		    	openedCards.pop();
		    }
    	}
		moves++;
	}else{
	    	cardObject.cardClose(openedCards[0]);
            cardObject.cardClose(openedCards[1]);
	    	openedCards = [];
			openedCards.push(this);
            cardObject.cardOpen(this);
	}

    //set the number of moves on display
	$(obj.moves).text(moves);

    //start timer on first move 
    if (moves===1){
        runTimer();
    }

    //if moves get more than 28 reduce one star, when moves get more than 50 reduce to one star
    if (moves > 50){
        $('.starthree').hide();
        $('.startwo').hide();
    }else if (moves > 28){
        $('.starthree').hide();
    }

    //Show modal when all cards are matched
	if(matched === 8){
        showModal();
        matched = 0;
        stopTimer();
	}

}

//Show modal with result
function showModal(){
    $('.modal').show(); 
    $("html, body").animate({scrollTop: 0}, "slow");
    $("#final-score").append($('.timer'));
    $("#final-score").append($('.stars'));
}

//reset the game for next round
function reset(){
    deckObject.shuffleDeck();
    openedCards = [];
    $('.card').click(cardClick);
    moves = 0;
  	$(obj.moves).text(moves);
    $('.score-panel').prepend($('.stars'));
    $('.score-panel').append($('.timer'));
    $('.starthree').show();
    $('.startwo').show();
    resetTimer();
}

//Event Listeners 

//Click event on Card object
$('.card').click(cardClick);

//Reset game 
$('.fa-repeat').click(reset);

//Close button on Modal dialog
$('.close-modal').click(function() {
    $('.score-panel').prepend($('.stars'));
    $('.score-panel').append($('.timer'));
    $('.modal').hide();
});

//Reset button on Modal dialog
$('.resetbtn').click(function() {
    $('.score-panel').prepend($('.stars'));
    $('.score-panel').append($('.timer'));
    $('.modal').hide();
    $('.star-three').show();
    $('.star-two').show();

    reset();
});