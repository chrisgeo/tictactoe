var Board = require('../scripts/board.js');
var GameState = require('../scripts/game-state.js');
var PerfectComputerPlayer = require('../scripts/player.js');

var assert = require("assert");

var demand = require('must');

var _ = require('../scripts/lodash.min.js');

var utils = require('../scripts/utils.js');


describe('Board', function () {
  it('Should exist', function () {
    demand(Board).to.exist();
  });

  it('Board Makes Moves', function (){
    var b = new Board({spaces: 9});
    b.placePlayer('o', {
      row: 0,
      col: 0
    });

    assert.equal('o', b.whosThere({
      row: 0,
      col: 0
    }));

    b.placePlayer('x', {
      row: 1,
      col: 0
    });

    assert.equal('x', b.whosThere({
      row: 1,
      col: 0
    }));

    assert.equal('o', b.whosThere({
      row: 0,
      col: 0
    }));

    assert.notEqual('o', b.whosThere({
      row: 2,
      col: 0
    }));

    assert.equal(0, b.whosThere({
      row: 1,
      col: 1
    }));

    assert.equal(true, b.isEmptySpace({row: 1, col: 1}));

    assert.notEqual(
      -1,
      _.indexOfObj(
        b.getEmptySpaces(),
        {row: 2, col: 1}
      )
    );

    assert.equal(
      -1,
      _.indexOfObj(
        b.getEmptySpaces(),
        {row: 0, col: 0}
      )
    );
  });

});


describe('GameState', function () {
  it('Should exist', function () {
    demand(GameState).to.exist();
  });

  it('Game X Wins/O Loses', function () {
    var b = new Board({spaces: 9});
    var state = new GameState({
      board: b,
      player: 'x',
      opponent: 'o'
    });

    assert.equal(true, state.blankBoard());

    assert.equal(false, state.didIWin('x'));
    assert.equal(false, state.didIWin('o'));
    assert.equal(false, state.isWon());
    assert.equal(false, state.isLost());
    assert.equal(false, state.isDraw());

    assert.equal(9, state.availableMoves());
    state = state.makeMove({row: 0, col: 0}); // x moves
    assert.equal(
      8,
      state.availableMoves()
    );
    assert.equal(
      -1,
      _.indexOfObj(
        state.emptySpaces(),
        {row: 0, col: 0}
      )
    );
    state = state.makeMove({row: 1, col: 1}); // o moves
    state = state.makeMove({row: 1, col: 0}); // x moves
    state = state.makeMove({row: 2, col: 1}); // o moves
    state = state.makeMove({row: 2, col: 0}); // x moves
    assert.equal(
      4,
      state.availableMoves()
    );
    assert.equal(true, state.didIWin('x'));
    assert.equal(false, state.didIWin('o'));
  });

  it('Game X Loses/O Wins', function () {
    var b = new Board({spaces: 9});
    var state = new GameState({
      board: b,
      player: 'x',
      opponent: 'o'
    });

    assert.equal(true, state.blankBoard());

    assert.equal(false, state.didIWin('x'));
    assert.equal(false, state.didIWin('o'));
    assert.equal(false, state.isWon());
    assert.equal(false, state.isLost());
    assert.equal(false, state.isDraw());

    assert.equal(9, state.availableMoves());

    state = state.makeMove({row: 0, col: 0}); // x moves

    assert.equal(
      8,
      state.availableMoves()
    );
    assert.equal(
      -1,
      _.indexOfObj(
        state.emptySpaces(),
        {row: 0, col: 0}
      )
    );


    state = state.makeMove({row: 1, col: 0}); // o moves
    state = state.makeMove({row: 0, col: 1}); // x moves
    state = state.makeMove({row: 1, col: 1}); // o moves
    state = state.makeMove({row: 2, col: 1}); // x moves
    state = state.makeMove({row: 1, col: 2}); // o moves

    assert.equal(
      3,
      state.availableMoves()
    );

    assert.equal(false, state.didIWin('x'));
    assert.equal(true, state.didIWin('o'));

  });

  it('Game Draws', function (){
    var b = new Board({spaces: 9});
    var state = new GameState({
      board: b,
      player: 'x',
      opponent: 'o'
    });
    state = state.makeMove({row: 1, col: 1}); // x moves to middle
    state = state.makeMove({row: 0, col: 2}); // o moves to top right
    state = state.makeMove({row: 0, col: 1}); // x moves to top middle
    state = state.makeMove({row: 2, col: 1}); // o moves to bottom middle
    state = state.makeMove({row: 2, col: 2}); // x moves to bottom right
    state = state.makeMove({row: 0, col: 0}); // o moves to top left
    state = state.makeMove({row: 1, col: 0}); // x moves to middle left
    state = state.makeMove({row: 1, col: 2}); // o moves to middle right
    state = state.makeMove({row: 2, col: 0}); // x moves bottom left
    assert.equal(false, state.didIWin('x'));
    assert.equal(false, state.didIWin('o'));
    assert.equal(false, state.isWon());
    assert.equal(false, state.isLost());
    assert.equal(true, state.isDraw());
  });
});


describe('PerfectComputerPlayer', function () {
  it('Should exist', function () {
    demand(PerfectComputerPlayer).to.exist();
  });

  it('Computer finds best next move', function (){
    var b = new Board({spaces: 9});
    var state = new GameState({
      board: b,
      player: 'x',
      opponent: 'o'
    });


  });
});



