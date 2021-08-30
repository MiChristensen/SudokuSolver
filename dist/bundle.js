(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITE_COLOR = exports.YELLOW_COLOR = exports.GREY_COLOR_FOCUS = exports.GREY_COLOR_FIXED = exports.RED_COLOR = exports.GREEN_COLOR = void 0;
exports.GREEN_COLOR = "#8cf91f";
exports.RED_COLOR = "#e63946";
exports.GREY_COLOR_FIXED = "#828282";
exports.GREY_COLOR_FOCUS = "bdbdbd";
exports.YELLOW_COLOR = "#ffff33";
exports.WHITE_COLOR = "white";

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cells = exports.rows = exports.BOARD_SIZE = exports.SUGOKU_URL = void 0;
exports.SUGOKU_URL = "https://sugoku.herokuapp.com/board";
exports.BOARD_SIZE = 9;
exports.rows = document.getElementsByClassName("row");
exports.cells = document.getElementsByClassName("cell");

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVerticalBorders = exports.setCellBackgroundColor = exports.setHTMLBackgroundsUsingBoard = void 0;
var colors_1 = require("./colors");
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
var main_1 = require("./main");
/** Uses the board variable to change the background colors
 */
function setHTMLBackgroundsUsingBoard() {
    for (var row = 0; row < constants_1.BOARD_SIZE; row++) {
        for (var col = 0; col < constants_1.BOARD_SIZE; col++) {
            //Render board in page by coloring every fixed cell grey, every 0/empty red
            var currentCell = main_1.BOARD[row][col];
            var htmlCell = helpers_1.getHTMLCellFromCell(currentCell);
            if (currentCell.fixed)
                htmlCell.style.backgroundColor = colors_1.GREY_COLOR_FIXED;
            if (!currentCell.value) {
                htmlCell.style.backgroundColor = colors_1.WHITE_COLOR;
                htmlCell.value = "";
            }
        }
    }
}
exports.setHTMLBackgroundsUsingBoard = setHTMLBackgroundsUsingBoard;
/** Sets the background color of cell at (row, col)
 * @param row Row of the cell to change background color for.
 * @param col Column of the cell to change background color for.
 * @param color The color (string) to change background color to.
 */
function setCellBackgroundColor(row, col, color) {
    var cell = constants_1.cells[helpers_1.convertRowColToCellNo(row, col)];
    cell.style.backgroundColor = color;
}
exports.setCellBackgroundColor = setCellBackgroundColor;
/** Thickens the two vertical borders on the board between column
 * 2 and 3 as well as 5 and 6
 */
function setVerticalBorders() {
    var thickBorderSize = "4px";
    for (var i = 0; i < constants_1.cells.length; i++) {
        var cell = constants_1.cells[i];
        //Set the two vertical borders  
        var isEndOfBoxCol = (i + 1) % 3 == 0;
        var isRightMostCol = (i + 1) % 9 == 0;
        if (isEndOfBoxCol && !isRightMostCol)
            cell.style.borderRightWidth = thickBorderSize;
    }
}
exports.setVerticalBorders = setVerticalBorders;

},{"./colors":1,"./constants":2,"./helpers":4,"./main":7}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBoardValue = exports.setHTMLValue = exports.isValidBox = exports.isValidCol = exports.isValidRow = exports.cloneBoard = exports.validateAndColorAllCells = exports.initBoard = exports.updateHTMLWithBoard = exports.updateBoardWithHTMLInput = exports.getHTMLValue = exports.convertRowColToCellNo = exports.GetNextRowAndCol = exports.convertCellNoToRowCol = exports.getHTMLCellFromRowCol = exports.getHTMLCellFromCell = void 0;
var just_clone_1 = __importDefault(require("just-clone"));
var colors_1 = require("./colors");
var constants_1 = require("./constants");
var dynamic_styles_1 = require("./dynamic_styles");
var logging_1 = require("./logging");
var main_1 = require("./main");
/**
 * Returns the HTMLCell corresponding to the parameter cell
 * @param cell the cell to which we want to find the corresponding HTMLCell
 * @returns the corresponding HTMLCell
 */
