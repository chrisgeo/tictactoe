var _ = _ || undefined;
if(!_){
  // hacks for node tests
  _ = require('./lodash.min.js');
}

var Board = function (config){
    var defaults = {
        spaces: 9
    },
    gameBoard,
    emptySpaces = [],
    emptySpacesLeft = config.spaces,
    maxIndex;

    // check config is 'squareable'
    if (Math.sqrt(config.spaces) % 1 !== 0 ) {
       throw "Not a square number! Spaces = " + config.spaces;
    }

    function __setEmpties(empties){
      emptySpaces = empties;
    }

    function __setBoard(board){
      gameBoard = board;
    }

    function clone(){
      var newObj = new Board({spaces: config.spaces});
      newObj.__setBoard(gameBoard.map(function(arr){
        return arr.slice();
      }));
      newObj.__setEmpties(emptySpaces.slice());
      return newObj;
    }

    function anyEmptySpaces() {
      return emptySpacesLeft !== 0;
    }

    function removeEmptySpace(){
      return emptySpaces.pop();
    }

    function getEmptySpaces(){
      return emptySpaces;
    }

    function isEmptySpace (position) {
      var piece = gameBoard[position.row][position.col];

      return piece === 0 ? true : false;
    }

    function isBlank(){
      return emptySpacesLeft === config.spaces;
    }

    function whosThere (position) {
        return gameBoard[position.row][position.col];
    }


    function getEmptySpacesLeft(){
      return emptySpaces.length;
    }

    function placePlayer (player, position) {
        emptySpaces = emptySpaces.deleteObject(position);
        emptySpacesLeft = emptySpacesLeft - 1;
        gameBoard[position.row][position.col] = player;
    }

    function createEmptySpaces () {
      var dimension = Math.sqrt(config.spaces),
        i = 0;
      // probably a better way to do this
      // with Array.map
      for(; i < dimension; i++){
        for(var j = 0; j < dimension; j++){
          emptySpaces.push(
            {
              row: i,
              col: j
            }
          );
        }
      }

    }

    function createBoard (spaces) {
        /***
         * Boards are always square
         ***/
        var dimension = Math.sqrt(spaces),
            board = [];


        for(var i = 0; i < dimension; i++){
            var tmp = Array.apply(
                null,
                Array(dimension)
            )
            .map(Boolean)
            .map(Number);

           board.push(tmp);
        }

        return board;
    }

    function getCorners () {
      var corners = [];
      // only 4 corners in a square
      // row 0 column 0 top left
      corners.push({row: 0, col: 0});

      // row 0 column row[0].length top right
      corners.push({row: 0, col: maxIndex});

      // row board.length, col 0 : bottom left
      corners.push({row: maxIndex, col: 0});

      // bottom right
      corners.push({row: maxIndex, col: maxIndex});
      return corners;

    }

    function getGameBoard(){
      return gameBoard;
    }

    function init (){
        maxIndex = Math.sqrt(config.spaces) - 1;
        gameBoard = createBoard(config.spaces);
        createEmptySpaces();
    }

    function toString(){
      var i = 0, board = '';

      for(; i < gameBoard.length; i++){
        board = [board, gameBoard[i].toString(), "\n"].join("");
      }

      return board;
    }

    function occupiedSpaces() {
      return config.spaces - emptySpacesLeft;
    }


    init();

    return {
      clone: clone,
      toString: toString,
      width: Math.sqrt(config.spaces),
      isBlank: isBlank,
      maxIndex: maxIndex,
      boardSize: config.spaces,
      isEmptySpace: isEmptySpace,
      whosThere: whosThere,
      placePlayer: placePlayer,
      corners: getCorners(),
      anyEmptySpaces: anyEmptySpaces,
      getEmptySpacesLeft: getEmptySpacesLeft,
      getEmptySpaces: getEmptySpaces,
      gameBoard: getGameBoard,
      occupiedSpaces: occupiedSpaces,
      __setBoard: __setBoard,
      __setEmpties: __setEmpties
    };
};

var module = module || undefined;
if(module){
 module.exports = Board;
}
