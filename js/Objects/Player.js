import {
  BASE_POSITION,
  COORDINATE_MAP,
  HOME_ENTRANCE,
  HOME_POSITIONS,
  INACTIVEPLAYER_OPACITY,
  INACTIVE_OVERLAY,
  SPRITES,
  PLAYER_COLORS,
  SAFE_POSITIONS,
  START_POSITION,
  STATE,
  TURNING_POINTS,
  SPRITE_LEN,
  BLACK,
} from "../Constants.js";
import { Piece } from "./Piece.js";

//Create Player Pieces
export const PLAYERS_PIECES = [];

export class Player extends Piece {
  constructor(
    c,
    x,
    y,
    len,
    color,
    startPos,
    turnPoint,
    playerNum,
    basePos,
    isRobot,
    isActive,
    img
  ) {
    super(c, x, y, len, color);
    this.startPos = startPos;
    this.turnPoint = turnPoint;
    this.currentPos = null;
    this.playerNum = playerNum;
    this.isHome = false;
    this.isOnWayHome = false;
    this.basePos = basePos;
    this.actPieces = 0;
    this.isRobot = isRobot;
    this.isActive = isActive;
    this.numHomePlayers = 0;
    this.justPromoted = false;
    this.won = false;
    this.img = new Image();
    this.img.src = img;
    this.playerFrameX = this.playerNum;
    this.playerFrameY = 0;
    this.isWon = false;
  }
  fillPlayer(opacity, color) {
    // this.context.beginPath();
    // this.context.fillStyle = WHITE;
    // this.context.arc(this.x, this.y, this.radBoarder, 0, this.twoPI);
    // this.context.fill();

    //Draw Player
    this.context.globalAlpha = 0.05;
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.fillStyle = BLACK;
    this.context.arc(this.x, this.y, this.rad, 0, this.twoPI);
    this.context.fill();
    this.context.globalAlpha = 1;

    let imgLen = this.len*0.55;
    let imgOffset =  imgLen/ 2;
    this.context.globalAlpha = opacity;
    this.context.drawImage(
      this.img,
      this.playerFrameX * 4 * SPRITE_LEN,
      0,
      SPRITE_LEN,
      SPRITE_LEN,
      this.x - imgOffset,
      this.y - imgLen,
      imgLen,
      imgLen
    );
    this.context.globalAlpha = 1;
  }
  draw() {
    if (!this.isActive) {
      this.fillPlayer(INACTIVEPLAYER_OPACITY * 0.3, INACTIVE_OVERLAY);
    } else {
      this.fillPlayer(1, this.color);
    }
  }

  updateLoc(currentPos) {
    const [x, y] = COORDINATE_MAP[currentPos];
    this.x = x * this.len + this.len * 0.5;
    this.y = y * this.len + this.len * 0.5;
    //Test For Turning Points
    //Test For Home Arrival
  }
  
