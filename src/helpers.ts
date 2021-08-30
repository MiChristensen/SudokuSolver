import clone from "just-clone";
import { RED_COLOR } from "./colors";
import { cells, BOARD_SIZE } from "./constants";
import { setCellBackgroundColor } from "./dynamic_styles";
import { logFunctionEnd, logFunctionStart, logStatus, printBoard } from "./logging";
import { BOARD } from "./main";

/**
 * Returns the HTMLCell corresponding to the parameter cell
 * @param cell the cell to which we want to find the corresponding HTMLCell
 * @returns the corresponding HTMLCell
 */
export function getHTMLCellFromCell(cell: Cell): HTMLCell {
    return cells[convertRowColToCellNo(cell.row, cell.col)] as HTMLCell
}

export function getHTMLCellFromRowCol(row: number, col: number): HTMLCell {
    const cellNo = convertRowColToCellNo(row, col);
    return cells[cellNo] as HTMLCell
}

/** Converts a cell number (index) to a (row, col) coordinate
 * @param cellNo cell number (index) to convert
 * @returns the (row, col) coordinate
 */
export function convertCellNoToRowCol(cellNo: number): [number, number] {
    const row: number = Math.floor(cellNo / BOARD_SIZE);
    const col: number = cellNo % BOARD_SIZE;
    return [row, col];
}

/** Gets the next (row, col) coordinate which means either the 
 * cell to the right or the leftmost cell in the row beneath if 
 * currently at a rightmost cell 
 * @param row The current row
 * @param col The current column
 * @returns The (row, col) coordinate
 */
export function GetNextRowAndCol(row: number, col: number): [number, number] {
    let newRow = row;
    let newCol = col;
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
export function convertRowColToCellNo(row: number, col: number): number {
    return row * BOARD_SIZE + col;
}

//Returns the value inside the HTMLCell with given row and col as a number
export function getHTMLValue(row: number, col: number): number {
    const cellNo = convertRowColToCellNo(row, col);
    const value = parseInt((cells[cellNo] as HTMLCell).value);
    return value
}

/** Uses values in cells variable to create cells in board variable
 * @returns the board variable
 */
export function updateBoardWithHTMLInput() {
    for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
            const cell = cells[convertRowColToCellNo(currentRow, currentCol)]
            const currentValueNumber: number = Number.parseInt(cell.value);
            let updatedCell: Cell = {
                row: currentRow,
                col: currentCol,
                value: currentValueNumber,
                fixed: cell.value ? true : false
            }
            BOARD[currentRow][currentCol] = updatedCell
        }
    }
    printBoard(BOARD)
}

/** Updates the HTML board with the values in the argument board.
 * @param board The Board to show in the html board
 */
export function updateHTMLWithBoard(board: Board) {
    for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
            const cell = board[currentRow][currentCol]
            const currentValue = cell.value;
            cells[convertRowColToCellNo(currentRow, currentCol)].value = currentValue.toString();
        }
    }
}

/** Returns a board with 0 in all cells.
 * @returns Board with 0 in all cells
 */
export function initBoard(): Cell[][] {
    let board: Cell[][] = [];
    let cellsIndex: number = 0;
    for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        board.push([]);
        for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
            let newCell: Cell = {
                row: currentRow,
                col: currentCol,
                value: 0,
                fixed: false
            }
            cellsIndex++;
            board[currentRow].push(newCell)
        }
    }
    return board
}

/** Iterates through all HTMLCells in "cells" array.
 * For every cell, validate the value in this cell and color 
 * the cell red if invalid or white (aka. "") if valid
 */
export function validateAndColorAllCells() {
    const solveButton = document.getElementById("solveButton") as HTMLInputElement;
    let existsInvalidCell = false;

    Array.from(cells).forEach(currentCell => {
        const cellValueNumber = parseInt(currentCell.value);

        const [currentRow, currentCol] = convertCellNoToRowCol(currentCell.index);

        const isInvalidNumber =
            !!cellValueNumber &&
            (
                !isValidBox(currentRow, currentCol, cellValueNumber) ||
                !isValidCol(currentRow, currentCol, cellValueNumber) ||
                !isValidRow(currentRow, currentCol, cellValueNumber)
            )

        if (isInvalidNumber) {
            setCellBackgroundColor(currentRow, currentCol, RED_COLOR);
            existsInvalidCell = true;
        }
        else setCellBackgroundColor(currentRow, currentCol, "")
    })

    solveButton.disabled = existsInvalidCell ? true : false;
}

export function cloneBoard(board: Board): Board {
    return clone(board);
}

export function isValidRow(row: number, col: number, value: number): boolean {
    logFunctionStart("Row validation");
    logStatus(`(row, col, value) = (${row}, ${col}, ${value})`);

    for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
        if (currentCol == col) continue;
        if (BOARD[row][currentCol].value == value) {
            logStatus("Row Validation: false");
            logFunctionEnd("Row Validation");
            return false;
        }
    }
    logStatus("Row Validation: true");
    logFunctionEnd("Row Validation");
    return true;
}

export function isValidCol(row: number, col: number, value: number): boolean {
    logFunctionStart("Column Validation")
    logStatus(`(row, col, value): (${row}, ${col}, ${value})`);

    for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        if (currentRow == row) continue;
        if (BOARD[currentRow][col].value == value) {
            logStatus("Column validation: false");
            logFunctionEnd("Column Validation");
            return false;
        }
    }
    logStatus("Column validation: true");
    logFunctionEnd("Column Validation");
    return true;
}

export function isValidBox(row: number, col: number, value: number): boolean {
    logFunctionStart(" Box validation")
    logStatus(`(row, col, value) = (${row}, ${col}, ${value})`);
    var currentRow = row - row % 3;
    var nextHorizontalEdge = currentRow + 2;
    var currentCol = col - col % 3;
    var nextVerticalEdge = currentCol + 2;

    while (currentRow <= nextHorizontalEdge && currentCol <= nextVerticalEdge) {
        const boardValue = BOARD[currentRow][currentCol].value
        logStatus(`(row, NHE, col, NVE, boardValud, valueToValidate): (${currentRow}, ${nextHorizontalEdge}, ${currentCol}, ${nextVerticalEdge}, ${boardValue}, ${value})`);
        const ignore = currentRow == row && currentCol == col
        if (boardValue == value && !ignore) {
            logStatus("Box validated: false");
            logFunctionEnd("Box validation");
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
    logStatus("Box validated: true");
    logFunctionEnd("Box validation")
    return true;
}

export function setHTMLValue(row: number, col: number, value: number): void {
    let cell = getHTMLCellFromRowCol(row, col)
    cell.value = value == 0 ? "" : value.toString();
    logStatus(`setHTMLValue: (row, col, value): (${row}, ${col}, ${value})`);
}

export function setBoardValue(row: number, col: number, value: number): void {
    if (BOARD[row][col].fixed) {
        throw new Error(`Tried to setCellValue of fixed cell with params row: ${row}, col: ${col}, value: ${value}`);
    }
    const newBoardValue = value == 0 ? NaN : value
    logStatus(`setBoardValue: (row,col,value): (${row}, ${col}, ${value})`);
    BOARD[row][col].value = newBoardValue;
}