var Player = function (config) {
 return {
     piece: config.piece,
     icon: config.icon,
     pieceClass: config.pieceClass
 };
};

var GameThreeSquaredBoard = function(config){
  var self = this,
    TBODY = 'tbody',
    rowTemplate = '<tr></tr>',
    cellTemplate = [
      '<td id="{id}" class="space {class}">',
      '<i class="fa"></i>',
      '</td>'
      ].join(''),
    rows = ['top', 'middle', 'bottom'],
    cols = ['left', 'center', 'right'],
    boardDom = $(config.selector),
    boardSpacesSelector = '.space',
    // defaults
    spaces = 9,
    enabled = true,
    hal = config.hal,
    human = config.human,
    gameState;


  function startThinking(){
    $('.thinking').removeClass('hidden');
  }

  function stopThinking(){
    $('.thinking').addClass('hidden');
  }

  function coordinateToId(coord){
    return [
      '#',
      rows[coord[0]],
      '-',
      '',
      cols[coord[1]]
    ].join('');
  }

  function buildGameState(board, player, opponent){
    return new GameState({
        board: board,
        player: player,
        opponent: opponent
      });
  }

  function writeBoard(board){
    var j = 0, len = board.length;

    for(j; j < len; j++){
      var i = 0;
      for(; i < len; i++){
        var el = $(coordinateToId([j, i])),
            piece = board[j][i],
            playerObj = null;

        if(piece && piece.indexOf(human.piece) !== -1){
          playerObj = human;
        }else if(piece && piece.indexOf(hal.piece) !== -1){
          playerObj = hal;
        }

        if(piece && playerObj){
          el.data('player', piece)
            .find('.fa')
            .addClass(playerObj.pieceClass)
            .addClass(playerObj.icon);
        }
      }
    }
  }

  function readBoard() {
    var boardData = [];
    boardDom
      .find(boardSpacesSelector)
      .each(function(space){
        var spaceData = {
          id: this.id,
          value: $(this).data('player'),
          coords: $(this).data('coords')
        };

        boardData.push(spaceData);
      }
    );

    return {
      player: hal.piece,
      opponent: human.piece,
      boardData: boardData
    };
  }

  function buildBoard(){
    var board = new Board({
      spaces: spaces
    }),
    boardData = readBoard();

    boardData.boardData.forEach(function(val, idx, arr){
      if(val.value){
        board.placePlayer(val.value, val.coords);
      }
    });

    return board;
  }

  function clearBoard() {
    disable();
    boardDom.find(TBODY).empty();
    $('.overlay').addClass('hidden');
    writeDom();
    $('.start-button').removeClass('disabled');
  }

  function enable(){
    enabled = true;
  }

  function disable(){
    enabled = false;
  }

  function updateGameBoard(){
    disable();
    // think
    // get board data
    var data = readBoard();
    // create board
    var board = buildBoard(data);
    // state from board
    var state = buildGameState(
      board,
      data.player,
      data.opponent
    );

    // make computer move
    gameState = new PerfectComputerPlayer().takeTurn(state);

    // update board with computerClick
    writeBoard(gameState.getBoard().gameBoard());
    // update status, win/lose?
    stopThinking();
    if(gameState.isWon()){
      $('body').trigger('WINNER', [gameState.currentOpponent()]);
    }else if(gameState.isDraw()){
      $('body').trigger('DRAW');
    }else {
      enable();
    }
  }

  function halMove(){
    startThinking();
    setTimeout(
      updateGameBoard,
      100
    );
  }

  function onSpaceClick(){
    boardDom.on('click', '.space', function(e){
      var tgt = $(e.currentTarget);
      if(!tgt.data('player') && enabled === true){
        tgt
          .data('player', human.piece)
          .find('fa')
          .addClass(human.pieceClass)
          .addClass(human.icon);
          tgt.find('i').removeClass('hover');
          //update board
          startThinking();
          /** Gives us time to display thinking **/
          setTimeout(
            updateGameBoard,
            100
          );
      }

    });
  }


  function onHoverShowMove(){
    boardDom.on({
      mouseenter: function(e){
        var tgt = $(e.currentTarget);
        if(enabled === true && !tgt.data('player')){
          tgt.find('i')
            .addClass('hover')
            .addClass(human.pieceClass)
            .addClass(human.icon);
        }
      },
      mouseleave: function(e){
        var tgt = $(e.currentTarget);
        if(enabled === true && !tgt.data('player')){
          tgt
            .find('i')
            .removeClass('hover')
            .removeClass(human.pieceClass)
            .removeClass(human.icon);
        }
      }
    }, '.space');
  }

  function onWin(e, player){
    var text = 'YOU WON!';

    if(hal.piece.indexOf(player) === 0){
      text = 'HAL WON!';
    }

    $('.overlay').text(text).removeClass('hidden');

  }

  function onDraw(e){
    $('.overlay').text('DRAW!').removeClass('hidden');
  }

  function writeDom(){
    var tbody = boardDom.find(TBODY);
    tbody.empty();
    rows.forEach(function(val, idx, arr){
      var row = $(rowTemplate)
      cols.forEach(function(v, i, a){
        var col = $(
          cellTemplate
            .replace(
              /\{class\}|\{id\}/g,
              [val, '-', v].join('')
            )
        );
        col.data('coords', {row: idx, col: i});
        row.append(col);
      });
      tbody.append(row);
    });
  }

  function onPlayAgain(e){
    var tgt = $(e.currentTarget);

    // reset board
    tgt.addClass('hidden');
    clearBoard();
    $('.who-starts').show();
  }

  function registerEvents() {
    onHoverShowMove();
    onSpaceClick();
    $('body').on('click', '.play-again', onPlayAgain);
    $('body').on('WINNER', onWin);
    $('body').on('DRAW', onDraw);
    $('body').on('DRAW WINNER', function(e){
      $('.play-again').removeClass('hidden');
    });
  }

  function init(config){
    registerEvents();
    clearBoard();
    if(config.halStarts){
      // totally should be an event
      disable();
      halMove();
    }else{
      enable();
    }
  }

  return {
    init: init,
    reset: clearBoard
  };

};

$(document).ready(function(){
  var x = new Player({
    piece: 'x',
    icon: 'fa-times',
    pieceClass: 'computer'
  }),
  o = new Player({
    piece: 'o',
    icon: 'fa-circle-o',
    pieceClass: 'human'
  }), game;

  $('.start-button').on(
    'click',
    function(e){
      var tgt = $(e.currentTarget),
        halStarts = false;
      $('.footer .who-starts').hide();

      if(!tgt.hasClass('disabled')){
        var hal, human;
        if(tgt.hasClass('you-start')){
          x.pieceClass = 'human';
          o.pieceClass = 'computer';
          hal = o;
          human = x;
        }else {
          halStarts = true;
          hal = x;
          human = o;
        }

        game = new GameThreeSquaredBoard({
          hal: hal,
          human: human,
          selector: '#board'
        });

        game.init({
          halStarts: halStarts
        });

        $('.start-button').addClass('disabled');
      }
  });
});
