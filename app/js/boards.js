const Base = require('./base');

class Boards extends Base {
    constructor() {
        super();
        this.main = this.class('main-container')[0];
        this.player = {};
        this.ai = {};
        this.fieldState = {illicit: 'illicit', empty: 'empty', miss: 'miss', ship: 'ship', hit: 'hit', sunk: 'sunk'};
        this.fieldClasses = this.createFieldClasses();
    }

    create() {
        this.initBoard('player');
        this.initBoard('ai');
        console.info('INFO: Boards rendered.');
    }

    createFieldClasses() {
        let object = {};

        for (let key in this.fieldState) {
            object[key] = `field--${key}`;
        }

        return object;
    }

    initBoard(name) {
        let board = document.createElement('div');
        board.addClass(['board', 'board-' + name]);
        this.main.append(board);

        this[name] = {name: name, DOM: {board: this.class('board-' + name)[0]}, active: false};

        this.createFields(this[name]);
        this.createLabels(this[name]);

        if (name === 'player') {
            this.shipHolder = this.createShipHolder();
        }
    }

    createFields(board) {
        this.letters = 'ABCDEFGHIJ';
        board.field = {};
        for (let i = 1; i <= 10; i++) {
            let row = document.createElement('div').addClass(['row', `row-${i}`]);
            board.DOM.board.append(row);
            for (let j = 0; j < 10; j++) {
                board.field[`${this.letters[j]}${i}`] = this.fieldState.empty;
                let field = document.createElement('div')
                    .addClass(['field', `${this.letters[j]}${i}`, this.fieldClasses.empty, board.name]);
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
        this.player.DOM.board.prepend(shipHolderWrapper);

        let shipHolderText = document.createElement('span')
            .addClass('ship-holder__text')
            .innerText = 'Place ship:';
        shipHolderWrapper.append(shipHolderText);

        let shipHolder = document.createElement('div')
            .addClass('ship-holder__ship');
        shipHolderWrapper.append(shipHolder);

        this.player.DOM.shipHolder = shipHolder;
        return shipHolder;
    }

}

module.exports = new Boards;
