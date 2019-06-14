const Base = require('./base');

class Boards extends Base {
    constructor() {
        super();
        this.main = this.class('main-container')[0];
        this.Boards = {};
        this.fieldState = ['empty', 'miss', 'ship', 'hit', 'sunk'];
        this.fieldClasses = this.createFieldClasses();
    }

    create() {
        this.initBoard('player');
        this.initBoard('ai');
        console.info('INFO: Boards rendered.');
    }

    createFieldClasses() {
        let object = {};
        this.fieldState.forEach(state => {
            object[state] = `field--${state}`;
        });
        return object;
    }

    initBoard(name) {
        let board = document.createElement('div');
        board.addClass(['board', 'board-' + name]);
        this.main.append(board);

        this.Boards[name] = {name: name, DOM: {board: this.class('board-' + name)[0]}, active: false};

        this.createFields(this.Boards[name]);
        this.createLabels(this.Boards[name]);

        if (name === 'player') {
            this.shipHolder = this.createShipHolder();
        }
    }

    createFields(board) {
        this.letters = 'ABCDEFGHIJ';
        board.field = {};
        for (let i = 0; i < 10; i++) {
            let row = document.createElement('div').addClass(['row', `row-${this.letters[i]}`]);
            board.DOM.board.append(row);
            for (let j = 1; j <= 10; j++) {
                board.field[`${this.letters[i]}${j}`] = this.fieldState[0];
                let field = document.createElement('div').addClass(['field', this.fieldClasses['empty'], board.name, `${this.letters[i]}${j}`]);
                row.append(field);
            }
        }
    }

    createLabels(board) {
        let horizontalLabels = document.createElement('div').addClass('label-container--horizontal');
        let verticalLabels = document.createElement('div').addClass('label-container--vertical');
        board.DOM.board.append(horizontalLabels);
        board.DOM.board.append(verticalLabels);

        for (let i = 0; i < 10; i++) {
            let horizontalLabel = document.createElement('div').addClass('label');
            horizontalLabel.innerText = this.letters[i];
            horizontalLabels.append(horizontalLabel);

            let verticalLabel = document.createElement('div').addClass('label');
            verticalLabel.innerText = i+1;
            verticalLabels.append(verticalLabel);
        }

    }

    createShipHolder() {
        let shipHolderWrapper = document.createElement('div').addClass('ship-holder');
        this.Boards.player.DOM.board.prepend(shipHolderWrapper);

        let shipHolderText = document.createElement('span')
            .addClass('ship-holder__text')
            .innerText = 'Place ship:';
        shipHolderWrapper.append(shipHolderText);

        let shipHolder = document.createElement('div')
            .addClass('ship-holder__ship');
        shipHolderWrapper.append(shipHolder);

        this.Boards.player.DOM.shipHolder = shipHolder;
        return shipHolder;
    }

}

module.exports = new Boards;
