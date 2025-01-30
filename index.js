import { Player } from './player';
import { Dealer } from './dealer';
import { Round } from './round';
import { showScore } from './round-result';
import { calcRoundScores, calcTotals } from "./score-html";

function startRound(){
    $('.control').css('display', 'none');
    $('.hero-outer').css('gridTemplateColumns', '1fr');
    clearLocalStorage()
    const p1 = new Player('player', true); 
    const p2 = new Player('opponent',  false);
    const players = [p1,p2]; 
    const roundNumber = checkRoundNumber()
    const active = roundNumber%2==0?'player':'opponent'
    const d = new Dealer();
    d.shuffleDeck();
    d.dealCards();  
    setTimeout(() => { 
        p1.hand = d.hands[0];
        p2.hand = d.hands[1];
        const r = new Round(players, d, active);
        r.whoIsNext()  
       
    }, 2000);

}

$('.buttons').on('click', () => {
    startRound();
    //localStorage.clear()
})

$('.score').on('click', () => {
    showScore()
})

function checkRoundNumber(){
    let round = JSON.parse(localStorage.getItem('round-c8'));
        if(round==null){
            round = 0;
            localStorage.setItem('round-c8', JSON.stringify(round))
        } else if(round==11){
            localStorage.clear()
        }
    return round;
}

function clearLocalStorage(){
    const scores = JSON.parse(localStorage.getItem(`score-c8`));
    if(scores){
        const roundScores = calcRoundScores(scores);
        const totals = calcTotals(roundScores[0], roundScores[1]);
        if(Math.abs(totals[0])>=100||Math.abs(totals[1])>=100){
            localStorage.clear()
        }
    }  
}

$('.close-ad').on('click', ()=>{
    $('.mobile-ad, .close-ad').css('display', 'none');
})