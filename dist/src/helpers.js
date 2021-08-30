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
//# sourceMappingURL=helpers.js.map