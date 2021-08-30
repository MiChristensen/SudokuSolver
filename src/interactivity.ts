import { cells, BOARD_SIZE } from "./constants";
import { convertCellNoToRowCol, updateBoardWithHTMLInput, validateAndColorAllCells, convertRowColToCellNo, getHTMLCellFromCell } from "./helpers";
import { logStatus } from "./logging";
import { BOARD } from "./main";

//Gives every cell an index, a maxlenght = 1 and adds eventlistener.
export function processHTMLCells() {
    for (let cellCounter = 0; cellCounter < cells.length; cellCounter++) {
        const cell = cells[cellCounter]
        cell.maxLength = 1
        cell.addEventListener("keydown", cellKeyDownEvent);
        cell.addEventListener("input", cellInputEvent);
        cell.index = cellCounter;
    }
}

export function cellInputEvent(event: Event) {
    const cell = event.target as HTMLCell;
    const [row, col] = convertCellNoToRowCol(cell.index);
    if (parseInt(cell.value) == BOARD[row][col].value) return;

    updateBoardWithHTMLInput();
    validateAndColorAllCells();

    cell.select();
}

/** Checks which key has been pressed and executes logik depending on the 
 * key pressed
 * @param event KeyBoardEvent triggering this function
 */
export function cellKeyDownEvent(event: KeyboardEvent): void {
    const cell = event.target as HTMLCell
    const cellNo = cell.index;
    const [row, col] = convertCellNoToRowCol(cellNo)

    switch (event.key) {
        case 'ArrowUp': {
            handleArrowUp(row, col)
            break;
        }
        case 'ArrowRight': {
            handleArrowRight(row, col)
            break;
        }
        case 'ArrowDown': {
            handleArrowDown(row, col)
            break;
        }
        case 'ArrowLeft': {
            handleArrowLeft(row, col)
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
            if (event.ctrlKey) break;
        }
        //Make buttons Backspace and Delete remove value inside cell
        case 'Backspace':
        case 'Delete': {
            cell.value = "";
            updateBoardWithHTMLInput();
            validateAndColorAllCells();
        }
        default: {
            cell.select();

            if (!validateInput(event.key)) {
                //Prevent the input from updating the cell value
                event.preventDefault();
            }
            // if(!isValidBox(row,col,cell.value)))
            const previousValue = cells[cellNo].value

            //Combined values such as pressing '~' + 'm' will prevent the '~' but update 
            //the value to 'm'. Using callback function to replace any new invalid input 
            //with the previous value.  
            setTimeout(delayedReplace, 0, cell.index, previousValue)
            updateBoardWithHTMLInput();
        }
    }
}

/** Handles the event of the user pressing the ArrowUp key.
 * Selects the cell one row above or the cell in the bottom row 
 * at this col if currently at top row
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
export function handleArrowUp(row: number, col: number) {
    const isTopRow = row == 0;
    if (!isTopRow) {
        //Select cell above
        cells[convertRowColToCellNo(row - 1, col)].select();
    }
    else {
        //Select cell in bottom row at this col
        cells[convertRowColToCellNo(BOARD_SIZE - 1, col)].select();
    }
}

/** Handles the event of the user pressing the ArrowRight key.
 * Selects the cell to the right or the cell at this row and 
 * column 0 if currently at right-most column
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
export function handleArrowRight(row: number, col: number) {
    const isRightMostColumn = col == BOARD_SIZE - 1;
    if (!isRightMostColumn) {
        //Select cell to the right
        cells[convertRowColToCellNo(row, col + 1)].select();
    }
    else {
        //Select cell at this row and col 0
        cells[convertRowColToCellNo(row, 0)].select();
    }
}


/** Handles the event of the user pressing the ArrowDown key.
 * Selects the cell one row below or the cell in the top row 
 * at this col if currently at bottom row
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
export function handleArrowDown(row: number, col: number) {
    const isBottomRow = row == BOARD_SIZE - 1;
    if (!isBottomRow) {
        //Select cell below
        cells[convertRowColToCellNo(row + 1, col)].select();
    }
    else {
        //Select top row cell in this column
        cells[convertRowColToCellNo(0, col)].select();
    }
}

/** Handles the event of the user pressing the ArrowLeft key.
 * Selects the cell to the left or the cell at this row and 
 * column 0 if currently at left-most column
 * @param {*} row the row of the cell currently selected
 * @param {*} col the col of the cell currently selected
 */
export function handleArrowLeft(row: number, col: number) {
    const isLeftMostColumn = col == 0;
    if (!isLeftMostColumn) {
        //Select cell to the left
        cells[convertRowColToCellNo(row, col - 1)].select();
    }
    else {
        //Select cell at this row and last col
        cells[convertRowColToCellNo(row, BOARD_SIZE - 1)].select();
    }
}

/**
 * Checks if the inputString is a valid value [1 - 9]
 * @param {*} inputString 
 * @returns 
 */
 export function validateInput(inputString: string) {
    const inputAsNumber = Number.parseInt(inputString)
    const isValidNumber = !!inputAsNumber && inputAsNumber != 0 && inputAsNumber <= 9
    logStatus(`validate input: ${inputString} => ${isValidNumber}`);
    return isValidNumber;
}

/** This function checks the value of a cell with a given cellIndex. If 
 * the value is not valid according to the validateInput function, the value
 * is replaced with the previousValue parameter.
 * 
 * @param {*} cellIndex The index of the cell in question
 * @param {*} previousValue The previous value of the cell
 */
 export function delayedReplace(cellIndex: number, previousValue: any) {
    const cell = cells[cellIndex]
    const newValue = cell.value;
    if (!validateInput(newValue)) {
        cell.value = previousValue
        logStatus(`delayedReplace: replacing ${newValue} with previous value: ${previousValue}`);
    }
}

export function makeBoardReadOnly(): void {
    BOARD.forEach(row => {
        row.forEach(cell => {
            const htmlCell = getHTMLCellFromCell(cell)
            htmlCell.disabled = true;
        })
    })
}

