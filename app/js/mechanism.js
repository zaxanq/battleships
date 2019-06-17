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
        this.createCurrentShipToPlace();
    }

    addListeners() {
        [...this.DOM('.board-player .field')].map(field => {
            field.addEventListener('click', () => {
                if (this.gameStatus === 1) {
                    this.placeShip(field.classList[1]);
                }
            });
        });
        console.info('INFO: Listeners added.');
    }

    placeShip(xy) {

        Boards.player.field[xy] = Boards.fieldState.ship;
        this.class(xy)[0].addClass(Boards.fieldClasses.ship);

        for (let size = 0; size < 5 - this.currentShip + 1; size++) {
            for (let position = 0; position < 5 - size + 1; position++) {
                console.log(this.currentShip, size, position);
                if (this.playerShips[this.currentShip][size][position] === null) {
                    this.playerShips[this.currentShip][size][position] = xy;

                    if (size === 5 - this.currentShip && position === this.currentShip - 1) {
                        this.currentShip--;
                        if (this.currentShip === 0) {
                            this.assertAiShips();
                        } else {
                            this.updateCurrentShipToPlace();
                        }
                    }

                    return;
                }
            }
            console.log(this.playerShips[this.currentShip]);
        }
    }

    validateField(xy, ship) {
        if (ship[0] !== null) {
            if (!this.Neighbours.includes(xy)) {
                return false;
            }
            this.Neighbours = this.findNeighboursInLine(xy, ship);
        } else {
            this.Neighbours = this.findNeighboursAround(xy);
        }

        //validate with illicit fields

        return true;
    }

    findNeighboursInLine(xy, ship) {
        console.log('findNeighboursInLine');
        let lastXY;

        for (let i = ship.length - 1; i >= 0; i--) {
            if (ship[i] !== null) {
                lastXY = ship[i];
                break;
            }
        }
        console.log(lastXY, xy);
        if (lastXY[0] === xy[0]) {
            if (this.shipDirection === 'horizontal') {
                this.alert('Cannot change ship direction');
                return {result: false, reason: 'invalid-ship-placement'}
            }
            this.shipDirection = 'vertical';
        } else {
            if (this.shipDirection === 'vertical') {
                this.alert('Cannot change ship direction');
                return {result: false, reason: 'invalid-ship-placement'}
            }
            this.shipDirection = 'horizontal';
        }

        console.log(this.shipDirection);
        let array = [];

        ship.map(point => {
            // map findNeighboursAround for each point other than null
        });
        return this.findNeighboursAround(xy);
    }

    findNeighboursAround(xy) {
        let array = [];
        let x = xy.slice(0, 1);
        let y = xy.slice(1);

        if (y !== '1') {
            array.push(Boards.letters[Boards.letters.indexOf(x)] + (parseInt(y) - 1));
        }
        if (y !== '10') {
            array.push(Boards.letters[Boards.letters.indexOf(x)] + (parseInt(y) + 1));
        }
        if (x !== 'A') {
            array.push(Boards.letters[Boards.letters.indexOf(x) - 1] + y);
        }
        if (x !== 'J') {
            array.push(Boards.letters[Boards.letters.indexOf(x) + 1] + y);
        }
        return array;
    }

    createCurrentShipToPlace() {
        for (let i = 0; i < this.currentShip; i++) {
            let field = document.createElement('div').addClass(['field', Boards.fieldClasses['ship']]);
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
