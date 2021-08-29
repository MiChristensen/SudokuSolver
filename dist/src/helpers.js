"use strict";
/**
 * Returns the HTMLCell corresponding to the parameter cell
 * @param cell the cell to which we want to find the corresponding HTMLCell
 * @returns the corresponding HTMLCell
 */
function getHTMLCellFromCell(cell) {
    return cells[convertRowColToCellNo(cell.row, cell.col)];
}
function getHTMLCellFromRowCol(row, col) {
    var cellNo = convertRowColToCellNo(row, col);
    return cells[cellNo];
}
/** Converts a cell number (index) to a (row, col) coordinate
 * @param cellNo cell number (index) to convert
 * @returns the (row, col) coordinate
 */
function convertCellNoToRowCol(cellNo) {
    var row = Math.floor(cellNo / BOARD_SIZE);
    var col = cellNo % BOARD_SIZE;
    return [row, col];
}
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
    if (col < BOARD_SIZE - 1) {
        newCol += 1;
    }
    else if (col == BOARD_SIZE - 1) {
        newRow += 1;
        newCol = 0;
    }
    return [newRow, newCol];
}
/** Converts a (row, col) coordinate to an index as used in the "cells" array
 * @param row the row of the cell
 * @param col the column of the cell
 * @returns the index (cell number) of the
 */
function convertRowColToCellNo(row, col) {
    return row * BOARD_SIZE + col;
}
//Returns the value inside the HTMLCell with given row and col as a number
function getHTMLValue(row, col) {
    var cellNo = convertRowColToCellNo(row, col);
    var value = parseInt(cells[cellNo].value);
    return value;
}
/** Uses values in cells variable to create cells in board variable
 * @returns the board variable
 */
function updateBoardWithHTMLInput() {
    for (var currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        for (var currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
            var cell = cells[convertRowColToCellNo(currentRow, currentCol)];
            var currentValueNumber = Number.parseInt(cell.value);
            var updatedCell = {
                row: currentRow,
                col: currentCol,
                value: currentValueNumber,
                fixed: cell.value ? true : false
            };
            board[currentRow][currentCol] = updatedCell;
        }
    }
    printBoard(board);
}
/** Updates the HTML board with the values in the argument board.
 * @param board The Board to show in the html board
 */
function updateHTMLWithBoard(board) {
    for (var currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        for (var currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
            var cell = board[currentRow][currentCol];
            var currentValue = cell.value;
            cells[convertRowColToCellNo(currentRow, currentCol)].value = currentValue.toString();
        }
    }
}
/** Returns a board with 0 in all cells.
 * @returns Board with 0 in all cells
 */
function initBoard() {
    var board = [];
    var cellsIndex = 0;
    for (var currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        board.push([]);
        for (var currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
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
/** Iterates through all HTMLCells in "cells" array.
 * For every cell, validate the value in this cell and color
 * the cell red if invalid or white (aka. "") if valid
 */
function validateAndColorAllCells() {
    var solveButton = document.getElementById("solveButton");
    var existsInvalidCell = false;
    Array.from(cells).forEach(function (currentCell) {
        var cellValueNumber = parseInt(currentCell.value);
        var _a = convertCellNoToRowCol(currentCell.index), currentRow = _a[0], currentCol = _a[1];
        var isInvalidNumber = !!cellValueNumber &&
            (!isValidBox(currentRow, currentCol, cellValueNumber) ||
                !isValidCol(currentRow, currentCol, cellValueNumber) ||
                !isValidRow(currentRow, currentCol, cellValueNumber));
        if (isInvalidNumber) {
            setCellBackgroundColor(currentRow, currentCol, RED_COLOR);
            existsInvalidCell = true;
        }
        else
            setCellBackgroundColor(currentRow, currentCol, "");
    });
    solveButton.disabled = existsInvalidCell ? true : false;
}
//# sourceMappingURL=helpers.js.map