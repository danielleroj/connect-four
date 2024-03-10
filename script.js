
   
/*----- constants -----*/
const COLOR_LOOKUP = {
    "1": "purple",
    "-1": "orange",
    "null": "white"
};

/*----- state variables -----*/
let board;
let winner;
let turn;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h1");
const playAgainBtn = document.querySelector("button");
const markerEls =  Array.from(document.querySelectorAll("#markers > div"));
// const markerELs = [...document.querySelectorAll(#markers > div)];
// ^ this is a newer syntax feature

/*----- event listeners -----*/
playAgainBtn.addEventListener("click", init); //init resets everything
document.getElementById("markers").addEventListener("click", handleDrop);

/*----- functions -----*/
init ();

function init() {
    board = [
        [null, null, null, null, null, null], // col 0
        [null, null, null, null, null, null], // col 1
        [null, null, null, null, null, null], // col 2
        [null, null, null, null, null, null], // col 3
        [null, null, null, null, null, null], // col 4
        [null, null, null, null, null, null], // col 5
        [null, null, null, null, null, null], // col 6
    ];

    winner = null; // null represents no winner no tie; game in progress.
    turn = 1; // Purple or "Player 1" will be the first player to go

    render(); // transfer the intial state to the DOM
}

function handleDrop(evt) {
    // find the column index that each clicked marker pertains to
    // we have a list of marker elements in a nodeList named markerEls
    // each oth those marker elements contains an index position
    // we can use those position values to determine which column array 
    // to add a 1 or -1 to
    const colIdx = markerEls.indexOf(evt.target);
    if(colIdx === -1) return;
    const colArr = board[colIdx];
    const rowIdx = colArr.indexOf(null);
    colArr[rowIdx] = turn;
    winner = checkWinner(colIdx, rowIdx);
    turn *= -1;
    render();
}

function checkWinner(colIdx, rowIdx) {
    // check four in a row vertical
    return checkVerticalWin(colIdx, rowIdx) ||
    checkNeSwWin(colIdx, rowIdx) ||
    checkNwSeWin(colIdx, rowIdx)
}

function checkNeSwWin(colIdx, rowIdx) {
    const adjCountNE = checkAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = checkAdjacent(colIdx, rowIdx, -1, -1);
    return adjCountNE + adjCountSW >= 3 ? board[colIdx][rowIdx] : null;
}

function checkNwSeWin(colIdx, rowIdx) {
    const adjCountNW = checkAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSE = checkAdjacent(colIdx, rowIdx, 1, -1);
    return adjCountNW + adjCountSE >= 3 ? board[colIdx][rowIdx] : null;
}

function checkVerticalWin(colIdx, rowIdx) {
    const adjCount = checkAdjacent(colIdx, rowIdx, 0, -1);
    return adjCount === 3 ? board[colIdx][rowIdx] : null;
}

function checkAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    let count = 0;
    const playerValue = board[colIdx][rowIdx];

    // perform the offset to begin adjacent cells
    colIdx += colOffset;
    rowIdx += rowOffset;

    while(board[colIdx] && board[colIdx][rowIdx] === playerValue) {
        count++
        colIdx += colOffset
        rowIdx += rowOffset
    }
    return count;
}

function render() {
    renderBoard(); // transfer state "data" from the board 2d array to the brower's dom
    renderMessage(); //display whose turn or who won based on turn or winner state
    renderControls(); //show/hide game controls based on win state
}

function renderControls() {
    playAgainBtn.style.visibility = winner ? "visible" : "hidden";
    //                         <condition> ? <evaluated if true> : <evaluated if false>
    markerEls.forEach(function(markerEl, idx) {
        const hideMarker = !board[idx].includes(null) || winner;
        markerEl.style.visibility = hideMarker ? "hidden" : "visible";
    }); 
}

function renderMessage() {
    if(winner === "T") {
        // display tie game
        messageEl.innerText = "Tie Game!"
    } else if(winner) {
        // display who won
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[winner]}">${COLOR_LOOKUP[winner]}</span> Wins!`;
    } else {
        // display the turn
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[turn]}">${COLOR_LOOKUP[turn]}'s</span> Turn`;
    }
}

function renderBoard() {
    // loop over the board array
    board.forEach(function(colArray, colIdx) {
        // for each column array inside the board array
        colArray.forEach(function(cellValue, rowIdx) {
            // we'll evalute each cell value and use that value to set the background color
            // of the each corresponding cell div in the dom
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLOR_LOOKUP[cellValue];
        });
    });
}