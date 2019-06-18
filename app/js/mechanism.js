const Base = require('./base');
const Boards = require('./boards');

class Mechanism extends Base {
    constructor() {
        super();
        this.gameStatus = 0; //0 - not started, 1 - ship placement, 2 - game starts, 3 - game finished
    }

    start() {
        this.init();
        this.addListeners();
        this.gameStart();
    }

    init() {
        this.initAlerts();
        this.initShips();
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
        this.playerShips = this.assertShips();
        this.aiShips = this.assertShips();

        this.currentShip = 5;
        this.placedShips = [];
        this.createCurrentShipToPlace();
    }

    addListeners() {
        [...this.DOM('.board-player > .row > .field')].map(field => {
            field.addEventListener('click', () => {
                if (this.gameStatus === 1) {
                    this.placeShip(field.classList[1]);
                }
            });
        });
        console.info('INFO: Listeners added.');
    }

    placeShip(xy) {
        for (let size = 0; size < 5 - this.currentShip + 1; size++) {
            for (let position = 0; position < 5 - size + 1; position++) {
                if (this.playerShips[this.currentShip][size][position] === null) {
                    let validation = this.validateField(xy);
                    if (validation.result) {
                        this.changeField('player', xy, Boards.fieldClasses.ship);
                        this.playerShips[this.currentShip][size][position] = xy;
                        Boards.player.field[xy] = Boards.fieldState.ship;

                        this.renderIllicitFields(this.playerShips[this.currentShip][size]);
                    } else {
                        position--;
                        this.alert(validation.reason);
                    }

                    if (size === 5 - this.currentShip && position === this.currentShip - 1) {
                        this.placedShips.push(this.currentShip);
                        this.currentShip--;
                        if (this.currentShip === 0) {
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

    validateField(coords) {
        if (this.class(coords)[0].classList.contains(Boards.fieldClasses.ship)) {
            return {result: false, reason: 'ship-already-placed'};
        }
        if (this.class(coords)[0].classList.contains(Boards.fieldClasses.illicit)) {
            return {result: false, reason: 'illicit-field'};
        }
        return {result: true};
    }

    changeField(board, coords, state) {
        this.DOM(`.board-${board} .${coords}`)[0].removeClass(Boards.fieldClassesArray).addClass(state);
    }

    renderIllicitFieldsAroundShips() {
        let ships = this.DOM(`.board-player > .row > .${Boards.fieldClasses.ship}`);
        console.log(ships);
    }

    renderIllicitFields(ship) {
        let fields = this.DOM(`.board-player > .row > .${Boards.fieldClasses.empty}`);
        for (let i = 0; i < fields.length; i++) {
            this.updateFields(fields[i], 'ship', 'empty', 'illicit');
            if (!fields[i].hasClass(Boards.fieldClasses.ship))
                fields[i].removeClass(Boards.fieldClasses.empty).addClass(Boards.fieldClasses.illicit);
        }

        let noCoords = true;
        let i;
        for (i = ship.length - 1; i >= 0; i--) {
            if (ship[i] !== null) {
                noCoords = false;
                break;
            }
        }

        if (noCoords) {
            // new ship to be placed
            console.log('new ship to be placed');
            return;
        } else {
            if (i + 1 === 1) {
                this.renderValidFields(this.findNeighboursAround(ship[i]));
            } else {
                this.renderValidFields(this.findNeighboursInLine(ship));
            }
        }


        return false;
    }

    updateFields(fields, classToHave, classToRemove, classToAdd) {
        if (!fields.hasClass(Boards.fieldClasses[classToHave])) {
            fields.removeClass(Boards.fieldClasses[classToRemove]).addClass(Boards.fieldClasses[classToAdd]);
        }
    }

    renderValidFields(array) {
        array.map(field => {
            if (field) {
                if (typeof field !== 'string') { // if array actually consists of arrays of coords
                    field.map(element => {
                        this.updateFields(this.class(element)[0], 'ship', 'illicit', 'empty');
                    });
                } else { // if it's just one coord
                    this.updateFields(this.class(field)[0], 'ship', 'illicit', 'empty');
                }
            }
        });
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

    findNeighboursAround(xy, direction) {
        let array = [];
        let x = xy.slice(0, 1);
        let y = xy.slice(1);

        if (typeof direction === 'undefined' || direction === 'vertical') {
            if (y !== '1') {
                array.push(Boards.letters[Boards.letters.indexOf(x)] + (parseInt(y) - 1));
            }
            if (y !== '10') {
                array.push(Boards.letters[Boards.letters.indexOf(x)] + (parseInt(y) + 1));
            }
        }
        if (typeof direction === 'undefined' || direction === 'horizontal') {
            if (x !== 'A') {
                array.push(Boards.letters[Boards.letters.indexOf(x) - 1] + y);
            }
            if (x !== 'J') {
                array.push(Boards.letters[Boards.letters.indexOf(x) + 1] + y);
            }
        }
        return array;
    }

    createCurrentShipToPlace() {
        for (let i = 0; i < this.currentShip; i++) {
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


    gameStart() {
        // this.alert('Game starts.\nYour board is on the left.\nPlease place your ships.')
    }
}

module.exports = new Mechanism;
