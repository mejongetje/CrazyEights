import { Deck } from './deck';

export class Dealer {
    constructor (){
        this.deck = new Deck;
        this.playDeck = JSON.parse(JSON.stringify(this.deck.deck));
        this.hands = [];
        this.topCard = [];
        this.restOfDeck= [];
    }

    shuffleDeck(){
        //Method shuffles an array of cards according to the Fisher-Yates shuffle algorithm 
        for (let i = this.playDeck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [this.playDeck[i], this.playDeck[j]] = [this.playDeck[j], this.playDeck[i]];
            };
    }

    dealCards(){
        dealCardsBTS(this.playDeck, this.hands); 
        dealRestOfDeckBTS(this.playDeck, this.topCard, this.restOfDeck) 
        let leftSide = 20; 
        let z = 0;      
        const Timer = setInterval(() => {  
            let i = Math.trunc(z/2);         
            if(z==14){
                dealTopCard(this.topCard[0])
                dealRest(this.restOfDeck)
                clearInterval(Timer);
            } else if (z%2==1){       
                dealCardNorth(this.hands[1][i], leftSide, z);
                leftSide += 6;
            } else {
                dealCardSouth(this.hands[0][i], leftSide, z);                
            }
            z++;
        }, 80);           
    }
}

function dealCardsBTS(deck, hands){
    for(let i=0; i<2; i++){
        let hand = [];
        for(let j=0; j<7; j++){
            hand.push(deck[j*2+i]);
        }
        hands.push(hand);
    }
}

function dealRestOfDeckBTS(deck, topCard, pile){
    topCard.push(deck.pop());
    for(let i=0; i<37; i++){
        pile.push(deck.pop());
    }
}

function dealCardNorth(card, left, z){
    let leftSide = `${left}vmin`
    $('.opponent').append(`<img src="${card.imgBack}" class="opponent-card${z}">`);
        $(`.opponent-card${z}`).css({
            'left': leftSide,
            'top': '20px',
            'zIndex': z,
            'position': 'absolute'
        });
}

function dealCardSouth(card, left, z){
    let leftSide = `${left}vmin`
    $('.player').append(`<img src="${card.img}" class="player-card${z}">`);
        $(`.player-card${z}`).css({
            'left': leftSide,
            'top': '20px',
            'zIndex': z,
            'position': 'absolute'
        });
}

function dealTopCard(card){
    $('.discard-box').append(`<img src="${card.img}" class="top-card"></img>`);
    $('.top-card').css({
        'top': `5vh`,
        'left': `2vh`,
        'position': 'absolute'
    })
}

function dealRest(restOfDeck){
    let i=0;
    let j=35;
    let left = 80;
    restOfDeck.forEach(card =>{
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

