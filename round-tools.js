import { animateDrawCard, sortHand, addStatusToCards, animatePlayerCard, botPlayEightSupport, 
    animateBotCard, animateBotDrawCard } from './round';
import { getSuits } from "./suits";

//animation linear...

function drawTwoCards(round){
    $('.messages').css('display', 'block').html(`Your opponent's last card is a 2 <br> You must draw 2 cards<br> Just click the deck once...`);
    let cardIndex = round.board.restOfDeck.length-1;
    $(`.deck-card${cardIndex}`).on('click', () => {
        let i = 0;
        const Timer = setInterval(() => {          
            if(i==2){
                clearInterval(Timer);
            } else {
                let deckCard = round.board.restOfDeck.pop();
                round.players[0].hand.push(deckCard);
                animateDrawCard(cardIndex-i, deckCard, round.players[0]);
            }
            i++;
        }, 500);
        setTimeout(() => {
            sortHand(round.players[0]);
            setTimeout(() => {
                round.playerTurn();
                return false;    
            }, 1550)         
        }, 1250);                           
    })
}

function drawTwoCardsBot(round){
    $('.messages').css('display', 'block').html(`Opponent must draw two cards...`)
    const cards = $('.rest-deck').children()
    for(let i=0; i<2; i++){
        let card = round.board.restOfDeck.pop();
        round.players[1].hand.push(card)
        cards.each(function() {
            if(card.imgBack == this.src.slice(-30)){           
                $(`.${this.className}`).animate({opacity: 0.35, width: '20%', left: '250px', top: '-120px'}, 400, function(){
                        this.remove();
                })
            }
        })
    }
    setTimeout(()=> {
        sortHand(round.players[1]);
        round.botTurn();
        return false;
    }, 1500);    
}

function playCard(cards, round){  
    addStatusToCards(cards, round.players[0]);
    $('.not-playable-card').on('click', () => {
        $(`.messages`).css('display', 'inline-block').text('Play another card...');
    })
    $('.eight-card').on('click', e => {
        playEight(e, round);
        return false;
    })
    $('.multi-card').on('click', e => {
        playMultiCards(e, round);
        return false;
    })
    $('.playable-card').on('click', e => {
        $('.player').children().off('click');
        $('.messages').css('display', 'none');
        const card = round.players[0].hand.find( c => c.img == e.target.src.slice(-26));
        round.discardCards.unshift(card);
        if(card.rank==2){
            round.twos++
        }
        round.players[0].lastCard = card
        round.players[0].hand = round.players[0].hand.filter(c => c != card)         
        animatePlayerCard(e, card, round.discardCards);
        setTimeout(() => {
            sortHand(round.players[0])
            round.whoIsNext();
        }, 2000);
        return false;
    })
}

function drawCard(round){
    round.count++;
    if(round.count==4){
        $('.messages').html(`You have no card to play<br>
        You have to PASS...`)
        setTimeout(() => {
            round.whoIsNext();
        }, 1500)
        
        return false;
    }
    $(`.messages`).css('display', 'inline-block').html(`You have no cards to play
    <br>You must draw a card.`);
    const cardIndex = round.board.restOfDeck.length-1;
    $(`.deck-card${cardIndex}`).on('click', e => {
        const deckCard = round.board.restOfDeck.pop()
        round.players[0].hand.push(deckCard)
        animateDrawCard(cardIndex, deckCard, round.players[0]);
        setTimeout(() => {
            sortHand(round.players[0]);
            setTimeout(() => {
                round.playerTurn();    
            }, 1250)    
        }, 500);                                     
    })
}