  collision(arrPiece) {
    let dectCollision = false;
    let isSafeSpot = false;
    //Check if player is in safe spot
    for (let i = 0; i < SAFE_POSITIONS.length; i++) {
      if (this.currentPos === SAFE_POSITIONS[i]) {
        isSafeSpot = true;
      }
    }
    //Kick Player
    for (let i = 0; i < arrPiece.length; i++) {
      for (let j = 0; j < 4; j++) {
        let piece = arrPiece[i][j];
        if (piece.playerNum !== this.playerNum) {
          if (piece.currentPos === this.currentPos && !isSafeSpot) {
            console.log(`Before Kick Pos: ${piece.currentPos}`);

            //Updating kicked player coordinates
            const [x, y] = COORDINATE_MAP[arrPiece[i][j].basePos];
            arrPiece[i][j].x = x * this.len;
            arrPiece[i][j].y = y * this.len;
            // setting kicked player position to null
            arrPiece[i][j].currentPos = null;
            dectCollision = true;
            console.log(`After Kick Pos: ${piece.currentPos}`);
          }
        }
      }
    }
    return dectCollision;
  }
  move(setIsDiceRoll, donePosUpdate, dice) {
    for (let i = 1; i <= dice; i++) {
      if (!this.isHome) {
        this.currentPos += 1;
        // Checking If we are not in our home turning point
        if (this.currentPos === TURNING_POINTS[this.playerNum] + 1) {
          this.currentPos = HOME_ENTRANCE[this.playerNum][0];
          this.isOnWayHome = true;
        }
        //Tell that you arrived home
        if (this.currentPos === HOME_POSITIONS[this.playerNum]) {
          this.isHome = true;
          this.justPromoted = true;
        }
        //Making sure We are within bounds
        if (this.currentPos > 51 && !this.isOnWayHome) {
          this.currentPos = this.currentPos - 52;
        }
        // checking if done updating location
        if (!donePosUpdate) {
          this.updateLoc(this.currentPos);
        }
        //Updating dice roll
        setIsDiceRoll(STATE.DICE_NOT_ROLLED);
      }
    }
  }
  numActivePieces() {
    let numActPieces = 0;
    for (let i = 0; i < 4; i++) {
      if (
        !PLAYERS_PIECES[this.playerNum][i].isHome &&
        PLAYERS_PIECES[this.playerNum][i].currentPos !== null
      ) {
        numActPieces += 1;
      }
    }
    this.actPieces = numActPieces;
    return this.actPieces;
  }
  winCondition()
  {
    let numHomePieces = 0;
    for (let i = 0; i < 4; i++) {
      if (PLAYERS_PIECES[this.playerNum][i].isHome
      ) {
        numHomePieces += 1;
      }
    }
    if(numHomePieces === 1)
    {
      this.isWon = true;
    }
    console.log(`Num of Home Pieces: ${numHomePieces}`)
  }
  update(dice, activePlayer, incrActPlayer, setIsDiceRoll, arrPiece,wonMethod) {
    //Checking If Player has won
    if (this.numHomePlayers === 4 && this.numActivePieces === 0) {
      incrActPlayer();
      console.log(`Player ${this.playerNum} has won already:)`);
    }
    //Updating Player
    let donePosUpdate = false;
    let diceNumIsBig = false;
    if (!this.isHome) {
      if (activePlayer === this.playerNum) {
        if (this.currentPos === null) {
          //Checking Condition to move piece from base position to start position
          if (dice === 6) {
            this.currentPos = this.startPos;
            if (!donePosUpdate) {
              this.updateLoc(this.currentPos);
              donePosUpdate = true;
              setIsDiceRoll(STATE.DICE_NOT_ROLLED);
            }
          } else if (dice !== 6) {
            //Making sure Piece does not move to start position if the dice is not
            if (this.numActivePieces() !== 0) {
              update(
                dice,
                this.playerNum,
                incrActPlayer,
                setIsDiceRoll,
                arrPiece
              );
            }
          }
        } else {
          // checking if you are not pressing a piece that is home already
          if (!this.isHome) {
            if (this.isOnWayHome) {
              if (dice > HOME_POSITIONS[this.playerNum] - this.currentPos) {
                console.log("Number to big");
                diceNumIsBig = true;
              } else {
                // Move player
                this.move(setIsDiceRoll, donePosUpdate, dice);
              }
            } else {
              //Move Player
              this.move(setIsDiceRoll, donePosUpdate, dice);
            }
          } else {
            if (this.playerNum !== 0) {
              update(dice, activePlayer, incrActPlayer);
            }
          }
          donePosUpdate = true;

          //Determining when to increament
          if (
            dice !== 6 &&
            !this.collision(arrPiece) &&
            !diceNumIsBig &&
            !this.justPromoted
          ) {
            incrActPlayer();
          } else if (dice === 6 && this.collision(arrPiece)) {
            console.log(`COllision: ${arrPiece[this.playerNum]}`);
          } else if (this.justPromoted) {
            setIsDiceRoll(STATE.DICE_NOT_ROLLED);
          }
        }
      }
    }
    //Updating Pieces that are home already for current player(Double Check)
    for (let i = 0; i < 4; i++) {
      if (arrPiece[this.playerNum][i].isHome === true) {
        this.numHomePlayers = +1;
      }
    }
    if (this.numHomePlayers === 4) {
      this.won = true;
    }
    this.justPromoted = false;
    this.winCondition();
    if(this.isWon)
    {
      wonMethod(this.playerNum+1);
      console.log(`Player ${this.playerNum+1} has won`);
    }else{
      console.log("delete this line");
    }
  }
}

export const createPieces = (context, len, numPlayer) => {
  let PLAYER_PIECES_FOR_EACH_PLAYER = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let basePos = BASE_POSITION[i][j];
      const [x, y] = COORDINATE_MAP[basePos];
      let piece;
      if (i >= numPlayer) {
        piece = new Player(
          context,
          x,
          y,
          len,
          PLAYER_COLORS[i],
          START_POSITION[i],
          TURNING_POINTS[i],
          i,
          basePos,
          false,
          false,
          SPRITES[0]
        );
      } else {
        piece = new Player(
          context,
          x,
          y,
          len,
          PLAYER_COLORS[i],
          START_POSITION[i],
          TURNING_POINTS[i],
          i,
          basePos,
          false,
          true,
          SPRITES[0]
        );
      }
      PLAYER_PIECES_FOR_EACH_PLAYER.push(piece);
    }
    PLAYERS_PIECES.push(PLAYER_PIECES_FOR_EACH_PLAYER);
    PLAYER_PIECES_FOR_EACH_PLAYER = [];
  }
};
