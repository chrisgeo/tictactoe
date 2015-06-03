if(!Array.prototype.deleteObject){
  Array.prototype.deleteObject = function(object){
    // depend on lodash
    return this.filter(function filterObjects(val){
      // filter out objects that
      // are not equal to the ``` object ```
      return !_.isEqual(val, object);
    });
  };
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

