const Base = require('./base');
const Boards = require('./boards');

class Mechanism extends Base {
    constructor() {
        super();
        this.gameStatus = 0; //0 - not started, 1 - ship placement, 2 - game starts, 3 - game finished
    }

    start() {
        this.initAlerts();
        this.initShips();
        this.addListeners();
        this.gameStart();
    }

    initAlerts() {
        this.alertMessage = this.id('alert-message');
        this.alertOverlay = this.class('alert-overlay')[0];
        this.id('alert-ok').addEventListener('click', event => {
            event.stopPropagation();
            this.alertOverlay.removeClass('visible');
        });
        console.info('INFO: Alerts loaded.');
    }

    alert(msg) {
        this.alertMessage.innerText = msg;
        this.alertOverlay.addClass('visible');
    }

    initShips() {
        this.gameStatus = 1; // ship placement started
        this.defineShips();
        this.playerShips = this.assertShips();
        this.aiShips = this.assertShips();

        this.currentShip = {size: 5, number: 0};
        this.placedShips = [];
        this.createCurrentShipToPlace();
    }

    defineShips() {
        this.ships = {};
        for (let i = 0; i < 5; i++) {
            this.ships[5 - i] = i + 1;
        }
    }

    addListeners() {
        [...this.DOM('.board-player > .row > .field')].map(field => {
            field.addEventListener('click', () => {
                if (this.gameStatus === 1) {
                    this.placeShip(field);
                }
            });
        });
        console.info('INFO: Listeners added.');
    }

    gameStart() {
        // this.alert('Game starts.\nYour board is on the left.\nPlease place your ships.')
    }

    placeShip(field) {
        let coords = field.classList[1];
        for (let size = 0; size < 5 - this.currentShip.size + 1; size++) {
            for (let position = 0; position < 5 - size + 1; position++) {
                if (this.playerShips[this.currentShip.size][size][position] === null) {
                    let validation = this.validateField(field);
                    if (validation.result) {
                        this.changeField(field, Boards.fieldClasses.ship);
                        this.playerShips[this.currentShip.size][size][position] = coords;
                        Boards.player.field[coords] = Boards.fieldState.ship;

                        this.renderIllicitFields(this.playerShips[this.currentShip.size][size]);
                    } else {
                        position--;
                        this.alert(validation.reason);
                    }

                    if (position === this.currentShip.size - 1) {
                        this.currentShip.number++;
                        console.log(this.currentShip, this.ships[this.currentShip.size]);
                        if (this.currentShip.number === this.ships[this.currentShip.size]) {
                            this.placedShips.push(this.currentShip.size);
                            this.currentShip.size--;
                            this.currentShip.number = 0;
                        }
                        if (this.currentShip.size === 0) {
                            this.assertAiShips();
                        } else {
                            this.updateCurrentShipToPlace();
                            this.renderIllicitFieldsAroundShips();
                        }
                    }
                    return;
                }
            }
        }
    }

    validateField(field) {
        if (field.hasClass(Boards.fieldClasses.ship)) {
            return {result: false, reason: 'ship-already-placed'};
        }
        if (field.hasClass(Boards.fieldClasses.illicit)) {
            return {result: false, reason: 'illicit-field'};
        }
        return {result: true};
    }

    changeField(field, state) {
        field.removeClass(Boards.fieldClassesArray).addClass(state);
    }

    renderIllicitFieldsAroundShips() {
        this.clearBoard(Boards.fieldState.empty);

        let ships = [...this.DOM(`.board-player > .row > .${Boards.fieldClasses.ship}`)];
        let shipsCoords = ships.map(ship => ship.classList[1]);
        let areaAroundShips = [];

        for (let i = 0; i < shipsCoords.length; i++) {
            this.joinArrays(areaAroundShips, this.findNeighboursAround(shipsCoords[i]));
        }
        this.findNeighboursInCorners(shipsCoords, areaAroundShips);

        for (let i = 0; i < areaAroundShips.length; i++) {
            this.updateField(this.class(areaAroundShips[i])[0], Boards.fieldState.empty, Boards.fieldState.neighbour);
        }
    }

    clearBoard(fieldState) {
        let toRemove = fieldState === Boards.fieldState.empty ? Boards.fieldState.illicit : Boards.fieldState.empty;
        let fields = this.DOM(`.board-player > .row > .${Boards.fieldClasses[toRemove]}`);

        for (let i = 0; i < fields.length; i++) {
            this.updateField(fields[i], toRemove, fieldState);
        }
    }

    updateField(field, fieldClassToRemove, fieldClassToAdd) {
        if (field && field.doesntHaveClass(Boards.fieldClassesArray.slice(2))) {
            field.removeClass(Boards.fieldClasses[fieldClassToRemove]).addClass(Boards.fieldClasses[fieldClassToAdd]);
        }
    }

