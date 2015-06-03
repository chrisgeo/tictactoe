var Board = function (config){
    var defaults = {
        spaces: 9
    },
    gameBoard,
    emptySpaces = [],
    emptySpacesLeft = config.spaces,
    corners,
    maxIndex;

    // check config is 'squareable'
    if (Math.sqrt(config.spaces) % 1 !== 0 ) {
       throw "Not a square number! Spaces = " + config.spaces;
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
      var inArray = false;

      // could use some
      emptySpaces.some(function(val, idx){
        inArray = _.isEqual(val, position);
        return inArray;
      });

      return inArray;
    }

    function isBlank(){
      return emptySpacesLeft === config.spaces;
    }

    function whosThere (position) {
        if(!isEmptySpace(position)) {
            return gameBoard[position.row][position.col];
        }
    }


    function getEmptySpacesLeft(){
      return emptySpacesLeft;
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
        corners = getCorners();
        createEmptySpaces();
    }

    init();

    return {
      width: Math.sqrt(config.spaces),
      isBlank: isBlank,
      maxIndex: maxIndex,
      boardSize: config.spaces,
      isEmptySpace: isEmptySpace,
      whosThere: whosThere,
      placePlayer: placePlayer,
      corners: corners,
      anyEmptySpaces: anyEmptySpaces,
      getEmptySpacesLeft: getEmptySpacesLeft,
      getEmptySpaces: getEmptySpaces,
      gameBoard: getGameBoard //debug
    };
};
