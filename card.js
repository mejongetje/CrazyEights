export class Card {
    constructor(suit, rank, id){
        this.suit = suit;
        this.rank = rank;
        this.id = id;
        this.value = (this.rank <= 10) ? this.rank : 10;
        const cardSuites = ["\u2661", "\u2662", "\u2660", "\u2663"];
        const cardSuitesImg = "hdsc"
        const cardRanks = '23456789tjqka';  
        this.name = `${cardRanks[this.rank-2]}${cardSuites[this.suit-1]}`; 
        this.img = `images/cards/${cardSuitesImg[this.suit-1]}${cardRanks[this.rank-2]}.svg`; 
        this.imgBack = `images/cards/${cardSuitesImg[this.suit-1]}${cardRanks[this.rank-2]}back.svg`          
    }

    toString(){
        return this.name
    }
}
