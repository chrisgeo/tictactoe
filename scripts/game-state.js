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
    DIAGONAL_ID = 'd',
    REVERSE_DIAGONAL_ID = 'rd',
    COLUMN_PREFIX = 'c',
    ROW_PREFIX = 'r',
    impossibleLines = [],
    minimumMovesToWin = (board.width * 2) - 1,
    winner,
    winningLine,
    maxIndex = board.width - 1,
    GET_SPACE_CL = {
      'rd': function(index, position){
        return {
          row: index,
          col: maxIndex - index
        };
      },
      'd': function(index, position){
        return {
          row: index,
          col: index
        };
      },
      'c': function(index, position){
        return {
          row: index,
          col: position.col
        };
      },
      'r': function(index, position){
        return {
          row: position.row,
          col: index
        };
      }
    };

  function getWinningLine(){
    checkForWin(true);
    return winningLine;
  }

  function blankBoard(){
    return board.isBlank();
  }

  function makeMove(position) {
    if(board.isEmptySpace(position)){
      // Having to clone the board
      // causes slowness
      var newBoard = board.clone();
      newBoard.placePlayer(player, position);
      state = new GameState({
        board: newBoard,
        player: opponent,
        opponent: player
      });

      state.winningLine();
      return state

    }else{
      return this;
    }
  }

  /*** check for winning functions ***/
  function didIWin(piece){
    return winner ? winner.indexOf(piece) >= 0 : false;
  }

  function didILose(piece){
    return winner && winner.indexOf(piece) >= 0;
  }


  function isWon() {
    return !winner;
  }

  function isDraw(piece) {
    // no empty spaces and no winner
    return board.getEmptySpaces().length === 0 && !isWon();
  }

  function gameOver (){
    return isWon() || isDraw();
  }

  function finishTheFight(){
    return board.getEmptySpaces().pop();
  }

  function checkLine(space, line_id, gatherLine, spaceFunc){
    var i = 0,
      candidate,
      line = [];

    if(_.contains(impossibleLines, line_id)){
      return;
    }

    candidate = board.whosThere(space);
    if(!candidate){
      return;
    }

    line.push(space);

    for(; i < maxIndex; i++){
      var testSpace = spaceFunc(i, space),
          newCandidate = board.whosThere(testSpace);

      if(candidate.indexOf(newCandidate) === -1){
        impossibleLines.push(line_id);
        return;
      }

      if(gatherLine){
        line.push([i, board.width - i]);
      }
    }

    if(gatherLine){
      winningLine = line;
    }
    return candidate;
  }

  function winningDiagonal(gatherLine){
    return checkLine(
      { row: 0, col: 0},
      DIAGONAL_ID,
      gatherLine,
      GET_SPACE_CL[DIAGONAL_ID]
    );
  }

  function winningRevDiagonal(gatherLine){
    return checkLine(
      { row: 0, col: maxIndex},
      REVERSE_DIAGONAL_ID, gatherLine,
      GET_SPACE_CL[REVERSE_DIAGONAL_ID]
    );
  }

  function winningColumn(gatherLine){
    var i = 0;

    for(; i < maxIndex; i++){
      var win = checkLine(
        { row: 0, col: i},
        COLUMN_PREFIX + i,
        gatherLine,
        GET_SPACE_CL[COLUMN_PREFIX]
      );
      if(win){
        return win;
      }
    }
  }

  function winningRow(gatherLine){
    var i = 0;

    for(; i < maxIndex; i++){
      var win = checkLine(
        { row: i, col: 0},
        ROW_PREFIX + i,
        gatherLine,
        GET_SPACE_CL[ROW_PREFIX]
      );
      if(win){
        return win;
      }
    }
  }

  function checkForWin(gatherLine){
    if(board.occupiedSpaces() < minimumMovesToWin){
      winner = winningRow(gatherLine) ||
        winningColumn(gatherLine) ||
        winningDiagonal(gatherLine) ||
        winningRevDiagonal(gatherLine);
    }
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
    winningLine: getWinningLine,
    blankBoard: blankBoard,
    didIWin: didIWin,
    didILose: didILose,
    isWon: isWon,
    isDraw: isDraw,
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
