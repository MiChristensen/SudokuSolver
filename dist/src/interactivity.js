"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBoardReadOnly = exports.delayedReplace = exports.validateInput = exports.handleArrowLeft = exports.handleArrowDown = exports.handleArrowRight = exports.handleArrowUp = exports.cellKeyDownEvent = exports.cellInputEvent = exports.processHTMLCells = void 0;
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
var logging_1 = require("./logging");
var main_1 = require("./main");
//Gives every cell an index, a maxlenght = 1 and adds eventlistener.
function processHTMLCells() {
    for (var cellCounter = 0; cellCounter < constants_1.cells.length; cellCounter++) {
        var cell = constants_1.cells[cellCounter];
        cell.maxLength = 1;
        cell.addEventListener("keydown", cellKeyDownEvent);
        cell.addEventListener("input", cellInputEvent);
        cell.index = cellCounter;
    }
}
exports.processHTMLCells = processHTMLCells;
function cellInputEvent(event) {
    var cell = event.target;
    var _a = helpers_1.convertCellNoToRowCol(cell.index), row = _a[0], col = _a[1];
    if (parseInt(cell.value) == main_1.BOARD[row][col].value)
        return;
    helpers_1.updateBoardWithHTMLInput();
    helpers_1.validateAndColorAllCells();
    cell.select();
}
exports.cellInputEvent = cellInputEvent;
/** Checks which key has been pressed and executes logik depending on the
 * key pressed
 * @param event KeyBoardEvent triggering this function
 */
function cellKeyDownEvent(event) {
    var cell = event.target;
    var cellNo = cell.index;
    var _a = helpers_1.convertCellNoToRowCol(cellNo), row = _a[0], col = _a[1];
    switch (event.key) {
        case 'ArrowUp': {
            handleArrowUp(row, col);
            break;
        }
        case 'ArrowRight': {
            handleArrowRight(row, col);
            break;
        }
        case 'ArrowDown': {
            handleArrowDown(row, col);
            break;
        }
        case 'ArrowLeft': {
            handleArrowLeft(row, col);
            break;
        }
        case 'Tab': {
            //This enables default behaviour of 'Tab'
            break;
        }
        case 'z': {
            //This enables default behaviour of 'Ctrl-z' aka. undo 
            //This case has to be the last case in order to move on to 
            //default if condition not met.  
            if (event.ctrlKey)
                break;
        }
        //Make buttons Backspace and Delete remove value inside cell
        case 'Backspace':
        case 'Delete': {
            cell.value = "";
            helpers_1.updateBoardWithHTMLInput();
            helpers_1.validateAndColorAllCells();
        }
        default: {
            cell.select();
            if (!validateInput(event.key)) {
                //Prevent the input from updating the cell value
                event.preventDefault();
            }
            // if(!isValidBox(row,col,cell.value)))
            var previousValue = constants_1.cells[cellNo].value;
            //Combined values such as pressing '~' + 'm' will prevent the '~' but update 
            //the value to 'm'. Using callback function to replace any new invalid input 
            //with the previous value.  
            setTimeout(delayedReplace, 0, cell.index, previousValue);
            helpers_1.updateBoardWithHTMLInput();
        }
    }
}
exports.cellKeyDownEvent = cellKeyDownEvent;
/** Handles the event of the user pressing the ArrowUp key.
 * Selects the cell one row above or the cell in the bottom row
 * at this col if currently at top row
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
function handleArrowUp(row, col) {
    var isTopRow = row == 0;
    if (!isTopRow) {
        //Select cell above
        constants_1.cells[helpers_1.convertRowColToCellNo(row - 1, col)].select();
    }
    else {
        //Select cell in bottom row at this col
        constants_1.cells[helpers_1.convertRowColToCellNo(constants_1.BOARD_SIZE - 1, col)].select();
    }
}
exports.handleArrowUp = handleArrowUp;
/** Handles the event of the user pressing the ArrowRight key.
 * Selects the cell to the right or the cell at this row and
 * column 0 if currently at right-most column
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
function handleArrowRight(row, col) {
    var isRightMostColumn = col == constants_1.BOARD_SIZE - 1;
    if (!isRightMostColumn) {
        //Select cell to the right
        constants_1.cells[helpers_1.convertRowColToCellNo(row, col + 1)].select();
    }
    else {
        //Select cell at this row and col 0
        constants_1.cells[helpers_1.convertRowColToCellNo(row, 0)].select();
    }
}
exports.handleArrowRight = handleArrowRight;
/** Handles the event of the user pressing the ArrowDown key.
 * Selects the cell one row below or the cell in the top row
 * at this col if currently at bottom row
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
function handleArrowDown(row, col) {
    var isBottomRow = row == constants_1.BOARD_SIZE - 1;
    if (!isBottomRow) {
        //Select cell below
        constants_1.cells[helpers_1.convertRowColToCellNo(row + 1, col)].select();
    }
    else {
        //Select top row cell in this column
        constants_1.cells[helpers_1.convertRowColToCellNo(0, col)].select();
    }
}
exports.handleArrowDown = handleArrowDown;
/** Handles the event of the user pressing the ArrowLeft key.
 * Selects the cell to the left or the cell at this row and
 * column 0 if currently at left-most column
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
function handleArrowLeft(row, col) {
    var isLeftMostColumn = col == 0;
    if (!isLeftMostColumn) {
        //Select cell to the left
        constants_1.cells[helpers_1.convertRowColToCellNo(row, col - 1)].select();
    }
    else {
        //Select cell at this row and last col
        constants_1.cells[helpers_1.convertRowColToCellNo(row, constants_1.BOARD_SIZE - 1)].select();
    }
}
exports.handleArrowLeft = handleArrowLeft;
/**
 * Checks if the inputString is a valid value [1 - 9]
 * @param {*} inputString
 * @returns
 */
function validateInput(inputString) {
    var inputAsNumber = Number.parseInt(inputString);
    var isValidNumber = !!inputAsNumber && inputAsNumber != 0 && inputAsNumber <= 9;
    logging_1.logStatus("validate input: " + inputString + " => " + isValidNumber);
    return isValidNumber;
}
exports.validateInput = validateInput;
/** This function checks the value of a cell with a given cellIndex. If
 * the value is not valid according to the validateInput function, the value
 * is replaced with the previousValue parameter.
 *
 * @param {*} cellIndex The index of the cell in question
 * @param {*} previousValue The previous value of the cell
 */
function delayedReplace(cellIndex, previousValue) {
    var cell = constants_1.cells[cellIndex];
    var newValue = cell.value;
    if (!validateInput(newValue)) {
        cell.value = previousValue;
        logging_1.logStatus("delayedReplace: replacing " + newValue + " with previous value: " + previousValue);
    }
}
exports.delayedReplace = delayedReplace;
function makeBoardReadOnly() {
    main_1.BOARD.forEach(function (row) {
        row.forEach(function (cell) {
            var htmlCell = helpers_1.getHTMLCellFromCell(cell);
            htmlCell.disabled = true;
        });
    });
}
exports.makeBoardReadOnly = makeBoardReadOnly;
//# sourceMappingURL=interactivity.js.map