function getHTMLCellFromCell(cell) {
    return constants_1.cells[convertRowColToCellNo(cell.row, cell.col)];
}
exports.getHTMLCellFromCell = getHTMLCellFromCell;
function getHTMLCellFromRowCol(row, col) {
    var cellNo = convertRowColToCellNo(row, col);
    return constants_1.cells[cellNo];
}
exports.getHTMLCellFromRowCol = getHTMLCellFromRowCol;
/** Converts a cell number (index) to a (row, col) coordinate
 * @param cellNo cell number (index) to convert
 * @returns the (row, col) coordinate
 */
function convertCellNoToRowCol(cellNo) {
    var row = Math.floor(cellNo / constants_1.BOARD_SIZE);
    var col = cellNo % constants_1.BOARD_SIZE;
    return [row, col];
}
exports.convertCellNoToRowCol = convertCellNoToRowCol;
/** Gets the next (row, col) coordinate which means either the
 * cell to the right or the leftmost cell in the row beneath if
 * currently at a rightmost cell
 * @param row The current row
 * @param col The current column
 * @returns The (row, col) coordinate
 */
function GetNextRowAndCol(row, col) {
    var newRow = row;
    var newCol = col;
    if (col < constants_1.BOARD_SIZE - 1) {
        newCol += 1;
    }
    else if (col == constants_1.BOARD_SIZE - 1) {
        newRow += 1;
        newCol = 0;
    }
    return [newRow, newCol];
}
exports.GetNextRowAndCol = GetNextRowAndCol;
/** Converts a (row, col) coordinate to an index as used in the "cells" array
 * @param row the row of the cell
 * @param col the column of the cell
 * @returns the index (cell number) of the
 */
function convertRowColToCellNo(row, col) {
    return row * constants_1.BOARD_SIZE + col;
}
exports.convertRowColToCellNo = convertRowColToCellNo;
//Returns the value inside the HTMLCell with given row and col as a number
function getHTMLValue(row, col) {
    var cellNo = convertRowColToCellNo(row, col);
    var value = parseInt(constants_1.cells[cellNo].value);
    return value;
}
exports.getHTMLValue = getHTMLValue;
/** Uses values in cells variable to create cells in board variable
 * @returns the board variable
 */
function updateBoardWithHTMLInput() {
    for (var currentRow = 0; currentRow < constants_1.BOARD_SIZE; currentRow++) {
        for (var currentCol = 0; currentCol < constants_1.BOARD_SIZE; currentCol++) {
            var cell = constants_1.cells[convertRowColToCellNo(currentRow, currentCol)];
            var currentValueNumber = Number.parseInt(cell.value);
            var updatedCell = {
                row: currentRow,
                col: currentCol,
                value: currentValueNumber,
                fixed: cell.value ? true : false
            };
            main_1.BOARD[currentRow][currentCol] = updatedCell;
        }
    }
    logging_1.printBoard(main_1.BOARD);
}
exports.updateBoardWithHTMLInput = updateBoardWithHTMLInput;
/** Updates the HTML board with the values in the argument board.
 * @param board The Board to show in the html board
 */
function updateHTMLWithBoard(board) {
    for (var currentRow = 0; currentRow < constants_1.BOARD_SIZE; currentRow++) {
        for (var currentCol = 0; currentCol < constants_1.BOARD_SIZE; currentCol++) {
            var cell = board[currentRow][currentCol];
            var currentValue = cell.value;
            constants_1.cells[convertRowColToCellNo(currentRow, currentCol)].value = currentValue.toString();
        }
    }
}
exports.updateHTMLWithBoard = updateHTMLWithBoard;
/** Returns a board with 0 in all cells.
 * @returns Board with 0 in all cells
 */
