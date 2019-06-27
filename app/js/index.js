const Base = require('./base');
const Boards = require('./boards');
const AI = require('./ai');
const Mechanism = require('./mechanism');

class Game extends Base {
    constructor() {
        super();
    }

    init() {
        console.info('INFO: Init.');
        Boards.create();
        Mechanism.start();
    }
}

(new Game).init();
