var PrefectComputerPlayer = function(config){
  var START_DEPTH = 0,
    BoardSpace,
    baseScore = 10,
    playerPiece,
    gameState,
    currentMove;

  BoardSpace = function(score, playerMove) {
    this.score = score;
    this.playerMove = playerMove;
  };

  function findMax(array, property){
    var maxObj = _.max(array, function(obj){
      return obj[property];
    });

    return array[array.indexOf(maxObj)];
  }

  function takeTurn(state){
    if(state.gameOver()){
      return state;
    }

    gameState = state;
    playerPiece = gameState.currentPlayer();
    gameState.makeMove(chooseMove());
  }

  function getRandomPosition(corners){
    return corners[Math.floor(Math.random() * corners.length)];
  }

  function chooseMove(){
    if(gameState.blankBoard()){
      return getRandomPosition(gameState.corners);
    }else if(gameState.finishThem()){
      return gameState.finishThem();
    }

    return findBestMove();
  }

  function findBestMove(){
    var bound;
    baseScore = gameState.emptySpaces().length + 1;
    bound = baseScore + 1;
    minMax(gameState, START_DEPTH, -bound, bound);
    return currentMove;

  }

  function minMax(state, depth, lowerBound, upperBound){
    if(state.gameOver()){
      return figureOutState(state, depth);
    }

    var possibleMoves = [],
        i = 0,
        currentMove,
        emptySpaces = state.emptySpaces();

    for(i = 0; i < emptySpaces.length; i++){
      var childBoard = state.makeMove(emptySpaces[i]),
        score = minMax(childBoard, depth + 1, lowerBound, upperBound),
        node = new BoardSpace(score, emptySpaces[i]);
        console.log(lowerBound, upperBound, score);

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
    console.log('currentMove: ', currentMove);
    return lowerBound;
  }

  function figureOutState(state, depth){
    if(state.isWon(playerPiece)){
      return baseScore - depth;
    }else if(state.isLost(playerPiece)){
      return depth - baseScore;
    }else {
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