    renderIllicitFields(ship) {
        this.clearBoard(Boards.fieldState.illicit);

        let i;
        for (i = ship.length - 1; i >= 0; i--) {
            if (ship[i] !== null) {
                break;
            }
        }

        if (i + 1 === 1) {
            this.renderValidFields(this.findNeighboursAround(ship[i]));
        } else {
            this.renderValidFields(this.findNeighboursInLine(ship));
        }
    }

    renderValidFields(array) {
        array.map(field => {
            if (field) {
                if (typeof field !== 'string') { // if array actually consists of arrays of coords
                    field.map(element => {
                        this.updateField(this.class(element)[0], Boards.fieldState.illicit, Boards.fieldState.empty);
                    });
                } else { // if it's just one coord
                    this.updateField(this.class(field)[0], Boards.fieldState.illicit, Boards.fieldState.empty);
                }
            }
        });
    }

    checkCoord(coord, direction) {
        if (direction === 'L' && coord !== Boards.letters[0]) {
            return true;
        } else if (direction === 'R' && coord !== Boards.letters[9]) {
            return true;
        } else if (direction === 'U' && coord !== 1) {
            return true;
        } else if (direction === 'D' && coord !== 10) {
            return true;
        }
    }

    findNeighboursAround(coords, direction) {
        let array = [];
        let x = coords.slice(0, 1);
        let y = parseInt(coords.slice(1));

        if (typeof direction === 'undefined' || direction === 'vertical') {
            if (this.checkCoord(y, 'U')) {
                array.push(Boards.letters[Boards.letters.indexOf(x)] + (y - 1));
            }
            if (this.checkCoord(y, 'D')) {
                array.push(Boards.letters[Boards.letters.indexOf(x)] + (y + 1));
            }
        }
        if (typeof direction === 'undefined' || direction === 'horizontal') {
            if (this.checkCoord(x, 'L')) {
                array.push(Boards.letters[Boards.letters.indexOf(x) - 1] + y);
            }
            if (this.checkCoord(x, 'R')) {
                array.push(Boards.letters[Boards.letters.indexOf(x) + 1] + y);
            }
        }
        return array;
    }

    findNeighboursInLine(ship) {
        this.shipDirection = this.determineDirection(ship);
        let array = [];
        ship.map(point => {
            if (point) {
                array.push(this.findNeighboursAround(point, this.shipDirection));
            }
        });
        return array;
    }

    findNeighboursInCorners(ship, array) {
        array.push(this.move(ship[0], 'UL'));
        array.push(this.move(ship[ship.length - 1], 'DR'));

        if (this.shipDirection === 'horizontal') {
            array.push(this.move(ship[0], 'DL'));
            array.push(this.move(ship[ship.length - 1], 'UR'));
        } else {
            array.push(this.move(ship[0], 'UR'));
            array.push(this.move(ship[ship.length - 1], 'DL'));
        }

        return array;
    }

    move(coords, direction) {
        if (coords) {
            let x = coords[0];
            let y = parseInt(coords.slice(1));

            if (direction === 'U' && this.checkCoord(y, direction)) {
                return x + (y - 1);
            } else if (direction === 'D' && this.checkCoord(y, direction)) {
                return x + (y + 1);
            } else if (direction === 'L' && this.checkCoord(x, direction)) {
                return Boards.letters[Boards.letters.indexOf(x) - 1] + y;
            } else if (direction === 'R' && this.checkCoord(x, direction)) {
                return Boards.letters[Boards.letters.indexOf(x) + 1] + y;
            } else if (direction === 'UL') {
                return this.move(this.move(coords, 'U'), 'L');
            } else if (direction === 'UR') {
                return this.move(this.move(coords, 'U'), 'R');
            } else if (direction === 'DL') {
                return this.move(this.move(coords, 'D'), 'L');
            } else if (direction === 'DR') {
                return this.move(this.move(coords, 'D'), 'R');
            }
        }
    }

    determineDirection(ship) {
        let x, y;
        for (let i = 0; i < ship.length; i++) {
            if (ship[i]) {
                if (x && y) {
                    if (x !== ship[i][0]) {
                        return 'horizontal';
                    } else {
                        return 'vertical';
                    }
                }
                x = ship[i][0];
                y = ship[i][1];
            }
        }
    }

    createCurrentShipToPlace() {
        for (let i = 0; i < this.currentShip.size; i++) {
            let field = document.createElement('div').addClass(['field', Boards.fieldClasses.ship]);
            Boards.shipHolder.append(field);
        }
    }

    updateCurrentShipToPlace() {
        [...Boards.shipHolder.children].map(child => child.remove());
        this.createCurrentShipToPlace();
    }

    assertShips() {
        let ships = {};
        let n = 5;
        for (let i = 1; i <= n; i++) {
            ships[i] = [];
            for (let j = 0; j < (n - i + 1); j++) {
                ships[i][j] = [];
                for (let k = 0; k < i; k++) {
                    ships[i][j].push(null);
                }
            }
        }
        return ships;
    }

    assertAiShips() {
        this.class('ship-holder')[0].remove();
        this.class('board-player')[0].addClass('blocked');
        this.alert('Placing Ai ships.');
    }
}

module.exports = new Mechanism;