function initBoard() {
    var board = [];
    var cellsIndex = 0;
    for (var currentRow = 0; currentRow < constants_1.BOARD_SIZE; currentRow++) {
        board.push([]);
        for (var currentCol = 0; currentCol < constants_1.BOARD_SIZE; currentCol++) {
            var newCell = {
                row: currentRow,
                col: currentCol,
                value: 0,
                fixed: false
            };
            cellsIndex++;
            board[currentRow].push(newCell);
        }
    }
    return board;
}
exports.initBoard = initBoard;
/** Iterates through all HTMLCells in "cells" array.
 * For every cell, validate the value in this cell and color
 * the cell red if invalid or white (aka. "") if valid
 */
function validateAndColorAllCells() {
    var solveButton = document.getElementById("solveButton");
    var existsInvalidCell = false;
    Array.from(constants_1.cells).forEach(function (currentCell) {
        var cellValueNumber = parseInt(currentCell.value);
        var _a = convertCellNoToRowCol(currentCell.index), currentRow = _a[0], currentCol = _a[1];
        var isInvalidNumber = !!cellValueNumber &&
            (!isValidBox(currentRow, currentCol, cellValueNumber) ||
                !isValidCol(currentRow, currentCol, cellValueNumber) ||
                !isValidRow(currentRow, currentCol, cellValueNumber));
        if (isInvalidNumber) {
            dynamic_styles_1.setCellBackgroundColor(currentRow, currentCol, colors_1.RED_COLOR);
            existsInvalidCell = true;
        }
        else
            dynamic_styles_1.setCellBackgroundColor(currentRow, currentCol, "");
    });
    solveButton.disabled = existsInvalidCell ? true : false;
}
exports.validateAndColorAllCells = validateAndColorAllCells;
function cloneBoard(board) {
    return just_clone_1.default(board);
}
exports.cloneBoard = cloneBoard;
function isValidRow(row, col, value) {
    logging_1.logFunctionStart("Row validation");
    logging_1.logStatus("(row, col, value) = (" + row + ", " + col + ", " + value + ")");
    for (var currentCol = 0; currentCol < constants_1.BOARD_SIZE; currentCol++) {
        if (currentCol == col)
            continue;
        if (main_1.BOARD[row][currentCol].value == value) {
            logging_1.logStatus("Row Validation: false");
            logging_1.logFunctionEnd("Row Validation");
            return false;
        }
    }
    logging_1.logStatus("Row Validation: true");
    logging_1.logFunctionEnd("Row Validation");
    return true;
}
exports.isValidRow = isValidRow;
function isValidCol(row, col, value) {
    logging_1.logFunctionStart("Column Validation");
    logging_1.logStatus("(row, col, value): (" + row + ", " + col + ", " + value + ")");
    for (var currentRow = 0; currentRow < constants_1.BOARD_SIZE; currentRow++) {
        if (currentRow == row)
            continue;
        if (main_1.BOARD[currentRow][col].value == value) {
            logging_1.logStatus("Column validation: false");
            logging_1.logFunctionEnd("Column Validation");
            return false;
        }
    }
    logging_1.logStatus("Column validation: true");
    logging_1.logFunctionEnd("Column Validation");
    return true;
}
exports.isValidCol = isValidCol;
function isValidBox(row, col, value) {
    logging_1.logFunctionStart(" Box validation");
    logging_1.logStatus("(row, col, value) = (" + row + ", " + col + ", " + value + ")");
    var currentRow = row - row % 3;
    var nextHorizontalEdge = currentRow + 2;
    var currentCol = col - col % 3;
    var nextVerticalEdge = currentCol + 2;
    while (currentRow <= nextHorizontalEdge && currentCol <= nextVerticalEdge) {
        var boardValue = main_1.BOARD[currentRow][currentCol].value;
        logging_1.logStatus("(row, NHE, col, NVE, boardValud, valueToValidate): (" + currentRow + ", " + nextHorizontalEdge + ", " + currentCol + ", " + nextVerticalEdge + ", " + boardValue + ", " + value + ")");
        var ignore = currentRow == row && currentCol == col;
        if (boardValue == value && !ignore) {
            logging_1.logStatus("Box validated: false");
            logging_1.logFunctionEnd("Box validation");
            return false;
        }
        if (currentCol == nextVerticalEdge) 
        //Go to next row at left edge of current box
        {
            currentCol -= 2;
            currentRow += 1;
        }
        else {
            currentCol += 1;
        }
    }
    logging_1.logStatus("Box validated: true");
    logging_1.logFunctionEnd("Box validation");
    return true;
}
exports.isValidBox = isValidBox;
function setHTMLValue(row, col, value) {
    var cell = getHTMLCellFromRowCol(row, col);
    cell.value = value == 0 ? "" : value.toString();
    logging_1.logStatus("setHTMLValue: (row, col, value): (" + row + ", " + col + ", " + value + ")");
}
exports.setHTMLValue = setHTMLValue;
function setBoardValue(row, col, value) {
    if (main_1.BOARD[row][col].fixed) {
        throw new Error("Tried to setCellValue of fixed cell with params row: " + row + ", col: " + col + ", value: " + value);
    }
    var newBoardValue = value == 0 ? NaN : value;
    logging_1.logStatus("setBoardValue: (row,col,value): (" + row + ", " + col + ", " + value + ")");
    main_1.BOARD[row][col].value = newBoardValue;
}
exports.setBoardValue = setBoardValue;

},{"./colors":1,"./constants":2,"./dynamic_styles":3,"./logging":6,"./main":7,"just-clone":10}],5:[function(require,module,exports){
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

},{"./constants":2,"./helpers":4,"./logging":6,"./main":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBoard = exports.logFunctionEnd = exports.logFunctionStart = exports.logStatus = exports.PRINT_INFO = void 0;
var constants_1 = require("./constants");
exports.PRINT_INFO = false;
function logStatus(msg) {
    if (exports.PRINT_INFO)
        console.log(msg);
}
exports.logStatus = logStatus;
function logFunctionStart(functionName) {
    if (exports.PRINT_INFO) {
        console.log("\n");
        console.log("==========================  " + functionName + "  ==========================");
    }
}
exports.logFunctionStart = logFunctionStart;
function logFunctionEnd(functionName) {
    if (exports.PRINT_INFO) {
        console.log("==========================  End of " + functionName + "  ==========================");
        console.log("\n");
    }
}
exports.logFunctionEnd = logFunctionEnd;
function printBoard(board) {
    logFunctionStart("Printing board");
    for (var row = 0; row < constants_1.BOARD_SIZE; row++) {
        var rowString = "";
        for (var col = 0; col < constants_1.BOARD_SIZE; col++) {
            var currentCell = board[row][col];
            var currentValue = !currentCell.value ? "%" : currentCell.value;
            rowString += "" + currentValue + (currentCell.fixed ? "f" : " ") + " | ";
        }
        logStatus(rowString);
    }
    logFunctionEnd("Printing board");
}
exports.printBoard = printBoard;

},{"./constants":2}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillHTMLWithPreset = exports.BOARD = void 0;
//#region imports
var helpers_1 = require("./helpers");
var constants_1 = require("./constants");
var colors_1 = require("./colors");
var logging_1 = require("./logging");
var dynamic_styles_1 = require("./dynamic_styles");
var interactivity_1 = require("./interactivity");
var speed_1 = require("./speed");
var just_clone_1 = __importDefault(require("just-clone"));
var test_1 = require("../test/test");
var solving = false;
var noOfSolutions = 0;
var solutions = [];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var preset;
        return __generator(this, function (_a) {
            preset = [
                [0, 7, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 4, 5, 9, 6, 0, 8],
                [0, 0, 9, 0, 7, 8, 0, 0, 0],
                [2, 0, 4, 0, 3, 0, 7, 0, 0],
                [0, 0, 6, 8, 9, 0, 2, 1, 0],
                [7, 9, 8, 0, 1, 0, 0, 0, 0],
                [5, 3, 0, 0, 8, 1, 9, 4, 0],
                [0, 4, 7, 9, 2, 5, 0, 0, 1],
                [0, 0, 1, 0, 0, 0, 0, 0, 0]
            ];
            interactivity_1.processHTMLCells();
            exports.BOARD = helpers_1.initBoard();
            test_1.runTests();
            speed_1.updateSpeedHTMLValue(speed_1.currentSpeed);
            dynamic_styles_1.setVerticalBorders();
            // setHTMLBackgroundsUsingBoard();
            fillHTMLWithPreset(preset);
            helpers_1.updateBoardWithHTMLInput();
            return [2 /*return*/];
        });
    });
}
function fetchSugokuBoardAsync(difficulty) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, window.fetch(constants_1.SUGOKU_URL + "?difficulty=" + difficulty)
                    .then(function (response) { return response.json(); })
                    .then(function (jsonObject) {
                    var fetchedBoard = jsonObject.board;
                    return fetchedBoard;
                })];
        });
    });
}
/**
 * Uses the values in preset variable to fill innerHTML values in cells variable
 * @param preset the number[][] preset
 */
