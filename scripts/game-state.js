var GameState = function(config) {
  var self = this,
    board = config.board,
    DIAGONAL_ID = 'd,'
    REVERSE_DIAGONAL_ID = 'rd',
    COLUMN_PREFIX = 'c',
    ROW_PREFIX = 'r',
    minimumMovesForWin = (config.board.boardSize/2 - 1),
    opponent = config.opponent,
    player = config.player,
    winner = null,
    draw = null,
    winningLine = null,
    gatherLine = true,
    impossibleMoves = [];

  function blankBoard(){
    return board.isBlank();
  }

  function makeMove(position, gameState) {
    var newState = $.extend({}, this);
    newState.setPlayer(opponent);
    newState.setOpponent(player);
    newState.impossibleMoves = impossibleMoves.slice(0);
    newState.board = $.extend({}, board);
    newState.board.placePlayer(player, position);
    checkForWin(newState.board);
    return newState;
  }

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
  /*** check for winning functions ***/
  function didIWin(piece){
    return checkForWin(piece);
  }

  function getWinner(){
    return checkForWin(player) || checkForWin(opponent);
  }

  function isWon() {
    return (
        checkForWin(player) || checkForWin(opponent)
    ) ? true : false;
  }

  function isLost(piece){
    return !isDraw() && isWon();
  }

  function isDraw() {
    // no empty spaces and no winner
    return !board.getEmptySpacesLeft() && isWon();
  }

  function gameOver (){
    return isWon() || isDraw();
  }

  function finishThem(){
    return board.getEmptySpacesLeft() === 0 ?
        board.removeEmptySpace() :
        undefined;
  }

  /** Calculate Win/Loss **/
  /***
    Fastest path is taking too long

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
        if(_.isEqual(piece, occupiedBy)){
          console.log(piece, occupiedBy);
          count++;
        }

        if(count === board.width){
          return piece;
        }
      }
      // finished row, reset count
      count = 0;
    }

  }

  function winningColumn(piece){
    var count = 0,
      i = 0;

    console.log(piece);
    for( ; i < board.width; i++){
      var j = 0;
      for(; j < board.width; j++){
        var occupiedBy = board.whosThere({
          row: j, col: i
        });

        if(_.isEqual(piece, occupiedBy)){
          count++;
        }

        if(count === board.width){
          return piece;
        }
      }
      // finished column reset count
      count = 0;
    }
  }

  function winningDiagonal(piece){
    var count = 0,
      i = 0;

    for(; i < board.width; i++){
      var occupiedBy = board.whosThere({
        row: i,
        col: i
      });

      if(_.isEqual(piece, occupiedBy)){
        count++;
      }

      if(count === board.width){
        return piece;
      }
    }
  }

  function winningRevDiagonal(piece){
    var count = 0,
      i = 0;

      for(; i < board.width; i++){
        var occupiedBy = board.whosThere({
          row: i,
          col: board.width - i - 1
        });

        if(_.isEqual(piece, occupiedBy)){
          count ++;
        }

        if(count === board.width){
          return piece;
        }
      }
  }

  function checkForWin(piece){
    winner =
      winningRow(piece) ||
      winningColumn(piece) ||
      winningDiagonal(piece) ||
      winningRevDiagonal(piece);

    return winner;
  }

  function availableMoves(){
    return board.emptySpacesLeft;
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
    getWinner: getWinner,
    didIWin: didIWin,
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
    finishThem: finishThem,
    setPlayer: setPlayer,
    setOpponent: setOpponent,
    getBoard: getBoard
  };
};
