//#region grid
// Box width
// Padding
var p = 10;

var height = 20;
var width = 10;

var cellHeight = 40;
var cellWidth = 40;

var canvas = document.querySelector("canvas");
canvas.height = cellHeight * height + 15;
var context = canvas.getContext("2d");

var score = 0;
setScore();
function drawBoard() {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      drawCell(i, j);
    }
  }
}

drawBoard();

//#endregion
//#region classes

class Vector {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Block {
  structure;
  pos;
  constructor(structure) {
    this.structure = structure;
    this.pos = new Vector(getRandomInt(width - 3), 0);
  }
}

class Structure {
  parts;
  constructor(parts) {
    this.parts = parts;
  }
}
//#endregion
//#region structures
var s1 = new Structure([
  new Vector(0, 0),
  new Vector(0, 1),
  new Vector(1, 1),
  new Vector(1, 2)
]);
var s2 = new Structure([
  new Vector(0, 0),
  new Vector(0, 1),
  new Vector(1, 0),
  new Vector(1, 1)
]);
var s3 = new Structure([
  new Vector(0, 0),
  new Vector(0, 1),
  new Vector(0, 2),
  new Vector(1, 0)
]);
var s4 = new Structure([
  new Vector(0, 0),
  new Vector(1, 0),
  new Vector(2, 0),
  new Vector(3, 0)
]);
var s5 = new Structure([
  new Vector(0, 0),
  new Vector(0, 1),
  new Vector(0, 2),
  new Vector(0, 3)
]);
var structures = [s1, s2, s3, s4, s5];
//#endregion
var blocks = [];
var board = new Array(width);

for (var i = 0; i < board.length; i++) {
  board[i] = new Array(height);
}
var blockSpeed = 200;

var currentBlock = newBlock();
//#region methods
//9,9 is max 0,0 is min
const image = new Image(60, 45);
image.src = "T_Tetromino0.png";
function draw(x, y) {
  context.drawImage(
    image,
    p + x * cellWidth,
    p + y * cellHeight,
    cellWidth,
    cellHeight
  );
  //context.fillRect(p+(x*cellWidth),p+(y*cellHeight),cellWidth,cellHeight)
}
function checkLose(y) {
  if (y === 1) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        score = 0;
        board[i][j] = false;
      }
    }
    return true;
  }
  return false;
}
function drawCell(x, y) {
  context.beginPath();
  context.strokeStyle = "grey";
  context.rect(p + x * cellWidth, p + y * cellHeight, cellWidth, cellHeight);
  context.stroke();
}

function SaveParts() {
  if (currentBlock == null) return;
  for (let i = 0; i < currentBlock.structure.parts.length; i++) {
    board[currentBlock.structure.parts[i].x + currentBlock.pos.x][
      currentBlock.structure.parts[i].y + currentBlock.pos.y
    ] = true;
  }
}
function newBlock() {
  SaveParts();
  return new Block(structures[getRandomInt(structures.length)]);
}
function drawBlock(block) {
  var parts = block.structure.parts;
  for (let i = 0; i < parts.length; i++) {
    draw(block.pos.x + parts[i].x, block.pos.y + parts[i].y);
  }
}
function clearGrid() {
  context.clearRect(0, 0, 1000, 1000);
  drawBoard();
}

function translateBlock(x, y, block) {
  block.pos = new Vector(block.pos.x + x, block.pos.y + y);
  drawBlock(block);
}

function checkWall(right) {
  for (let i = 0; i < currentBlock.structure.parts.length; i++) {
    const structureParts = currentBlock.structure.parts[i];

    if (structureParts.x + currentBlock.pos.x == 0 && right == false) {
      return true;
    }
    if (structureParts.x + currentBlock.pos.x == width - 1 && right == true) {
      return true;
    }
  }
  return false;
}
function setScore() {
  document.getElementById("score").innerHTML = "Score: " + score.toString();
}
function removeline(y) {
  score += width;
  setScore();
  for (let x = 0; x < width; x++) {
    board[x][y] = false;
  }
  moveBoardDown(y);
}
function checkLine() {
  for (let y = height - 1; y > 0; y--) {
    var isfull = true;
    for (let x = 0; x < width; x++) {
      if (!board[x][y]) {
        isfull = false;
        break;
      }
    }
    if (isfull) {
      removeline(y);
      y++;
    }
  }
}
function moveBoardDown(line) {
  for (let y = line; y > 0; y--) {
    //if(y >= line) continue;
    for (let x = 0; x < width; x++) {
      board[x][y] = board[x][y - 1];
      board[x][y - 1] = false;
    }
  }
}
function checkGround() {
  for (let i = 0; i < currentBlock.structure.parts.length; i++) {
    const structureParts = currentBlock.structure.parts[i];
    for (let j = 0; j < board.length; j++) {
      for (let k = 0; k < board[j].length; k++) {
        if (
          board[j][k] == true &&
          structureParts.y + currentBlock.pos.y == k - 1 &&
          structureParts.x + currentBlock.pos.x == j
        ) {
          if (checkLose(k)) return;
          currentBlock = newBlock();
          checkLine();
          return true;
        }
      }
    }

    if (structureParts.y + currentBlock.pos.y == height - 1) {
      //blocks.push(currentBlock);
      currentBlock = newBlock();
      checkLine();
      return true;
    }
  }
  return false;
}
function render() {
  clearGrid();
  if (checkGround() == false) {
    translateBlock(0, 1, currentBlock);
  }
  drawBlock(currentBlock);
  for (let i = 0; i < blocks.length; i++) {
    drawBlock(blocks[i]);
  }
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (board[i][j] == true) draw(i, j);
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//#endregion
//#region events
document.addEventListener("keydown", function (e) {
  if (e.key == "ArrowLeft") {
    if (!checkWall(false)) translateBlock(-1, 0, currentBlock);
  }
  if (e.key == "ArrowRight") {
    if (!checkWall(true)) translateBlock(1, 0, currentBlock);
  }
});
//#endregion
drawBlock(currentBlock);
setInterval(function () {
  render();
}, blockSpeed);