const Base = require('./base');

class Mechanism extends Base {
    constructor() {
        super();
    }

    init() {
        this.initAlerts();
    }

    info(msg) {
        this.infoContainer.innerText = msg;
    }

    initAlerts() {
        this.infoContainer = this.class('info-container')[0];
        console.info('Alerts loaded.');
        this.info('Test alert.');
    }

    start() {
        this.init();
    }
}

module.exports = new Mechanism;
