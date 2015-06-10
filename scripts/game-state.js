var _ = _ || undefined;
if(!_){
  // hacks for node tests
  _ = require('./lodash.min.js');
  Board = require('./board.js');
}

var GameState = function(config) {
  var board = config.board,
    opponent = config.opponent,
    player = config.player,
    minimumMovesToWin = (board.width * 2) - 1,
    winner;

  function blankBoard(){
    return board.isBlank();
  }

  function makeMove(position) {
    if(board.isEmptySpace(position)){
      // Having to clone the board
      // causes slowness
      var newBoard = board.clone();
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
