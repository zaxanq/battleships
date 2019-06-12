const Base = require('./base');

class Board extends Base {
    constructor() {
        super();
        this.main = this.class('main-container')[0];
        this.Boards = {};
        this.fieldState = ['empty', '', 'ship', '']
    }

    createBoards() {
        this.initBoard('player');
        this.initBoard('ai');
    }

    initBoard(name) {
        let board = document.createElement('div');
        board.addClass(['board', 'board-' + name]);
        this.main.append(board);
        this.Boards[name] = {DOM: this.class('board-' + name)[0], active: false};

        this.createFields(this.Boards[name]);
    }

    createFields(board) {
        let letters = 'ABCDEFGH';
        board.field = {};
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; i++) {
                board.field[`${letters[i]}${j}`] = this.fieldState[0];
            }
        }
    }

}

module.exports = Board;
