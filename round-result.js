import { displayScoreHTML, calcRoundScores, calcTotals } from "./score-html";

export class RoundResult {
    constructor(winner, round){
        this.winner = winner;
        this.round = round;
        this.points = 0;
    }

    showMessage(){
        const winnerName = this.winner.name=='player'?'YOU':'OPPONENT';
        this.points = calcPoints(this)
        $('.messages').css('display', 'block').html(`${winnerName} won the round<br>
        ${winnerName} scored ${this.points} points<br>
        <span class="show-score">Show Score</span> | <span class="next-round">Play another round</span>`)
        $('.show-score').on('click', () => {
            this.showScore()
        })
        $('.next-round').on('click', () => {
            document.location.reload(true);
        })
    }

    openCards(){
        if(this.winner.name=='player'){
            $(`.opponent`).empty();
            let left = 120-(this.round.players[1].hand.length*15);
            let z = 1;               
            this.round.players[1].hand.forEach( card => { 
                $(`.opponent`).append(`<img src="${card.img}" class="opponent-card${z}">`);
                $(`.opponent-card${z}`).css({
                    'left': left,
                    'top': '20px',
                    'zIndex': z,
                    'position': 'absolute'
                });
                left += 30;
                z++;
            });  
        } else {
            return false;
        }
    }

    updateScore(){
        let round = JSON.parse(localStorage.getItem('round-c8'));
        round++
        localStorage.setItem('round-c8', JSON.stringify(round));
        const roundNumber = 'round' + round;
        let roundResult = {
            [roundNumber]: {'you': this.round.players[0].score, 
            'opponent': this.round.players[1].score}
        };
        let scoreSheet = JSON.parse(localStorage.getItem('score-c8'));
        if(scoreSheet==null){
            scoreSheet = {};
        }
        Object.assign(scoreSheet, roundResult)
        localStorage.setItem('score-c8', JSON.stringify(scoreSheet));
        const gameOver = checkGameOver(this.round.players);
        if(gameOver){
            setTimeout(()=> {
                wrapUpGame(gameOver);
            }, 2000)          
        }         
    }

    showScore(){
        $('.scoreboard').css('display', 'block');
        const score = getScore();
        displayScoreHTML(score)
        $('.cross').on('click', () => {
            $('.scoreboard').css('display', 'none')
        })
    }
}

function showScore(){
    $('.scoreboard').css('display', 'block');
    const score = getScore()
    displayScoreHTML(score)
    $('.cross').on('click', () => {
        $('.scoreboard').css('display', 'none')
    })
}

function getScore(){
    const score = JSON.parse(localStorage.getItem('score-c8'))
    return score
}

function calcPoints(result){
    const loser = result.winner==result.round.players[0]?result.round.players[1]:result.round.players[0];
    let points = 0;
    loser.hand.forEach(card => {
        if(card.value==8){
            points += 50;
        } else {
            points += card.value;
        }    
    })
    result.winner.score = points;
    return points;
}

function checkGameOver(players){
    const score = getScore();
    const roundScores = calcRoundScores(score);
    const totals = calcTotals(roundScores[0], roundScores[1])
    if(totals[0]>=100){
        return players[0]
    } else if (totals[1]>=100){
        return players[1]
    }
    return false;
}

function wrapUpGame(winner){
    const winnerName = winner.name=='player'?'YOU':'OPPONENT'
    showScore();
    $('.cross').css('display', 'none');
    $('.scoreboard').append(`<div class="winner-text"><b>${winnerName}</b> won the Game!!</div>
    <div class="next-game">Play another Game</div>`)
    $('.next-game').on('click', () => {
        document.location.reload(true);
        localStorage.clear()
    })
}

export { showScore}