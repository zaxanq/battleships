const Base = require('./base');
const Boards = require('./boards');

class Mechanism extends Base {
    constructor() {
        super();
    }

    init() {
        this.initAlerts();
        this.initShips();
        this.gameStart();
    }

    alert(msg) {
        this.alertMessage.innerText = msg;
        this.alertOverlay.addClass('visible');
    }

    initAlerts() {
        this.alertMessage = this.id('alert-message');
        this.alertOverlay = this.class('alert-overlay')[0];
        this.id('alert-ok').addEventListener('click', (event) => {
            event.stopPropagation();
            this.alertOverlay.removeClass('visible');
        });
        console.info('INFO: Alerts loaded.');
    }

    start() {
        this.init();
    }

    initShips() {
        this.playerShips = this.assertShips();
        this.aiShips = this.assertShips();

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
                ships[i].push({x: null, y: null});
            }
        }
    }


gameStart()
{
    // this.alert('Game starts.\nYour board is on the left.\nPlease place your ships.')
}
}

module.exports = new Mechanism;
