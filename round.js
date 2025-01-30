import { selectBestCard } from "./comp-algo";
import { RoundResult } from "./round-result";
import { drawTwoCards, drawTwoCardsBot, playCard, drawCard, botPlayEight, 
    botPlayCard, botDrawCard } from "./round-tools";

export class Round {
    constructor(players, board, active){
        this.players = players;
        this.board = board;
        this.active = active;
        this.discardCards = [this.board.topCard[0]];
        this.count = 0;
        this.twos = 0;
    }

    whoIsNext(){
        this.count=0;
        for(let i=0; i<2; i++){
            if(this.players[i].hand.length==0){
                endingRound(this.players[i], this);
                return false;
            }
        }
        if(this.board.restOfDeck.length<=4){
            this.board.restOfDeck = makeNewStockPile(this.board.restOfDeck, this.discardCards);
        }
        if(this.active=='player'){
            setTimeout(() => {
                this.lastCardCheck();
                this.active = 'opponent'; 
            }, 250)                             
        } else {
            setTimeout(()=>{
                this.lastCardCheckBot();
                this.active = 'player';   
            },450)                       
        }
    }

    lastCardCheck(){
        if(this.discardCards[0].rank==2&&this.discardCards[0]!=this.players[0].lastCard){
            setTimeout(() => {
                drawTwoCards(this);
            }, 750)
        } else {
            setTimeout(()=>{
                this.playerTurn();
            }, 750)
            
        }       
    }

    lastCardCheckBot(){
        if(this.discardCards[0].rank==2&&this.discardCards[0]!=this.players[1].lastCard){
            setTimeout(()=> {
                drawTwoCardsBot(this);    
            }, 750);     
        } else {
            setTimeout(() => {
                this.botTurn();
            }, 750);           
        }
    }

    playerTurn(){     
        const cards = this.players[0].findPlayableCards(this.discardCards[0]);
        if(cards[0].length==0){
            drawCard(this);
        } else {
            $(`.messages`).css('display', 'inline-block').text('It is your turn.');
            playCard(cards, this);
        }       
    }

    botTurn(){
        const cards = selectBestCard(this.players[1].hand, this);
        if(cards.length>0&&cards[0].rank==8){
            botPlayEight(cards, this)
            return false;
        }
        else if (cards.length>=1){
            botPlayCard(cards, this);  
            return false;         
        } else { 
            botDrawCard(this);
            return false;     
        }        
    }

    changeSuit(suit){
        $('.suit-options').css('display', 'none');
        this.discardCards.unshift({'suit': suit, 'rank': 8, 'value': undefined})
        sortHand(this.players[0]);
        this.whoIsNext();
    }
}

function animatePlayerCard(e, discardCard, discardCards){
    $(`.${e.currentTarget.className.slice(0,13)}`).animate({opacity: 0.35, left: '250px', top: '-158px'}, 400, function(){
        e.target.remove();
        $('.discard-box').append(`<img src="${discardCard.img}" class="discard-card">`);
        $('.discard-card').css({
            'top': `5vh`,
            'left': `2vh`,
            'position': 'absolute',
            'zIndex': `${discardCards.length}`
        });       
    }); 
}

function animateBotCard(card, discardCards){
    const cards = $(`.opponent`).children();
    cards.each(function() {
        if(card.imgBack == this.src.slice(-30)){           
            $(`.${this.className}`).animate({opacity: 0.35, left:'250px', top: '150px'}, 300, function(){
                    $(`.discard-box`).append(`<img src="${card.img}" class="discard-card">`);
                    $('.discard-card').css({
                        'top': `5vh`,
                        'left': `2vh`,
                        'position': 'absolute',
                        'zIndex': `${discardCards.length}`
                    }); 
                    this.remove();           
            })
        }
    })
}

function sortHand(player){
    $(`.${player.name}`).empty();
    let left = 35-(player.hand.length*2.5);
    let z = 1;               
    player.hand.forEach( card => { 
        const cardImg = player.name=='player'?card.img:card.imgBack 
        let leftSide = `${left}vmin`
        $(`.${player.name}`).append(`<img src="${cardImg}" class="${player.name}-card${z}">`);
        $(`.${player.name}-card${z}`).css({
            'left': leftSide,
            'top': '20px',
            'zIndex': z,
            'position': 'absolute'
        });
        left += 6;
        z++;
    })  
}

