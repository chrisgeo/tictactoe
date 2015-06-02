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


  function buildGameState(board, player, opponent){
    return new GameState({
        board: board,
        player: player,
        opponent: opponent
      });
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
    var board = buildBoard(data);
    var state = buildGameState(
      board,
      data.player,
      data.opponent
    );

    state = new PrefectComputerPlayer().takeTurn(state);
    console.log(state, state.getBoard());
    // create board
    // make computer move

    // update status, win/lose?
    // update board with computerClick

    // finish thinking

    //
    enable();
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
          updateGameBoard();
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

  function registerEvents() {
    onHoverShowMove();
    onSpaceClick();
  }

  function init(){
    registerEvents();
    writeDom();
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
      var tgt = $(e.currentTarget);

      if(!tgt.hasClass('disabled')){
        var hal, human;
        if(tgt.hasClass('.you-start')){
          x.pieceClass = 'human';
          o.pieceClass = 'computer';
          hal = o;
          human = x;
        }else{
          hal = x;
          human = o;
        }

        game = new GameThreeSquaredBoard({
          hal: hal,
          human: human,
          selector: '#board'
        });
        game.init();
        $('.start-button').addClass('disabled');
      }
  });
});
