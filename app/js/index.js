const Board = require('./board');

class Game extends Board {
    constructor() {
        super();
    }

    init() {
        this.createBoards();
    }
}

(new Game).init();
