import { BASE_POSITION, STATE, WHITE } from "./Constants.js";
import {
  allPiecesCloseHome,
  drawBoard,
  PLAYER_BASES,
  setBoardLen,
  setCanvasDim,
} from "./helpers.js";
import { createPieces, PLAYERS_PIECES } from "./Objects/Player.js";

/***************************************
 
 
               VARIABLES

 
 ***************************************/
let gamePage = document.getElementById("gamePage");
const BOARD_BORDER = 20;
gamePage.style.padding = `0 ${BOARD_BORDER}px`;
const SCREEN_WIDTH = gamePage.getBoundingClientRect().width - BOARD_BORDER;
const SCREEN_HEIGHT = gamePage.getBoundingClientRect().y - BOARD_BORDER;
const BOARD_LENGHT = setBoardLen(SCREEN_WIDTH, SCREEN_HEIGHT);
const STEP_LENGTH = BOARD_LENGHT / 15;
let DICE_NUM;
let prevDiceNum = null;
const Players = [0, 2, 1, 3];
let activePlayer = 0;
let prevActivePlayer = null;
let numOfPlayersPlaying = 0;
let isDiceRolled = STATE.DICE_NOT_ROLLED;
/***************************************
 
 
                 GETTING HTML ELEMENTS

 
 ***************************************/
//Getting canvas element
let canvas = document.getElementById("canvas");
let gameBG = document.getElementById("gameBG");

//Getting Canvas Context
let c = canvas.getContext("2d");
let contextBG = gameBG.getContext("2d");

//Setting Canvas Dimensions
setCanvasDim(canvas, BOARD_LENGHT, BOARD_LENGHT);
drawBoard(c, STEP_LENGTH, numOfPlayersPlaying);

//Getting elemnts from number of players playing page
const numPlayersPgSubmit = document.getElementById("numPlayersPgSubmit");
const pageBeforeGameBoard = document.getElementsByClassName("page");
const chooseNumPlyers = document.getElementById("chooseNumPlyers");
const winnerPage = document.getElementById("winnerPage");
const winner1 = document.getElementById("winner1");
const wpNewgameBTN  = document.getElementById("wpNewgame");
const gameBackbtn = document.getElementById("gameBackbtn");
//Getting Dice
let dice1 = document.getElementById("dice1");
let dice2 = document.getElementById("dice2");
let dice3 = document.getElementById("dice3");
let dice4 = document.getElementById("dice4");
// const htmldice = document.getElementsByClassName("dice");
let dice = [dice1, dice2, dice3, dice4];
const diceHTML_Style_Classes = ["one","two","three","four","five","six","notActiveDice","ActiveDiceNotRolled"]
let gameOn = false;
//Window load event
const backToChoosingPlayerNum = () => {
  gameOn = false;
  chooseNumPlyers.style.display = "block";
  gamePage.style.display = "none";
  winnerPage.style.display = "none";
};
window.addEventListener("load", backToChoosingPlayerNum);
/***************************************
 
 
      SELECT NUMBER OF PLAYERS PAGE

 
 ***************************************/
//Creating player pieces
const startGame = () => {
  numOfPlayersPlaying = parseInt(
    document.querySelector('input[name="numPlayers"]:checked').value
  );

  isDiceRolled = STATE.DICE_NOT_ROLLED;
  gameOn = true;
  activePlayer = 0;
  PLAYERS_PIECES.splice(0, PLAYERS_PIECES.length);
  //Creating player pieces
  createPieces(c, STEP_LENGTH, numOfPlayersPlaying);
  animate();
};

//Method to set number of people playing
const setNumOfPlayers = () => {
  startGame();
  for (let i = 0; i < pageBeforeGameBoard.length; i++) {
    pageBeforeGameBoard[i].style.display = "none";
  }
  gamePage.style.display = "flex";
};

numPlayersPgSubmit.addEventListener("click", setNumOfPlayers);
/***************************************
 
 
                GAME LOGIC

 
 ***************************************/

//Setting dice BG
// const revertDiceBg = "url('../assets/sprites/dice/inactive.png')";
// let activeDiceBG = "url('../assets/sprites/dice/active.png')";
const disableDIce = "none";
const enableDice = "auto";

let winner_1stPlace=null;
let gameEnded = false;
//A player has won
const playerWon=(winnerNum)=>{
  if(winner_1stPlace===null)
  {
    winner_1stPlace = winnerNum;
    gameEnded = true;
    winner1.innerHTML = winner_1stPlace;
  }
}
//Remove all dice classes
const removeDiceHTML_NumStylings = (index)=>{
  for(let i=0;i<diceHTML_Style_Classes.length;i++)
  {
    dice[index].classList.remove(diceHTML_Style_Classes[i])
  }
}

const revertDiceOriginalColor = () => {
  for (let i = 0; i < dice.length; i++) {
    // dice[i].style.backgroundImage = revertDiceBg;
    removeDiceHTML_NumStylings(i);
    dice[i].style.pointerEvents = disableDIce;
  }
};
const setDiceIsRolledState = (state) => {
  isDiceRolled = state;
};
//Increament Active plaver
const incrActPlayer = () => {
  isDiceRolled = STATE.DICE_NOT_ROLLED;
  revertDiceOriginalColor();
  prevActivePlayer = activePlayer;
  if (numOfPlayersPlaying === 2) {
    if (activePlayer >= 2) {
      activePlayer = 0;
    } else {
      activePlayer += 2;
    }
  } else {
    if (activePlayer >= numOfPlayersPlaying - 1) {
      activePlayer = 0;
    } else {
      activePlayer += 1;
    }
  }
  dice[Players[activePlayer]].style.pointerEvents = enableDice;
};
revertDiceOriginalColor();

