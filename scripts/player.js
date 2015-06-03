var PerfectComputerPlayer = function(config){
  var START_DEPTH = 0,
    defaultScore = 10,
    baseScore = 10,
    playerPiece,
    currentMove;

  function findMaxWithProperty(array, property){
    var maxObj = _.max(array, function(obj){
      return obj[property];
    });

    return array[array.indexOf(maxObj)];
  }

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
    playerPiece = state.currentPlayer();
    var move = chooseMove(state);
    return state.makeMove(move);
  }

  function getRandomPosition(corners){
    return corners[Math.floor(Math.random() * corners.length)];
  }

  function chooseMove(gameState){
    if(gameState.blankBoard()){
      return getRandomPosition(gameState.corners);
    }else if(gameState.finishThem()){
      return gameState.finishThem();
    }

    return findBestMove(gameState);
  }

  function findBestMove(gameState){
    console.log(minMax(gameState, START_DEPTH));
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

    if(_.isEqual(state.playerPiece, state.currentPlayer())){
      var index = _.indexOf(scores, arrayMax(scores));
      currentMove = possibleMoves[index];
      console.log("MAX INDEX:", currentMove, scores[index], index);
      return scores[index];
    }else {
      var index = _.indexOf(scores, arrayMin(scores));
      currentMove = possibleMoves[index];
      console.log("MIN INDEX:", currentMove, scores[index], index);
      return scores[index];
    }
  }

  /**

  function minMax(state, depth, lowerBound, upperBound){
    if(state.gameOver()){
      return figureOutState(state, depth);
    }

    var possibleMoves = [],
        i = 0,
        emptySpaces = state.emptySpaces();

    for(i = 0; i < emptySpaces.length; i++){
      var childBoard = state.makeMove(emptySpaces[i]),
        score = minMax(childBoard, depth + 1, lowerBound, upperBound),
        node = new BoardSpace(score, emptySpaces[i]);

        if(_.isEqual(state.currentPlayer(), playerPiece)){
          possibleMoves.push(node);

          if(node.score > lowerBound){
            lowerBound = node.score;
          }
        }else if(node.score < upperBound){
          upperBound = node.score;
        }

        if(upperBound < lowerBound){
          break;
        }
    }

    if(!_.isEqual(state.currentPlayer(), playerPiece)){
      return upperBound;
    }

    currentMove = findMax(possibleMoves, 'score').playerMove;
    return lowerBound;
  }

  **/

  function figureOutState(state, depth){
    if(state.didIWin(playerPiece)){
      return defaultScore - depth;
    }else if(state.didILose(playerPiece)){
      return depth - defaultScore;
    }else{
      return 0;
    }
  }

  return {
    takeTurn: takeTurn,
    chooseMove: chooseMove,
    findBestMove: findBestMove,
    figureOutState: figureOutState
  };
};
