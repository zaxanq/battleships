const Base = require('./base');
const Boards = require('./boards');
const Mechanism = require('./mechanism');

class Game extends Base {
    constructor() {
        super();
    }

    init() {
        Boards.create();
        Mechanism.start();
    }


}

(new Game).init();