function fillHTMLWithPreset(preset) {
    for (var i = 0; i < constants_1.cells.length; i++) {
        var cell = constants_1.cells[i];
        var row = Math.floor(i / 9);
        var col = i % 9;
        //Replace "0"'s in preset with "" while filling html board
        cell.value = preset[row][col] == 0 ? "" : preset[row][col].toString();
    }
}
exports.fillHTMLWithPreset = fillHTMLWithPreset;
function solveClick() {
    //TASK disable solve when solving
    helpers_1.updateBoardWithHTMLInput();
    logging_1.printBoard(exports.BOARD);
    interactivity_1.makeBoardReadOnly();
    dynamic_styles_1.setHTMLBackgroundsUsingBoard();
    speed_1.updateInstantSolve();
    logging_1.logStatus("Solving...");
    startSolve();
}
//Starts the actual algorithm solving the sudoku
function startSolve() {
    recursiveValidate(0, 0, 1).then(function () {
        alert(noOfSolutions + " found");
        console.dir(solutions);
    });
}
function recursiveValidate(row, col, value) {
    return __awaiter(this, void 0, void 0, function () {
        var isFixed, _a, nextRow, nextCol, isValidValue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(row == 9)) return [3 /*break*/, 2];
                    logging_1.logStatus("delay 1");
                    return [4 /*yield*/, speed_1.delay()];
                case 1:
                    _b.sent();
                    noOfSolutions++;
                    console.dir(exports.BOARD);
                    solutions.push(just_clone_1.default(exports.BOARD));
                    //BUG Det er ikke board der skal pushes til solutions men en kopi heraf. Implementer en cloneBoard(board) metode, som returnerer en kopi af boarded. 
                    showDoneAnimation();
                    return [2 /*return*/];
                case 2:
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.YELLOW_COLOR);
                    logging_1.logStatus("RecursiveValidate: (row, col, value): (" + row + ", " + col + ", " + value + ")");
                    isFixed = exports.BOARD[row][col].fixed;
                    _a = helpers_1.GetNextRowAndCol(row, col), nextRow = _a[0], nextCol = _a[1];
                    if (!isFixed) return [3 /*break*/, 6];
                    logging_1.logStatus("delay 2");
                    return [4 /*yield*/, speed_1.delay()];
                case 3:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.GREY_COLOR_FIXED);
                    return [4 /*yield*/, recursiveValidate(nextRow, nextCol, 1)];
                case 4:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.YELLOW_COLOR);
                    logging_1.logStatus("delay 3");
                    return [4 /*yield*/, speed_1.delay()];
                case 5:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.GREY_COLOR_FIXED);
                    return [2 /*return*/];
                case 6:
                    helpers_1.setHTMLValue(row, col, value);
                    isValidValue = helpers_1.isValidRow(row, col, value) && helpers_1.isValidCol(row, col, value) &&
                        helpers_1.isValidBox(row, col, value);
                    if (!isValidValue) return [3 /*break*/, 9];
                    logging_1.logStatus("delay 4");
                    return [4 /*yield*/, speed_1.delay()];
                case 7:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.GREEN_COLOR);
                    helpers_1.setBoardValue(row, col, value);
                    helpers_1.setHTMLValue(row, col, value);
                    return [4 /*yield*/, recursiveValidate(nextRow, nextCol, 1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.YELLOW_COLOR);
                    if (!(value != 9)) return [3 /*break*/, 12];
                    logging_1.logStatus("delay 5");
                    return [4 /*yield*/, speed_1.delay()];
                case 10:
                    _b.sent();
                    helpers_1.setBoardValue(row, col, value);
                    helpers_1.setHTMLValue(row, col, value);
                    //Try next value in this cell
                    logging_1.logStatus(value + " not correct, trying next value");
                    return [4 /*yield*/, recursiveValidate(row, col, value + 1)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
                case 12:
                    logging_1.logStatus("Delay 6");
                    return [4 /*yield*/, speed_1.delay()];
                case 13:
                    _b.sent();
                    helpers_1.setBoardValue(row, col, 0);
                    helpers_1.setHTMLValue(row, col, 0);
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.WHITE_COLOR);
                    _b.label = 14;
                case 14:
                    logging_1.printBoard(exports.BOARD);
                    return [2 /*return*/];
            }
        });
    });
}
function showDoneAnimation() {
    //TODO Vis, at algoritmen er færdig. Eventuelt tæl antal løsninger
}
function showSolution(solutionIndex) {
    helpers_1.updateHTMLWithBoard(solutions[solutionIndex]);
}
window.onload = main;
//TASK Vis antal løsninger der er fundet 
//TASK Fix speed - skal ikke vise værdien og skal bruge en funktion der accelererer hurtigere
//TASK Gør board read-only når algoritme er i gang
//TASK Lav 4 generate knapper "Easy, medium, hard, random"
//FEATURE Vis alle løsninger der blev fundet.
//FEATURE Implementer pause knap
//FEATURE Implementer quickSolve algoritme på et andet board. 
//FEATURE Solve API
//FEATURE Grade API
//FEATURE Validate API
//FEATURE Generate API
//FEATURE Generelt design af side
//FEATURE Opsætning af hjemmeside

},{"../test/test":9,"./colors":1,"./constants":2,"./dynamic_styles":3,"./helpers":4,"./interactivity":5,"./logging":6,"./speed":8,"just-clone":10}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpeedHTMLValue = exports.updateInstantSolve = exports.delay = exports.currentSpeed = void 0;
var logging_1 = require("./logging");
var DEFAULT_SPEED = getCurrentSpeedSliderValue();
exports.currentSpeed = DEFAULT_SPEED;
var speedSlider = document.querySelector("#speedSlider");
var instantSolve;
function delay() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (instantSolve)
                return [2 /*return*/];
            return [2 /*return*/, new Promise(function (res) {
                    setTimeout(res, exports.currentSpeed);
                })];
        });
    });
}
exports.delay = delay;
/**
 * Sets the instantSolve variable depending on which "Solve Algorithm Yes/No" radio button is currently checked
 */
