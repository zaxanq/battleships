const Base = require('./base');
const Boards = require('./boards');

const log = console.log;
const info = console.info;

class Mechanism extends Base {
    constructor() {
        super();
            /* 0 = not started   1 = ship placement   2 = game started   3 = game finished */
        this.gameStatus = 0;
    }

    start() {
        /* Initialization of the Mechanism class. */

        this.initAlerts();
        this.initShips();
        this.addListeners('player');
        this.gameStart();
    }

    initAlerts() {
        /* Loads alert container and 'alert' method. */

        this.alertMessage = this.id('alert-message');
        this.alertOverlay = this.class('alert-overlay')[0];
        this.id('alert-ok').addEventListener('click', event => {
            event.stopPropagation();
            this.alertOverlay.removeClass('visible');
        });
        info('INFO: Alerts loaded.');
    }

    alert(msg) {
        /* Renders alert. Paremeter is a message string that will be displayed. */

        this.alertMessage.innerText = msg;
        this.alertOverlay.addClass('visible');
    }

    initShips() {
        /* Ships initialization. */

            /* Setting game status to "Ship placement" status. */
        this.gameStatus = 1;
        this.defineShips();
        this.playerShips = this.assertShips();
        this.aiShips = this.assertShips();
            /* Setting current ship to place. */
        this.currentShip = {size: 4, number: 0};
        this.createCurrentShipToPlace();
    }

    defineShips() {
        /* Creation of this.ships. In the end this.ships contains 4 elements:
            {x: y} where x is a x-sized ship, and y is a quantity.
            ({4: 1} mean there is 1 4-sized ship. */

        this.ships = {};
        for (let i = 0; i < 4; i++) {
            this.ships[4 - i] = i + 1;
        }
    }

    addListeners(board) {
        /* Adding click listeners for each field in specified board.
            For "Ship placement" status a placeShip method is executed. */

        [...this.DOM(`.board-${board} > .row > .field`)].map(field => {
            field.addEventListener('click', () => {
                if (this.gameStatus === 1) {
                    this.placeShip(field);
                }
            });
        });
        info('INFO: Listeners added.');
    }

    gameStart() {
        /* Starts the main logic after player and ai ships are placed. */

        // this.alert('Game starts.\nYour board is on the left.\nPlease place your ships.')
    }

