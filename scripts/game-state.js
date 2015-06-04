var _ = _ || undefined;
if(!_){
  // hacks for node tests
  _ = require('./lodash.min.js');
  Board = require('./board.js');
}


function cloneGameBoard(board){
  /***
    Since Object.clone and .create
    Do not lose refenence, so create an
    entirely new object
  ***/
  var newBoard = new Board({
    spaces: board.width * board.width
  }),
  oldGameBoard = board.gameBoard();

  for(var i=0; i < board.width; i++){
    for(var j = 0; j < board.width; j++){
      if(oldGameBoard[i][j] !== 0){
        newBoard.placePlayer(
          oldGameBoard[i][j],
          { row: i, col: j }
        );
      }
    }
  }
  return newBoard;
}

var GameState = function(config) {
  var board = config.board,
    opponent = config.opponent,
    player = config.player,
    winner = null;

  function blankBoard(){
    return board.isBlank();
  }

  function makeMove(position) {
    if(board.isEmptySpace(position)){
      // Having to clone the board
      // causes slowness
      var newBoard = cloneGameBoard(board);
      newBoard.placePlayer(player, position);
      return new GameState({
        board: newBoard,
        player: opponent,
        opponent: player
      });

    }else{
      return this;
    }
  }

  /*** check for winning functions ***/
  function didIWin(piece){
    return checkForWin(piece);
  }

  function didILose(piece){
    return !isDraw() && !checkForWin(piece);
  }


  function isWon() {
    return checkForWin(player) || checkForWin(opponent);
  }

  function isLost(){
    return isWon();
  }

  function isDraw() {
    // no empty spaces and no winner
    return board.getEmptySpaces().length === 0 && !isWon();
  }

  function gameOver (){
    return isWon() || isDraw();
  }

  function finishTheFight(){
    return board.getEmptySpaces().pop();
  }

  /** Calculate Win/Loss **/
  /***
    Fastest path is taking too long to build
    function isAnImpossibleMove(lineName){
      var found = false;
      impossibleMoves.forEach(function(val, idx, arr){
        if(_.isEqual(lineName, val)){
          found = true;
          return;
        }
      });

      return found;
    }

    function winningRow(){
      var i = 0;

      while(i < board.width){
        var candidate = checkPath({
            row: i,
            col: 0
          },
          ROW_PREFIX + i
        );

        if(candidate){
          return candidate;
        }

        i++;
      }
    }



    function winningColumn(){
      var i = 0;

      while(i < board.width){
        var candidate = checkPath({
          row: 0,
          col: i
        }, COLUMN_PREFIX + i);

        if(candidate){
          return candidate;
        }
      }
    }

    function winningDiagonal(){
      return checkLine(
          { row: 0, col: 0 },
          DIAGONAL_ID
        );
    }

    function winningReverseDiagonal(){
      return checkLine(
          { row: 0, col: board.width },
          REVERSE_DIAGONAL_ID
        );
    }

    function checkPath(space, lineName){
      if(isAnImpossibleMove(lineName)){
        return;
      }

      // check for whos in a spot
      var candidate = board.whosThere(space);

      if(!candidate) return;

      var i = 1, j = 0, line = [space];

      for(; i < board.maxIndex; i++){
        for(; j < board.maxIndex; j++){
          var testSpace = board.whosThere({
            row: i,
            col: j
          });

          if(testSpace && !_.isEqual(testSpace, candidate)){
            impossibleMoves.push(lineName);
          }
          line.push({
            row: i,
            col: j
          });
        }
      }

      // check for winner

      if(gatherLine){
        winningLine = line;
      }

      return candidate; // winner
    }

  ***/

  function winningRow(piece){
    var count = 0,
      i = 0;

    for( ; i < board.width; i++){
      var j = 0;
      for(; j < board.width; j++){
        var occupiedBy = board.whosThere({
          row: i, col: j
        });

        if(occupiedBy && occupiedBy.indexOf(piece) !== -1){
          count++;
        }

        if(count === board.width){
          winner = piece;
          return true;
        }
      }
      // finished row, reset count
      count = 0;
    }

    return false;
  }

  function winningColumn(piece){
    var count = 0,
      i = 0;

    for( ; i < board.width; i++){
      var j = 0;
      for(; j < board.width; j++){
        var occupiedBy = board.whosThere({
          row: j, col: i
        });

        if(occupiedBy && occupiedBy.indexOf(piece) !== -1){
          count++;
        }

        if(count === board.width){
          winner = piece;
          return true;
        }
      }
      // finished column reset count
      count = 0;
    }

    return false;
  }

  function winningDiagonal(piece){
    var count = 0,
      i = 0;

    for(; i < board.width; i++){
      var occupiedBy = board.whosThere({
        row: i,
        col: i
      });

      if(occupiedBy && occupiedBy.indexOf(piece) !== -1){
        count++;
      }

      if(count === board.width){
        winner = piece;
        return true;
      }
    }

    return false;
  }

  function winningRevDiagonal(piece){
    var count = 0,
      i = 0;

      for(; i < board.width; i++){
        var occupiedBy = board.whosThere({
          row: i,
          col: board.width - i - 1
        });

        if(occupiedBy && occupiedBy.indexOf(piece) !== -1){
          count ++;
        }

        if(count === board.width){
          winner = piece;
          return true;
        }
      }

      return false;
  }

  function checkForWin(piece){

    return winningRow(piece) ||
      winningColumn(piece) ||
      winningDiagonal(piece) ||
      winningRevDiagonal(piece);
  }

  function availableMoves(){
    return board.getEmptySpacesLeft();
  }

  function currentPlayer(){
    return player;
  }

  function currentOpponent(){
    return opponent;
  }

  function setPlayer(player){
    player = player;
  }

  function setOpponent(opponent){
    opponent = opponent;
  }

  function emptySpaces(){
    return board.getEmptySpaces();
  }

  function getBoard(){
    return board;
  }

  return {
    blankBoard: blankBoard,
    didIWin: didIWin,
    didILose: didILose,
    isWon: isWon,
    isDraw: isDraw,
    isLost: isLost,
    currentPlayer: currentPlayer,
    currentOpponent: currentOpponent,
    availableMoves: availableMoves,
    makeMove: makeMove,
    corners: board.corners,
    emptySpaces: emptySpaces,
    gameOver: gameOver,
    finishTheFight: finishTheFight,
    setPlayer: setPlayer,
    setOpponent: setOpponent,
    getBoard: getBoard
  };
};

if(module) module.exports = GameState;
