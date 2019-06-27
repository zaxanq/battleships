const Base = require('./base');
const Boards = require('./boards');

class AI extends Base {
    constructor() {
        super();
    }

    init(ships) {
        this.ships = ships;
        console.log(this.ships);
    }
}

module.exports = new AI;
