let gameLoop = setInterval(updatePosition, 100);

document.addEventListener('DOMContentLoaded', function() {
    placePlayer();
    placeTreat();
    displayHighScore();

    
});
let currentDirection = '';
let newDirection = '';
var board = document.querySelector('.grid-container');
var gridSize = 25;
var cellSize = board.offsetWidth/(gridSize + 0.55);
var treatStatus = false;
let count = 0;
let lastDirectionChangeTime = 0;
const throttleInterval = 100; 
var countDisplay = document.querySelector('#score');
countDisplay.textContent = 'Score : ' + count;
for (let i = 0.3; i < gridSize; i++) {
    for (let j = 0.3; j < gridSize; j++) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = cell.style.height = cellSize + 'px';
        cell.style.left = j * cellSize + 'px';
        cell.style.top = i * cellSize + 'px';
        cell.id = `coord-${i}-${j}`;
        board.appendChild(cell);
    }   
}
document.addEventListener('keydown', function(event){
    const now = Date.now();
    
    if (now - lastDirectionChangeTime > throttleInterval){

        switch(event.key){
            case 'ArrowUp':
                newDirection = 'up';
                break;
            case 'ArrowDown':
                newDirection = 'down';
                break;
            case 'ArrowLeft':
                newDirection = 'left';
                break;
            case 'ArrowRight':
                newDirection = 'right';
                break;
            default:
                console.log('rien qui se passe');
                break;
        }
    }
    if(checkDirection()){
        currentDirection = newDirection;
        lastDirectionChangeTime = now;
    }
});
let playerY,playerX;
let treatX, treatY;
function placePlayer(){
    playerX = Math.floor(Math.random() * 24) + 0.3;
    playerY = Math.floor(Math.random() * 24) + 0.3; 
    var initCoords = document.getElementById(`coord-${playerX}-${playerY}`); 
    if (initCoords){
        initCoords.classList.add('player');
    }
    tabCoords[0] = [(playerX, playerY)];
}

function placeTreat(){
    treatX = Math.floor(Math.random() * 24) + 0.3;
    treatY = Math.floor(Math.random() * 24) + 0.3; 
    var initCoords = document.getElementById(`coord-${treatX}-${treatY}`); 
    if (initCoords){
        initCoords.classList.add('treat');
    }
}
var tabCoords = [];
var isEat = false;
function movePlayer(newX, newY){
    let index = tabCoords.length - 2 - count;
    let newCoord = tabCoords[index];
    var oldCoord = document.getElementById(`coord-${newCoord[0]}-${newCoord[1]}`);
    var oldCoordTreat = document.getElementById(`coord-${treatX}-${treatY}`);
    if (oldCoordTreat === oldCoord){ 
        count++;
        checkAndUpdateHighScore(count);
        countDisplay.textContent = 'Score : ' + count;
        oldCoordTreat.classList.remove('treat');
        if(oldCoordTreat.classList.contains('player')) oldCoordTreat.classList.remove('player');
        placeTreat();
    }
    if(oldCoord){
        oldCoord.classList.remove('player');
    }
    var initCoords = document.getElementById(`coord-${newX}-${newY}`); 
    if (newX >= 0.3 && newY >= 0.3 && newX < gridSize && newY < gridSize && isSelfEat(tabCoords, index) === false){
        playerX = newX;
        playerY = newY;
    }
    else {
        alert('Position invalide');
        clearInterval(gameLoop);
        resetGame();
    }
    if (initCoords){
        initCoords.classList.add('player');
    }
}
function updatePosition(){
    let newX = playerX;
    let newY = playerY;
    switch(currentDirection) {
        case 'up':
            newX -= 1;
            break;
        case 'down':
            newX += 1;
            break;
        case 'left':
            newY -= 1;
            break;
        case 'right':
            newY += 1;
            break;
        default:
            break;
    }
    newX = parseFloat(newX.toFixed(1)); 
    newY = parseFloat(newY.toFixed(1));
    tabCoords.push([newX, newY]);
    let index = tabCoords.length - 1;
    let newCoord = tabCoords[index];
    movePlayer(newCoord[0], newCoord[1]);
}

function resetGame(){
     window.location.reload();
}
function checkDirection(){
    if (currentDirection === 'up' && newDirection === 'down'){
        return false;
    }
    if (currentDirection === 'down' && newDirection === 'up'){
        return false;
    }
    if (currentDirection === 'left' && newDirection === 'right'){
        return false;
    }
    if (currentDirection === 'right' && newDirection === 'left'){
        return false;
    }
    return true;
}
function isSelfEat(tab, index) {
    for (let i = index; i < tab.length - 2; i++) {
        for (let j = i + 1; j < tab.length; j++) { 
  
            if (tab[j][0] === tab[i][0] && tab[j][1] === tab[i][1]) {
                return true;
            }
        }
    }
    return false;
}
function updateHighScore(newScore) {
    localStorage.setItem('highScore', newScore.toString());
}
function getHighScore() {
    const highScore = localStorage.getItem('highScore');
    return highScore ? parseInt(highScore) : 0; 
}
function displayHighScore() {
    const highScore = getHighScore();
    document.querySelector('#Highscore').textContent = `High Score: ${highScore}`;
}
function checkAndUpdateHighScore(currentScore) {
    const highScore = getHighScore();
    if (currentScore > highScore) {
        updateHighScore(currentScore);
        displayHighScore(); 
    }
}
function addPlayerTag(newX, newY){
    var initCoords = document.getElementById(`coord-${newX}-${newY}`); 
    if (initCoords){
        initCoords.classList.add('player');
    }
}
function removeTreat(pX, pY){
    var oldCoord = document.getElementById(`coord-${pX}-${pY}`);
    var oldCoordTreat = document.getElementById(`coord-${treatX}-${treatY}`);

    if (oldCoordTreat === oldCoord){ 
        count++;
        countDisplay.textContent = 'Score : ' + count;
        oldCoordTreat.classList.remove('treat');
        placeTreat();
        
    }
}

function removePlayer(pX, pY){
    var oldCoord = document.getElementById(`coord-${pX}-${pY}`);

    if(oldCoord){
        oldCoord.classList.remove('player');
    }
}
var tabNewCells = [];
function addCellToPlayer(){
    let effectiveCount = Math.min(count + 1, tabCoords.length); 
    for (let i = 1; i < effectiveCount; i++) {
        let index = tabCoords.length - i; 
        let cellCoord = tabCoords[index]; 
        let cell = document.getElementById(`coord-${cellCoord[0]}-${cellCoord[1]}`);
        
        if (cell) {
            cell.classList.add('player');
        }
        movePlayer(tabCoords[tabCoords.length - 1][0], tabCoords[tabCoords.length - 1][1], cellCoord[0], cellCoord[1]);
    }
}

/*
function resetHighScore() {
    localStorage.removeItem('highScore');
    displayHighScore();
}
*/