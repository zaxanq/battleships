const Base = require('./base');
const Boards = require('./boards');

class Mechanism extends Base {
    constructor() {
        super();
        this.gameStatus = 0; //0 - not started, 1 - ship placement, 2 - game starts, 3 - game finished
    }

    init() {
        this.initAlerts();
        this.initShips();
    }

    alert(msg) {
        this.alertMessage.innerText = msg;
        this.alertOverlay.addClass('visible');
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

    start() {
        this.init();
        this.addListeners();
        this.gameStart();
    }

    addListeners() {
        [...this.DOM('.board-player .field')].map(field => {
            field.addEventListener('click', event => {
                let xy = field.classList[1];

                if (this.gameStatus === 1) { // if ship placement stage
                    for (let size = 5; size > 0; size--) {
                        for (let ship = 0; ship < 5 - (size - ship - 1); ship++) {
                            for (let position = 0; position < size - ship; position++) {
                                if (this.playerShips[size][ship][position] === null) {
                                    if (this.validateField(xy, this.playerShips[size][ship])) {
                                        this.playerShips[size][ship][position] = xy;

                                        field.removeClass(Boards.fieldClasses['empty']).addClass(Boards.fieldClasses['ship']);
                                        Boards.Boards.player.field[xy] = 'ship';
                                        return;
                                    } else {
                                        this.alert('Invalid field.');
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
        console.info('INFO: Listeners added.');
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
            this.shipDirection = 'vertical';
        } else {
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
        let x = xy.slice(0,1);
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

    initShips() {
        this.gameStatus = 1; // ship placement started
        this.playerShips = this.assertShips();
        this.aiShips = this.assertShips();

        this.currentShip = 5;
        this.showCurrentShipToPlace();
    }

    showCurrentShipToPlace() {
        for (let i = 0; i < 5; i++) {
            let field = document.createElement('div').addClass(['field', Boards.fieldClasses['ship']]);
            Boards.shipHolder.append(field);
        }
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


    gameStart() {
        // this.alert('Game starts.\nYour board is on the left.\nPlease place your ships.')
    }
}

module.exports = new Mechanism;
