const Base = require('./base');

class Mechanism extends Base {
    constructor() {
        super();
    }

    init() {
        this.initAlerts();
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

    gameStart() {
        this.alert('Game starts.\nYour board is on the left.\nPlease place your ships.')
    }
}

module.exports = new Mechanism;
