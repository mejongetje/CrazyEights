function displayScoreHTML(score){
    const roundScores = calcRoundScores(score)
    const totals = calcTotals(roundScores[0],roundScores[1])
    $('.scoreboard').html(`<div class="cross">
    <span class="close">X</span>
    </div>
    <div class="score-title">SCORE SHEET</div><br>
    <div class="score-container">   
        <div class="score-round">Round</div>
        <div class="score-player-name">YOU</div>
        <div class="score-opponent-name">OPPONENT</div>
        <div class="score-round">1</div>
        <div class="score-player">${roundScores[0][0]}</div>
        <div class="score-opponent">${roundScores[1][0]}</div>
        <div class="score-round">2</div>
        <div class="score-player">${roundScores[0][1]}</div>
        <div class="score-opponent">${roundScores[1][1]}</div>
        <div class="score-round">3</div>
        <div class="score-player">${roundScores[0][2]}</div>
        <div class="score-opponent">${roundScores[1][2]}</div>
        <div class="score-round">4</div>
        <div class="score-player">${roundScores[0][3]}</div>
        <div class="score-opponent">${roundScores[1][3]}</div>
        <div class="score-round">5</div>
        <div class="score-player">${roundScores[0][4]}</div>
        <div class="score-opponent">${roundScores[1][4]}</div>
        <div class="score-round">6</div>
        <div class="score-player">${roundScores[0][5]}</div>
        <div class="score-opponent">${roundScores[1][5]}</div>
        <div class="score-round">7</div>
        <div class="score-player">${roundScores[0][6]}</div>
        <div class="score-opponent">${roundScores[1][6]}</div>
        <div class="score-round">8</div>
        <div class="score-player">${roundScores[0][7]}</div>
        <div class="score-opponent">${roundScores[1][7]}</div>
        <div class="score-round">9</div>
        <div class="score-player">${roundScores[0][8]}</div>
        <div class="score-opponent">${roundScores[1][8]}</div>
        <div class="score-round">10</div>
        <div class="score-player">${roundScores[0][9]}</div>
        <div class="score-opponent">${roundScores[1][9]}</div>
        <div class="score-total">Total</div>
        <div class="score-player-total">${totals[0]}</div>
        <div class="score-opponent-total">${totals[1]}</div>
    </div>`);
}

function sumOf(array){
    let sum = array.reduce(function(acc, obj){
        return acc + obj;
    }, 0);
    return sum;
}

function calcRoundScores(score){
    let playerScore = [0,0,0,0,0,0,0,0,0,0,0,0];
    let opponentScore = [0,0,0,0,0,0,0,0,0,0,0,0];
    let i = 0;
    for(let key in score){
        playerScore[i] = score[key]['you'];
        opponentScore[i] = score[key]['opponent'];
        i++;
    }  
    return [ playerScore, opponentScore ];
}

function calcTotals(youScore, opponentsScore){
    const playerTotal = sumOf(youScore);
    const opponentsTotal = sumOf(opponentsScore);
    return [playerTotal, opponentsTotal]
}



export { displayScoreHTML, calcRoundScores, calcTotals }