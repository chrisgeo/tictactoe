var _ = _ || undefined;
if(!_){
  // hacks for node tests
  _ = require('./lodash.min.js');
}

var PerfectComputerPlayer = function(config){
  var START_DEPTH = 0,
    defaultScore = 10,
    playerPiece,
    currentMove,
    BoardNode = function(score, position, piece){
      return {
        score: score,
        position: position,
        piece: piece
      };
    };

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

    var move = chooseMove(state);
    return state.makeMove(move);
  }

  function getRandomPosition(corners){
    return corners[Math.floor(Math.random() * corners.length)];
  }

  function chooseMove(gameState){
    playerPiece = gameState.currentPlayer();

    if(gameState.blankBoard()){
      return getRandomPosition(gameState.corners);
    }else if(gameState.emptySpaces().length === 1){
      return gameState.finishTheFight();
    }

    return findBestMove(gameState);
  }

  function findBestMove(gameState){
    minMax(gameState, 0);
    return currentMove;

  }

  function minMax(state, depth){
    if(state.gameOver()){
      return figureOutState(state, depth);
    }
    var scores = [],
      possibleMoves = [],
      emptySpaces = state.emptySpaces();

    depth = depth + 1;

    emptySpaces.forEach(function parsePiece(val, idx, arr){
      var childBoard = state.makeMove(val);
      var score = minMax(childBoard, depth + 1);
      scores.push(score);
      possibleMoves.push(val);
    });

    if(playerPiece.indexOf(state.currentPlayer()) !== -1){
      var index = _.indexOf(scores, arrayMax(scores));
      currentMove = possibleMoves[index];
      return scores[index];
    }else {
      var index = _.indexOf(scores, arrayMin(scores));
      currentMove = possibleMoves[index];
      return scores[index];
    }
  }

  function figureOutState(state, depth){
    if(state.didIWin(playerPiece)){
      return defaultScore - depth;
    }else if(state.didILose(playerPiece)){
      return depth - defaultScore;
    }

    return 0;
  }

  return {
    takeTurn: takeTurn,
    chooseMove: chooseMove,
    minMax: minMax
  };
};

if(module) module.exports = PerfectComputerPlayer;