function addStatusToCards(cards, player){
    const eightImage = player.playableEight(cards)
    const multiCards = player.playableImagesMulti(cards[1])
    const playableCards = player.playableImages(cards);
    const notPlayableCards = player.notPlayableImages(playableCards, multiCards);
    const children = $('.player').children();
    for(let x=0; x<children.length;x++){
        if(eightImage.includes(children[x].src.slice(-26))){
            $(children[x]).addClass('eight-card')
        }
    }
    for(let i=0; i<children.length;i++){
        if(multiCards.includes(children[i].src.slice(-26))){
            $(children[i]).addClass('multi-card')
        }
    }
    for(let j = 0; j<children.length;j++){
        if(playableCards.includes(children[j].src.slice(-26))){
            $(children[j]).addClass('playable-card')
        }
    }
    for(let k = 0; k<children.length;k++){
        if(notPlayableCards.includes(children[k].src.slice(-26))){
            $(children[k]).addClass('not-playable-card')
        }
    }
}

function animateDrawCard(cardIndex, deckCard, player){
    const left = 20 + (player.hand.length*5);
    let leftSide = `${left}vw`
    $(`.deck-card${cardIndex}`).animate({opacity: 0.25, width: "20%", left: '170px', top: '280px'}, 400, 'linear', function(){
        $(`.deck-card${cardIndex}`).remove();    
    });
    $(`.player`).append(`<img src="${deckCard.img}" class="draw-card">`);
    $(`.draw-card`).css({
        'top': `20px`,
        'left': leftSide,
        'position': 'absolute',
        'zIndex': `100`
    });       
    setTimeout(()=>{
        $(`.draw-card`).remove()
    },400)      
}

function animateBotDrawCard(card){
    const cards = $('.rest-deck').children()
    cards.each(function() {
        if(card.imgBack == this.src.slice(-30)){           
            $(`.${this.className}`).animate({opacity: 0.25, width: '20%', left: '250px', top: '-120px'}, 400, 'linear', function(){
                    this.remove();
            })
        }
    })
}

function botPlayEightSupport(cardToPlay, player, discards){
    player.hand = player.hand.filter(card => card != cardToPlay)
    player.lastCard = cardToPlay;
    const longestSuit = player.findLongestSuit();
    discards.unshift({'suit': longestSuit, 'rank': 8, 'value': undefined});
    animateBotCard(cardToPlay, discards);
    const newSuit = longestSuit==1?'hearts':longestSuit==2?'diamonds':longestSuit==3?'spades':'clubs'
    $(`.new-suit-${newSuit}`).css('display', 'block')
    sortHand(player)
}

function makeNewStockPile(restOfDeck, discardCards){
    restOfDeck = restOfDeck.concat(discardCards.slice(1,discardCards.length-1));
    discardCards = discardCards.slice(0,1)
    $('.rest-deck').empty();
    restOfDeck = reShuffle(restOfDeck);
    redealRestOfDeck(restOfDeck)
    return restOfDeck;
}

function reShuffle(deck){
    deck = cleanUpDeck(deck)
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [deck[i], deck[j]] = [deck[j], deck[i]];
        };
    return deck;
}

function redealRestOfDeck(deck){
    let i=0;
    let j=35;
    let left = 170;
    deck.forEach(card =>{
        $('.rest-deck').append(`<img src="${card.imgBack}" class="deck-card${i}"></img>`)
        $(`.deck-card${i}`).css({
            'zIndex': i,
            'top': `${j}px`,
            'left': `${left}px`,
            'position': 'absolute'
        })
        i++;
        j += -0.25;
        left += -0.25;        
    })
}

function cleanUpDeck(deck){
    const cleanDeck = deck.filter(card => card.value != undefined);
    return cleanDeck
}

function endingRound(player, round){
    const rr = new RoundResult(player, round);
    rr.showMessage();
    rr.openCards();
    rr.updateScore();
}

export { animateDrawCard, sortHand, addStatusToCards, animatePlayerCard, animateBotCard, 
    animateBotDrawCard, botPlayEightSupport }