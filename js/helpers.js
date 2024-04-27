import {
  BASE_POSITION_BG,
  COORDINATE_MAP,
  PLAYER_COLORS,
  SAFE_POSITIONS,
  WHITE,
  HOME_TRIANGLE_COORD,
  TURNING_POINTS,
  HOME_POSITIONS,
  STATE,
  SPRITES,
} from "./Constants.js";
import { drawPiece } from "./Objects/Piece.js";
import { Player, PLAYERS_PIECES } from "./Objects/Player.js";

import { Base } from "./Objects/PlayerBase.js";
import { Polygon } from "./Objects/Polygon.js";
import { drawGrid } from "./Objects/Square.js";
import { Triangle } from "./Objects/Triange.js";

/**
 * Method to set length of the board
 * @param {Device inner screen width} w
 * @param {Device inner screen height} h
 * @returns
 */
export function setBoardLen(w, h) {
  let len;
  let screenPercent = 0.8;
  let mobileWidth = 480;
  if (w < h && w > mobileWidth) {
    len = mobileWidth;
  } else if (w > h && h > mobileWidth) {
    len = mobileWidth;
  } else if (w > h && h < mobileWidth) {
    len = h;
  } else if (w < h && w < mobileWidth) {
    len = w;
  }
  return len;
}

/**
 * Method to set dimensions of the canvas
 * @param {Canvas to modify} canvas
 * @param {Width of the canvas} width
 * @param {Height of the canvas} height
 */
export function setCanvasDim(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
}
function drawPlayerSafeSport(
  context,
  x,
  y,
  numSpikes,
  radius,
  len,
  color,
  strokeColor
) {
  let start = new Polygon(
    context,
    x,
    y,
    numSpikes,
    radius,
    radius * 0.6,
    len,
    color,
    strokeColor
  );
  start.draw();
}
function drawSafeSpotStar(context, len) {
  //Draw stars in players start postions
  let oddSafePos = 1;
  let colorIndex = 0;
  for (let i = 0; i < 8; i++) {
    const [x, y] = COORDINATE_MAP[SAFE_POSITIONS[i]];
    if (i % 2 === 0) {
      drawPlayerSafeSport(
        context,
        x,
        y,
        5,
        len * 0.15,
        len,
        WHITE,
        PLAYER_COLORS[colorIndex]
      );
    } else {
      //Draw Player safe sport for Outside Home Safe Sports
      drawPlayerSafeSport(
        context,
        COORDINATE_MAP[SAFE_POSITIONS[oddSafePos]][0],
        COORDINATE_MAP[SAFE_POSITIONS[oddSafePos]][1],
        5,
        len * 0.15,
        len,
        PLAYER_COLORS[colorIndex],
        PLAYER_COLORS[colorIndex]
      );
      colorIndex += 1;
      oddSafePos += 2;
    }
  }
}
/**
 * Method to draw the Board
 * @param {Canvas Context} context
 * @param {Length of each square in the Board} len
 */
export const PLAYER_BASES = [];
export function drawBoard(context, len, numPlayer) {
  drawGrid(context, len, numPlayer);
  drawSafeSpotStar(context, len);
  /***************************
   
        Draw Home Positions
   
   ***************************/
  let playerBase;
  let playerHome;
  for (let i = 0; i < BASE_POSITION_BG.length; i++) {
    //Getting Coordinates for base position
    const [x, y] = COORDINATE_MAP[BASE_POSITION_BG[i]];

    //Getting Coordinates for Triangles home postion
    const [beg, end] = HOME_TRIANGLE_COORD[i];
    if (i >= numPlayer) {
      playerHome = new Triangle(
        context,
        COORDINATE_MAP[beg],
        COORDINATE_MAP[1000],
        COORDINATE_MAP[end],
        PLAYER_COLORS[i],
        len,
        false
      );

      //Player Base
      playerBase = new Base(
        context,
        x,
        y,
        len,
        PLAYER_COLORS[i],
        false,
        i,
        SPRITES[0]
      );
    } else {
      playerHome = new Triangle(
        context,
        COORDINATE_MAP[beg],
        COORDINATE_MAP[1000],
        COORDINATE_MAP[end],
        PLAYER_COLORS[i],
        len,
        true
      );
      //Player Base
      playerBase = new Base(
        context,
        x,
        y,
        len,
        PLAYER_COLORS[i],
        true,
        i,
        SPRITES[0]
      );
    }
    PLAYER_BASES.push(playerBase);
    playerBase.draw();
    playerHome.draw();
  }
  //Draw Players
  drawPiece(context, len);
}

export const allPiecesCloseHome = (
  activePlayer,
  dice,
  diceState,
  setDiceRollState,
  incrActPlayer
) => {
  if (diceState === STATE.DICE_ROLLED) {
    let numOfPiecesCloseToHome = null;
    for (let i = 0; i < 4; i++) {
      if (
        dice >
          HOME_POSITIONS[activePlayer] -
            PLAYERS_PIECES[activePlayer][i].currentPos &&
        !PLAYERS_PIECES[activePlayer][i].isHome
      ) {
        if (numOfPiecesCloseToHome === null) {
          numOfPiecesCloseToHome = 1;
        } else {
          numOfPiecesCloseToHome = +1;
        }
      }
    }
    if (numOfPiecesCloseToHome === PLAYERS_PIECES[activePlayer][0].actPieces) {
      if (dice === 6) {
        let hasPiecesInBasePos = false;
        for (let j = 0; j < 4; j++) {
          if (PLAYERS_PIECES[activePlayer][j].currentPos === null) {
            hasPiecesInBasePos = true;
          }
        }
        if (!hasPiecesInBasePos) {
          setDiceRollState(STATE.DICE_NOT_ROLLED);
        }
      } else {
        incrActPlayer();
        console.log(
          `Num Act Pieces:${activePlayer}/n Num of Pieces close home:${numOfPiecesCloseToHome}`
        );
      }
    } else {
      console.log(`There is a free pieces in the game`);
    }
  }
};