function playMultiCards(e, round){
    $('.messages').html(`You can play more cards of the same rank<br>
    Click the other card(s) and click 'Play'<br>
    <span class="play-multi-cards">PLAY</span>`)
    const multiCards = [];
    const multiImages = []
    $(`.${e.currentTarget.className.slice(0,13)}`).css('top', '-15px');
    $('.player').children().off('click')
    const chosenCard = round.players[0].hand.find( c => c.img == e.target.src.slice(-26));
    multiCards.push(chosenCard);
    multiImages.push(e)
    const sameRank = round.players[0].hand.filter(card => card.rank == chosenCard.rank && card != chosenCard);
    const sameRankImages = []
    sameRank.forEach( card => {
        sameRankImages.push(card.img)
    })
    const children = $('.player').children();
    for(let i=0; i<children.length;i++){
        if(sameRankImages.includes(children[i].src.slice(-26))){
            $(children[i]).addClass('same-rank');
        }
    }
    $('.same-rank').on('click', e => {
        $(`.${e.currentTarget.className.slice(0,13)}`).css('top', '-15px');
        const sameRankCard = round.players[0].hand.find( c => c.img == e.target.src.slice(-26));
        multiCards.push(sameRankCard);
        multiImages.push(e)
    });
    $('.play-multi-cards').on('click', () => {
        for(let i=0;i<multiCards.length;i++){
            round.players[0].hand = round.players[0].removeCard(multiCards[i]);
            round.players[0].lastCard = multiCards[i]
            if(multiCards[i].rank==2){
                round.twos++
            }
            round.discardCards.unshift(multiCards[i])
            $(`.${multiImages[i].currentTarget.className.slice(0,13)}`).animate({opacity: 0.35, left: '250px', top: '-158px'}, 400, function(){
                multiImages[i].currentTarget.remove();
                $('.discard-box').append(`<img src="${multiImages[i].target.src.slice(-26)}" class="discard-card">`);
                $('.discard-card').css({
                    'top': `5vh`,
                    'left': `2vh`,
                    'position': 'absolute',
                    'zIndex': `${i}`
                });                           
            }); 
        }
        setTimeout(()=> {
            $('.messages').css('display', 'none');
            sortHand(round.players[0]);
            round.whoIsNext();
            return false;
        }, 1000+(500*multiCards.length))
    })
}

function playEight(e, round){
    const card = round.players[0].hand.find( c => c.img == e.target.src.slice(-26));
    round.discardCards.unshift(card);
    round.players[0].hand = round.players[0].hand.filter(c => c != card)
    round.players[0].lastCard = card;  
    animatePlayerCard(e, card, round.discardCards);
    if(round.players[0].hand.length==0){
        round.whoIsNext();
        return false;
    }
    $('.suit-options').css('display', 'block');
    getSuits();
    $('.messages').text('Choose your suit...')
    $('.suits-hearts').on('click', () => {
        round.changeSuit(1);
        return false;
    });
    $('.suits-spades').on('click', () => {
        round.changeSuit(3);
        return false;
    });
    $('.suits-diamonds').on('click', () => {
        round.changeSuit(2);
        return false;
    });
    $('.suits-clubs').on('click', () => {
        round.changeSuit(4);
        return false;
    })
}


function botPlayEight(cards, round){
    botPlayEightSupport(cards[0], round.players[1], round.discardCards);
    setTimeout(()=> {
        round.whoIsNext();
        $('.new-suit-hearts, .new-suit-diamonds, .new-suit-spades, .new-suit-clubs').css('display', 'none');
    }, 2000)
}

function botPlayCard(cards, round){
    let i = 0;             
    const Timer = setInterval(() => {
        if(i==cards.length){
            clearInterval(Timer);
        } else {
            round.discardCards.unshift(cards[i]);
            round.players[1].hand = round.players[1].hand.filter(c => c != cards[i]);
            round.players[1].lastCard = cards[i];
            if(cards[i].rank==2){
                round.twos++
            }
            animateBotCard(cards[i], round.discardCards);
        }  
        i++;             
    },500);             
    setTimeout(() => {
        sortHand(round.players[1]);
        round.whoIsNext();
    }, 1000+(cards.length*500)); 
}

function botDrawCard(round){
    $('.messages').css('display', 'block').html(`Opponent has no card to play<br>
    She must draw a card...`) 
    round.count++;
    if(round.count==4){
        setTimeout(() => {
            $('.messages').text('OPPONENT PASSES...')
            round.whoIsNext();
        }, 1800);        
        return false;
    }
    const card = round.board.restOfDeck.pop(); 
    round.players[1].hand.push(card)
    animateBotDrawCard(card); 
    sortHand(round.players[1]);
    round.botTurn();
}

export { drawTwoCards, drawTwoCardsBot, playCard, drawCard, botPlayEight, botPlayCard, botDrawCard }