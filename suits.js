function getSuits(){
    $('.suit-options').html(
        `<div class="suits-container">
            <div class="suits-hearts">&#9829;</div>
            <div class="suits-spades">&#9824;</div>
            <div class="suits-diamonds">&#9830;</div>
            <div class="suits-clubs">&#9827;</div>
        </div>`
    )
}


export { getSuits }