//Method to roll dice
const diceRoll = (e) => {
  if (prevActivePlayer !== null) {
    prevDiceNum = DICE_NUM;
  }
  revertDiceOriginalColor();
  let randNum = Math.floor(Math.random() * 6);
  DICE_NUM = randNum + 1;
  e.target.setAttribute("value", DICE_NUM);
  isDiceRolled = STATE.DICE_ROLLED;

  if (DICE_NUM !== 6) {
    if (PLAYERS_PIECES[Players[activePlayer]][0].numActivePieces() === 0) {
      incrActPlayer();
    }
  }
};

//Handling Back btn event
gameBackbtn.addEventListener("click", backToChoosingPlayerNum);
//Handling NewGame Event
wpNewgameBTN.addEventListener("click", backToChoosingPlayerNum);
//Handling dice roll Event
dice1.addEventListener("click", diceRoll);
dice2.addEventListener("click", diceRoll);
dice3.addEventListener("click", diceRoll);
dice4.addEventListener("click", diceRoll);
//Canvas Event Handler
canvas.addEventListener("click", (e) => {
  e.preventDefault();

  //Getting Mouse Coordinates
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;
  if (isDiceRolled)
    //Looping through player pieces
    for (let i = 0; i < PLAYERS_PIECES.length; i++) {
      for (let j = 0; j < 4; j++) {
        let piece = PLAYERS_PIECES[i][j];
        let playerX = piece.x;
        let playerY = piece.y;
        if (
          mouseX >= playerX - piece.rad &&
          mouseX <= playerX + piece.rad &&
          mouseY >= playerY - piece.rad &&
          mouseY <= playerY + piece.rad
        ) {
          //Checking if Dice is Rolled
          if (isDiceRolled === STATE.DICE_ROLLED) {
            PLAYERS_PIECES[i][j].update(
              DICE_NUM,
              Players[activePlayer],
              incrActPlayer,
              setDiceIsRolledState,
              PLAYERS_PIECES,playerWon
            );
          }
        }
      }
    }
    if(gameEnded)
    {
      chooseNumPlyers.style.display = "none";
      gamePage.style.display = "none";
      winnerPage.style.display = "block";
    }
});
//Animation
let animationFrameId = null;
let blinkerTimer = 0;
const animate = () => {
  if (gameOn) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animate);
  }

  //Checking If Pieces of active player are not close home
  allPiecesCloseHome(
    Players[activePlayer],
    DICE_NUM,
    isDiceRolled,
    setDiceIsRolledState,
    incrActPlayer
  );
  //
  c.clearRect(0, 0, BOARD_LENGHT, BOARD_LENGHT);
  for (let i = 0; i < dice.length; i++) {
    //Checking which player to play
    let actPlayer = parseInt(dice[i].getAttribute("dice-num")) - 1;
    if (actPlayer === activePlayer) {
      let index = Players[activePlayer];
      if (isDiceRolled === STATE.DICE_NOT_ROLLED) {
        // dice[index].style.backgroundImage = activeDiceBG;
        removeDiceHTML_NumStylings(index);
        dice[index].classList.add(diceHTML_Style_Classes[7]);
        dice[index].style.pointerEvents = enableDice;
      } else {
        // dice[index].style.backgroundImage = revertDiceBg;
        removeDiceHTML_NumStylings(index);
        dice[index].classList.add(diceHTML_Style_Classes[6]);
        dice[index].style.pointerEvents = disableDIce;
      }
    }
  }
  if (prevActivePlayer !== null) {
    if (DICE_NUM !== 6 && isDiceRolled === STATE.DICE_NOT_ROLLED) {
      // dice[Players[prevActivePlayer]].style.backgroundImage =
      //   "url(" + `../assets/sprites/dice/dice${DICE_NUM}.png` + ")";
      removeDiceHTML_NumStylings(Players[prevActivePlayer]);
      dice[Players[prevActivePlayer]].classList.add(diceHTML_Style_Classes[DICE_NUM-1])

    } else {
      // dice[Players[activePlayer]].style.backgroundImage =
      //   "url(" + `../assets/sprites/dice/dice${DICE_NUM}.png` + ")";
      removeDiceHTML_NumStylings(Players[activePlayer]);
      dice[Players[activePlayer]].classList.add(diceHTML_Style_Classes[DICE_NUM-1])
    }
  }
  //Make Active Player blink
  const blinkerInterval = 10;
  if (blinkerTimer % blinkerInterval === 0) {
    PLAYER_BASES[Players[activePlayer]].blink(isDiceRolled);
  }
  blinkerTimer += 1;
  if (isDiceRolled === STATE.DICE_NOT_ROLLED) {
    for (let i = 0; i < BASE_POSITION.length; i++) {
      PLAYER_BASES[Players[activePlayer]].blinkerIterator = 0;
      PLAYER_BASES[Players[activePlayer]].frameX = 0;
      PLAYER_BASES[Players[activePlayer]].draw();
    }
  }
  drawBoard(c, STEP_LENGTH, numOfPlayersPlaying);
  for (let i = 0; i < PLAYERS_PIECES.length; i++) {
    for (let j = 0; j < 4; j++) {
      PLAYERS_PIECES[i][j].draw();
    }
  }
};
animate();
/***************************************
 
 
             EVENT LISTENERS

 
 ***************************************/
//Load Event
// window.addEventListener("resize", () => {
//   alert(
//     "Please Reload The Page,This app is made not to be responsive on purpose"
//   );
// });
