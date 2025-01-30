export class Player {
    constructor(name, human){
        this.name = name;
        this.human = human;
        this.hand = [];
        this.lastCard = null;
        this.score = 0;
    }

    findPlayableCards(discardCard){
        const playableCards = this.hand.filter(card => card.suit == discardCard.suit || card.rank == discardCard.rank || card.rank == 8)
        const multiCards = [];
        for(let i=0;i<playableCards.length;i++){
            for(let j=0;j<this.hand.length;j++){
                if(this.hand[j].rank==playableCards[i].rank&&this.hand[j]!=playableCards[i]&&playableCards[i].rank!=8){
                    multiCards.push(playableCards[i]);               
                }
            }
        }
        return [ playableCards, multiCards ]
    }

    playableImages(cards){
        const playableImages = [];
        cards[0].forEach(card => {
            if(!cards[1].includes(card)&&card.rank!=8){
                playableImages.push(card.img)
            }
            
        })
        return playableImages;
    }

    playableImagesMulti(cards){
        const playableMultis = [];
        cards.forEach(card => {
            if(card.rank!=8){
                playableMultis.push(card.img)
            }         
        })
        return playableMultis;
    }

    notPlayableImages(playableImages, playableMultis){
        const notPlayableImages = [];
        this.hand.forEach(card => {
            if(!playableImages.includes(card.img)&&!playableMultis.includes(card.img)&&card.rank!=8){
                notPlayableImages.push(card.img)
            }
        })
        return notPlayableImages;
    }

    playableEight(cards){
        const eight = [];
        cards[0].forEach(card => {
            if(card.rank==8){
                eight.push(card.img)
            }
        });
        return eight;
    }

    removeCard(cardToRemove){
        return this.hand.filter(card => card != cardToRemove)
    }

    findLongestSuit(){
        const suits = [0,0,0,0];
        this.hand.forEach(card =>{
            if(card.suit==1){
                suits[0]++;
            } else if(card.suit==2){
                suits[1]++;
            } else if(card.suit==3){
                suits[2]++;
            } else if(card.suit==4){
                suits[3]++;
            }
        });
        const max = Math.max(...suits);
        const index = suits.indexOf(max); 
        return index+1         
    }
}