    placeShip(field) {
        /* This method verifies if the given field (a html DOM object) is empty.
            Method checks if playerShips object contains a ship in given field
            and uses validateField to determine whether the field is available. */

            /* Taking out coordinates out of field object (i.e. 'G4') */
        let coords = field.classList[1];
        for (let size = 0; size < 4 - this.currentShip.size + 1; size++) {
            for (let position = 0; position < 4 - size + 1; position++) {
                if (this.playerShips[this.currentShip.size][size][position] === null) {
                    let validation = this.validateField(field);

                    if (validation.result) {
                        this.changeField(field, Boards.fieldClasses.ship);
                        this.playerShips[this.currentShip.size][size][position] = coords;
                        Boards.player.field[coords] = Boards.fieldState.ship;

                        this.renderIllicitFields(this.playerShips[this.currentShip.size][size]);
                    } else {
                        position--;
                        this.alert(validation.reason);
                    }

                    if (position === this.currentShip.size - 1) {
                        this.currentShip.number++;
                        if (this.currentShip.number === this.ships[this.currentShip.size]) {
                            this.currentShip.size--;
                            this.currentShip.number = 0;
                        }
                        if (this.currentShip.size === 0) {
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

    validateField(field) {
        /* Method checks whether given field is described as a ship or illicit.
        *   Return an object with result(boolean) and reason(string). */

        if (field.hasClass(Boards.fieldClasses.ship)) {
            return {result: false, reason: 'ship-already-placed'};
        }
        if (field.hasClass(Boards.fieldClasses.illicit) || field.hasClass(Boards.fieldClasses.illicit)) {
            return {result: false, reason: 'illicit-field'};
        }
        return {result: true};
    }

    changeField(field, state) {
        /* This method clears all field classes of a field and adds given state class. */

        field.removeClass(Boards.fieldClassesArray).addClass(state);
    }

    renderIllicitFieldsAroundShips() {
        /* Resets board with clearBoard method and then selects all placed ships
        *   and marks fields around the ship with status 'neighbour' */

        this.clearBoard(Boards.fieldState.empty);

        let areaAroundShips = [];
        for (let ship = 4; ship > 0; ship--) {
            for (let size = 0; size < 4 - ship + 1; size++) {
                if (this.playerShips[ship][size][0] !== null) {
                    for (let position = 0; position < ship; position++) {
                        this.joinArrays(areaAroundShips, this.findNeighboursAround(this.playerShips[ship][size][position]));
                        this.findNeighboursInCorners(this.playerShips[ship][size], areaAroundShips);
                    }
                }
            }
        }

        for (let i = 0; i < areaAroundShips.length; i++) {
            this.updateField(this.class(areaAroundShips[i])[0], Boards.fieldState.empty, Boards.fieldState.neighbour);
        }
    }

    clearBoard(fieldState) {
        /* Method gets a fieldState parameter. Then based on this parameter it sets a toRemove variable to either
           illicit or empty state. The method then selects all players board fields and removes toRemove state class
           and adds the other state.
           In short, the method changes state of all available fields to either illicit or empty. */

        let toRemove = fieldState === Boards.fieldState.empty ? Boards.fieldState.illicit : Boards.fieldState.empty;
        let fields = this.DOM(`.board-player > .row > .${Boards.fieldClasses[toRemove]}`);

        for (let i = 0; i < fields.length; i++) {
            this.updateField(fields[i], toRemove, fieldState);
        }
    }

    updateField(field, fieldClassToRemove, fieldClassToAdd) {
        /* This method updates 'field' by removing 'fieldClassToRemove' and adding 'fieldClassToAdd'
            but only if this field exists and it's state is either 'empty' or 'illicit'. */

        if (field && field.doesntHaveClass(Boards.fieldClassesArray.slice(2))) {
            field.removeClass(Boards.fieldClasses[fieldClassToRemove]).addClass(Boards.fieldClasses[fieldClassToAdd]);
        }
    }

    renderIllicitFields(ship) {
        /* Method renders illicit fields in the middle of ship placement. It checks whether there is only 1 ship field
            selected and then executes findNeighboursAround() method, otherwise findNeighboursInLine method is executed */

        this.clearBoard(Boards.fieldState.illicit);

        let i;
        for (i = ship.length - 1; i >= 0; i--) {
            if (ship[i] !== null) {
                break;
            }
        }

        if (i + 1 === 1) {
            this.renderValidFields(this.findNeighboursAround(ship[i]));
        } else {
            this.renderValidFields(this.findNeighboursInLine(ship));
        }
    }

    renderValidFields(array) {
        /* Method receives an array of fields that should be valid to place a ship and renders them with empty state. */

        array.map(field => {
            if (field) {
                if (typeof field !== 'string') { // if array actually consists of arrays of coords
                    field.map(element => {
                        this.updateField(this.class(element)[0], Boards.fieldState.illicit, Boards.fieldState.empty);
                    });
                } else { // if it's just one coord
                    this.updateField(this.class(field)[0], Boards.fieldState.illicit, Boards.fieldState.empty);
                }
            }
        });
    }

    checkCoord(coord, direction) {
        /* Method checks whether the field is not one of the edge fields. */

        if (direction === 'L' && coord !== Boards.letters[0]) {
            return true;
        } else if (direction === 'R' && coord !== Boards.letters[9]) {
            return true;
        } else if (direction === 'U' && coord !== 1) {
            return true;
        } else if (direction === 'D' && coord !== 10) {
            return true;
        }
    }

    findNeighboursAround(coords, direction = 'none') {
        /* This method gets a coords of a field and direction (optional). Coords represent a field.
            Then if there is no direction this function looks for neighbours in all 4 directions.
            If direction is given and it is i.e. vertical, method checks neighbours above and below given field. */

        let array = [];
        let x = coords.slice(0, 1);
        let y = parseInt(coords.slice(1));

        if (direction === 'none' || direction === 'vertical') {
            if (this.checkCoord(y, 'U')) {
                array.push(Boards.letters[Boards.letters.indexOf(x)] + (y - 1));
            }
            if (this.checkCoord(y, 'D')) {
                array.push(Boards.letters[Boards.letters.indexOf(x)] + (y + 1));
            }
        }
        if (direction === 'none' || direction === 'horizontal') {
            if (this.checkCoord(x, 'L')) {
                array.push(Boards.letters[Boards.letters.indexOf(x) - 1] + y);
            }
            if (this.checkCoord(x, 'R')) {
                array.push(Boards.letters[Boards.letters.indexOf(x) + 1] + y);
            }
        }
        return array;
    }

    findNeighboursInLine(ship) {
        /* Method gets a ship direction and then loops over placed ship fields to find neighbours
            before first ship field and after last field ship. */

        this.shipDirection = this.determineDirection(ship);
        let array = [];
        ship.map(point => {
            if (point) {
                array.push(this.findNeighboursAround(point, this.shipDirection));
            }
        });
        return array;
    }

    findNeighboursInCorners(ship, array) {
        /* Finds neighbours in corners of the ship. The corner to select is always at least Up-Left & Down-Right.
            Then the other 2 depend on the direction of the ship. */

        let [start, end] = this.findShipEnds(ship);
        array.push(this.move(start, 'UL'));
        array.push(this.move(end, 'DR'));

        if (this.shipDirection === 'horizontal') {
            array.push(this.move(start, 'DL'));
            array.push(this.move(end, 'UR'));
        } else {
            array.push(this.move(start, 'UR'));
            array.push(this.move(end, 'DL'));
        }

        return array;
    }

    findShipEnds(ship) {
        /* This method takes a ship (array), finds the beginning and and of the ship and returns them as a pair of coords. */

        if (this.shipDirection === 'horizontal') {
            let shipXs = ship.map(shipField => Boards.letters.indexOf(shipField[0]));
            return [Boards.letters[Math.min(...shipXs)] + ship[0].slice(1), Boards.letters[Math.max(...shipXs)] + ship[0].slice(1)];
        } else {
            let shipYs = ship.map(shipField => parseInt(shipField.slice(1)));
            return [ship[1][0] + Math.min(...shipYs), ship[1][0] + Math.max(...shipYs)];
        }
    }

    move(coords, direction) {
        /* Method simplifies moving to a neighbouring field. It allows to move in all 8 directions, by 1 field.
            If direction is for example Up-Left, method uses recursion. */

        if (coords) {
            let x = coords[0];
            let y = parseInt(coords.slice(1));

            if (direction === 'U' && this.checkCoord(y, direction)) {
                return x + (y - 1);
            } else if (direction === 'D' && this.checkCoord(y, direction)) {
                return x + (y + 1);
            } else if (direction === 'L' && this.checkCoord(x, direction)) {
                return Boards.letters[Boards.letters.indexOf(x) - 1] + y;
            } else if (direction === 'R' && this.checkCoord(x, direction)) {
                return Boards.letters[Boards.letters.indexOf(x) + 1] + y;
            } else if (direction === 'UL') {
                return this.move(this.move(coords, 'U'), 'L');
            } else if (direction === 'UR') {
                return this.move(this.move(coords, 'U'), 'R');
            } else if (direction === 'DL') {
                return this.move(this.move(coords, 'D'), 'L');
            } else if (direction === 'DR') {
                return this.move(this.move(coords, 'D'), 'R');
            }
        }
    }

    determineDirection(ship) {
        /* Method gets ship fields and checks if the difference between them is in X (A4, B4,...) or in Y (A4, A5,...) */

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

    createCurrentShipToPlace() {
        /* Displays a current ship to place in the panel above the player's board. */

        for (let i = 0; i < this.currentShip.size; i++) {
            let field = document.createElement('div').addClass(['field', Boards.fieldClasses.ship]);
            Boards.shipHolder.append(field);
        }
    }

    updateCurrentShipToPlace() {
        /* When all ships of n size are placed, the panel above player's board is updated to show a smaller ship. */

        [...Boards.shipHolder.children].map(child => child.remove());
        this.createCurrentShipToPlace();
    }

    assertShips() {
        /* Creates an object that holds a ships template. At the beginning it is full of nulls, but later when the ships
            are placed, the nulls are replaced with coords of a ship fields. */

        let ships = {};
        let n = 4;
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
        /* This method executes a removal of current ship panel of player's board, blocks player's board and displays
            information that ai ships placing is now happening.
            It is executed when player finished placing his/her ships. */

        this.class('ship-holder')[0].remove();
        this.class('board-player')[0].addClass('blocked');
        this.alert('Placing Ai ships.');
    }
}

module.exports = new Mechanism;
