function selectBestCard(hand, round){
    const cards = [];
    let multiCards = [];
    let playableCards = hand.filter(card => card.suit == round.discardCards[0].suit || card.rank == round.discardCards[0].rank || card.rank ==8)  
    if(playableCards.length>=1){
        playableCards = moveEightToLast(playableCards)
        cards.push(playableCards[0]);
    }
    multiCardsCheck(hand, playableCards, multiCards)
    if(multiCards.length>0){
        multiCards = multiCards.slice(0,2)
        return multiCards
    } 
    return cards;
}

function multiCardsCheck(hand, playableCards, multiCards){
    for(let i=0;i<playableCards.length;i++){
        for(let j=0; j<hand.length;j++){
            if(playableCards[i].rank==hand[j].rank&&playableCards[i]!=hand[j]&&playableCards[i].rank!=8){
                multiCards.push(playableCards[i])
                multiCards.push(hand[j])
            }
        }
    }
}

function moveEightToLast(cards){
    if(cards.length>1&&cards[0].rank==8){
        return cards.reverse()
    }
    return cards;
}


export { selectBestCard }