const Base = require('./base');

class Boards extends Base {
    constructor() {
        super();
        this.main = this.class('main-container')[0];
        this.player = {};
        this.ai = {};
        this.fieldState = {illicit: 'illicit', empty: 'empty', miss: 'miss', ship: 'ship', hit: 'hit', sunk: 'sunk', neighbour: 'neighbour'};
        this.fieldClasses = this.createFieldClasses();
        this.fieldClassesArray = this.createFieldClasses(true);
    }

    create() {
        this.initBoard('player');
        this.initBoard('ai');
        console.info('INFO: Boards rendered.');
    }

    createFieldClasses(createArray = false) {
        /* Creates an object or array (depending on the parameter) with the field classes depending on this.fieldState
            object. Object contains elements as pair "state: 'field--state'" while array contains only "field--state". */

        if (!createArray) {
            let object = {};

            for (let key in this.fieldState) {
                object[key] = `field--${key}`;
            }

            return object;
        } else {
            let array = [];

            for (let key in this.fieldState) {
                array.push(`field--${key}`);
            }

            return array;
        }
    }

    initBoard(name) {
        /* Creates a board according tothe parameter. Function is executed twice to create 2 boards.
            Method executes 2 other functions that create rows and field in the board as well as labels. */

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
        /* Method creates 10 rows and in each row creates 10 fields. Rows are named row-1, row-2,...
            while fields are names A1, B1,... Each field is given an empty state class and board.name class. */

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
        /* This method adds labels (A, B, C,.. & 1, 2, 3,...) displayed outside the board. */

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
        /* Initializes the current-ship panel that is later shown with Mechanism.creatCurrentShipToPlace() method. */

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