function updateInstantSolve() {
    var doNotShowAlgorithm = document.querySelector("#doNotShowAlgorithm").checked;
    logging_1.logStatus("setting instantSolve to: " + doNotShowAlgorithm);
    instantSolve = doNotShowAlgorithm;
}
exports.updateInstantSolve = updateInstantSolve;
function setSpeed(newSpeed) {
    logging_1.logStatus("Setting new speed to: " + newSpeed);
    updateSpeedHTMLValue(newSpeed);
    exports.currentSpeed = newSpeed;
}
function updateSpeedHTMLValue(newSpeed) {
    // logStatus(`Updating speed HTML Value to: ${newSpeed}`)
    var prefix = "Speed:";
    document.querySelector("#speedHeader").innerHTML = prefix + " " + newSpeed;
}
exports.updateSpeedHTMLValue = updateSpeedHTMLValue;
speedSlider.oninput = function () {
    setSpeed(getCurrentSpeedSliderValue());
};
function getCurrentSpeedSliderValue() {
    var rangeSlider = getRangeSlider();
    return Number.parseInt(rangeSlider.max) - Number.parseInt(rangeSlider.value);
}
function getRangeSlider() {
    return document.querySelector("#speedSlider");
}

},{"./logging":6}],9:[function(require,module,exports){
"use strict";
// let fixedCellsTest: Set<[number, number]>
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = void 0;
var helpers_1 = require("../src/helpers");
var logging_1 = require("../src/logging");
var main_1 = require("../src/main");
function runTests() {
    setupTest();
    testIsValidRow();
    testIsValidCol();
    testIsValidBox();
    testSetCellValue();
    allTestsPassed();
    //Setup board again
    // setupBoard();
}
exports.runTests = runTests;
function setupTest() {
    var testPreset = [
        [0, 6, 8, /**/ 0, 0, 0, /**/ 3, 0, 0],
        [0, 3, 0, /**/ 1, 0, 0, /**/ 0, 4, 0],
        [0, 4, 9, /**/ 3, 0, 0, /**/ 7, 0, 0],
        /*                            */
        [5, 2, 0, /**/ 0, 0, 0, /**/ 0, 9, 4],
        [0, 0, 1, /**/ 0, 0, 6, /**/ 8, 7, 3],
        [0, 0, 0, /**/ 0, 0, 0, /**/ 0, 0, 6],
        /*                            */
        [0, 0, 0, /**/ 0, 0, 8, /**/ 0, 0, 0],
        [0, 0, 0, /**/ 4, 0, 7, /**/ 5, 0, 0],
        [0, 0, 0, /**/ 0, 1, 0, /**/ 0, 6, 0]
    ];
    main_1.fillHTMLWithPreset(testPreset);
    helpers_1.updateBoardWithHTMLInput();
}
function testIsValidRow() {
    setupTest();
    if (helpers_1.isValidRow(0, 0, 3) == true)
        testFailed();
    setupTest();
    if (helpers_1.isValidRow(0, 5, 4) == false)
        testFailed();
    setupTest();
    if (helpers_1.isValidRow(8, 4, 5) == false)
        testFailed();
}
function testIsValidCol() {
    if (helpers_1.isValidCol(0, 3, 4))
        testFailed();
    if (helpers_1.isValidCol(8, 8, 3))
        testFailed();
    if (!helpers_1.isValidCol(4, 5, 5))
        testFailed();
    if (!helpers_1.isValidCol(6, 0, 1))
        testFailed();
}
function testIsValidBox() {
    if (helpers_1.isValidBox(3, 3, 6))
        testFailed();
    if (helpers_1.isValidBox(0, 0, 9))
        testFailed();
    if (!helpers_1.isValidBox(5, 0, 6))
        testFailed();
    if (!helpers_1.isValidBox(8, 8, 1))
        testFailed();
}
function testSetCellValue() {
    setupTest();
    helpers_1.setBoardValue(0, 0, 1);
    helpers_1.setHTMLValue(0, 0, 1);
    if (helpers_1.getHTMLValue(0, 0) != 1)
        testFailed();
    setupTest();
    helpers_1.setBoardValue(8, 8, 6);
    helpers_1.setHTMLValue(8, 8, 6);
    if (helpers_1.getHTMLValue(8, 8) != 6)
        testFailed();
    setupTest();
    try {
        helpers_1.setBoardValue(8, 4, 8);
        helpers_1.setHTMLValue(8, 4, 8);
    }
    catch (error) {
        if (helpers_1.getHTMLValue(8, 4) != 1)
            testFailed();
    }
}
function allTestsPassed() {
    logging_1.logStatus("All tests passed");
}
function testFailed() {
    alert("Test Failed");
    throw new Error("Test failed");
}

},{"../src/helpers":4,"../src/logging":6,"../src/main":7}],10:[function(require,module,exports){
module.exports = clone;

/*
  Deep clones all properties except functions

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone(obj) {
  if (typeof obj == 'function') {
    return obj;
  }
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    // include prototype properties
    var value = obj[key];
    var type = {}.toString.call(value).slice(8, -1);
    if (type == 'Array' || type == 'Object') {
      result[key] = clone(value);
    } else if (type == 'Date') {
      result[key] = new Date(value.getTime());
    } else if (type == 'RegExp') {
      result[key] = RegExp(value.source, getRegExpFlags(value));
    } else {
      result[key] = value;
    }
  }
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == 'string') {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}

},{}]},{},[7]);
