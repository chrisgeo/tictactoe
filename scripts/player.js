var _ = _ || undefined;
if(!_){
  // hacks for node tests
  _ = require('./lodash.min.js');
}

var PerfectComputerPlayer = function(config){
  var self = this,
    START_DEPTH = 0,
    defaultScore = 10,
    playerPiece,
    currentMove,
    baseScore = 0;

  function arrayMin(arr) {
    var len = arr.length, min = Infinity;
    while (len--) {
      if (arr[len] < min) {
        min = arr[len];
      }
    }
    return min;
  }

  function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
      if (arr[len] > max) {
        max = arr[len];
      }
    }
    return max;
  }

  function takeTurn(state){
    if(state.gameOver()){
      return state;
    }

    self.playerPiece = state.currentPlayer();

    var move = chooseMove(state);
    return state.makeMove(move);
  }

  function getRandomPosition(corners){
    return corners[Math.floor(Math.random() * corners.length)];
  }

  function chooseMove(gameState){
    if(gameState.blankBoard()){
      return getRandomPosition(gameState.corners);
    }else if(gameState.emptySpaces().length === 1){
      return gameState.finishTheFight();
    }

    return findBestMove(gameState);
  }

  function isSamePiece(piece, testPiece){
    return piece.indexOf(testPiece) === 0;
  }

  function findBestMove(gameState){
    // reference instance variables with self
    // just to make sure.
    self.baseScore = gameState.emptySpaces().length + 1;
    var bound = self.baseScore + 1;
    minMax(gameState, START_DEPTH, -bound, bound);
    return self.currentMove;
  }

  function minMax(state, depth, lower, upper){
    if(state.gameOver()){
      return figureOutState(state, depth);
    }
    var possibleMoves = [],
      emptySpaces = state.emptySpaces(),
      i = 0,
      len = emptySpaces.length;

    for(; i < len; i++){
      var move = emptySpaces[i];
      var childBoard = state.makeMove(move);
      var score = minMax(childBoard, depth + 1, lower, upper);

      if(isSamePiece(self.playerPiece, state.currentPlayer())){
        possibleMoves.push({
          score: score,
          move: move
        });

        if(score > lower){
          lower = score;
        }

      }else if(score < upper){
        upper = score;
      }
      if(upper < lower){
        break;
      }
    }

    if(!isSamePiece(self.playerPiece, state.currentPlayer())){
      return upper;
    }

    var tmpMove = _.max(
      possibleMoves,
      function(node){
        return node.score;
      }
    );

    self.currentMove = tmpMove.move;
    return lower;
  }

  function figureOutState(state, depth){
    if(state.didIWin(self.playerPiece)){
      return self.baseScore - depth;
    }else if(state.didILose(self.playerPiece)){
      return depth - self.baseScore;
    }

    return 0;
  }

  return {
    takeTurn: takeTurn,
    chooseMove: chooseMove
  };
};

// node test hack
if(module) module.exports = PerfectComputerPlayer;
