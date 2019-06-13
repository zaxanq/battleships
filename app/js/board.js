const Base = require('./base');

class Board extends Base {
    constructor() {
        super();
        this.main = this.class('main-container')[0];
        this.Boards = {};
        this.fieldState = ['empty', 'miss', 'ship', 'hit', 'sunk'];
        this.fieldClasses = this.createFieldClasses();
    }

    createFieldClasses() {
        let object = {};
        this.fieldState.forEach(state => {
            object[state] = `field--${state}`;
        });
        return object;
    }

    createBoards() {
        this.initBoard('player');
        this.initBoard('ai');
    }

    initBoard(name) {
        let board = document.createElement('div');
        board.addClass(['board', 'board-' + name]);
        this.main.append(board);
        this.Boards[name] = {name: name, DOM: {board: this.class('board-' + name)[0], active: false}};

        this.createFields(this.Boards[name]);
    }

    createFields(board) {
        let letters = 'ABCDEFGH';
        board.field = {};
        for (let i = 0; i < 8; i++) {
            let row = document.createElement('div').addClass(['row', `row-${letters[i]}`]);
            board.DOM.board.append(row);
            for (let j = 1; j <= 8; j++) {
                board.field[`${letters[i]}${j}`] = this.fieldState[0];
                let field = document.createElement('div').addClass(['field', board.name, `${letters[i]}${j}`]);
                row.append(field);
            }
        }
    }

}

module.exports = Board;
