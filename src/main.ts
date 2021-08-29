const SUGOKU_URL: string = "https://sugoku.herokuapp.com/board";
const PRINT_INFO = false;
const BOARD_SIZE = 9;
const rows = document.getElementsByClassName("row");
const cells = document.getElementsByClassName("cell") as HTMLCollectionOf<HTMLCell>
const GREEN_COLOR = "#8cf91f"
const RED_COLOR = "#e63946"
const GREY_COLOR_FIXED = "#828282"
const GREY_COLOR_FOCUS = "bdbdbd"
const YELLOW_COLOR = "#ffff33"
const WHITE_COLOR = "white"
let board: Board;
let solving: boolean = false;
let noOfSolutions: number = 0;
let solutions: Board[] = [];


async function main() {
    // const preset = await getPreset(Difficulty.EASY);
    const preset = [
        [0,7,0,0,0,0,0,0,0], 
        [0,2,0,4,5,9,6,0,8],
        [0,0,9,0,7,8,0,0,0],
        [2,0,4,0,3,0,7,0,0], 
        [0,0,6,8,9,0,2,1,0], 
        [7,9,8,0,1,0,0,0,0],
        [5,3,0,0,8,1,9,4,0],
        [0,4,7,9,2,5,0,0,1],
        [0,0,1,0,0,0,0,0,0]
    ]
    processHTMLCells();
    board = initBoard();
    runTests();
    updateSpeedHTMLValue(currentSpeed)
    setVerticalBorders();
    // setHTMLBackgroundsUsingBoard();
    fillHTMLWithPreset(preset);
    updateBoardWithHTMLInput();
}

async function getPreset(difficulty: Difficulty) {
    return window.fetch(`${SUGOKU_URL}?difficulty=${difficulty}`)
        .then(response => response.json())
        .then(jsonObject => {
            const fetchedBoard = jsonObject.board;
            return fetchedBoard
        }
        )
}


/**
 * Uses the values in preset variable to fill innerHTML values in cells variable 
 * @param preset the number[][] preset 
 */
function fillHTMLWithPreset(preset: number[][]) {
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i] as HTMLCell
        const row: number = Math.floor(i / 9);
        const col: number = i % 9;
        //Replace "0"'s in preset with "" while filling html board
        cell.value = preset[row][col] == 0 ? "" : preset[row][col].toString();
    }
}

function solveClick() {
    //TASK disable solve when solving
    updateBoardWithHTMLInput();
    printBoard(board);
    makeBoardReadOnly();
    setHTMLBackgroundsUsingBoard();
    updateInstantSolve();
    logStatus("Solving...");
    startSolve();
}

//Starts the actual algorithm solving the sudoku
function startSolve() {
    recursiveValidate(0, 0, 1).then(() => {
        alert(`${noOfSolutions} found`);
        console.dir(solutions);
    }
    )
}

async function recursiveValidate(row: number, col: number, value: number) {
    //Algorithm is done
    if (row == 9) {
        logStatus("delay 1");
        await delay()
        noOfSolutions++;
        console.dir(board)
        solutions.push(board);
        //BUG Det er ikke board der skal pushes til solutions men en kopi heraf. Implementer en cloneBoard(board) metode, som returnerer en kopi af boarded. 
        showDoneAnimation();
        return;
    }

    setCellBackgroundColor(row, col, YELLOW_COLOR)
    logStatus(`RecursiveValidate: (row, col, value): (${row}, ${col}, ${value})`);
    const isFixed = board[row][col].fixed
    const [nextRow, nextCol] = GetNextRowAndCol(row, col);


    if (isFixed) {
        logStatus("delay 2");
        await delay()
        setCellBackgroundColor(row, col, GREY_COLOR_FIXED)
        await recursiveValidate(nextRow, nextCol, 1)

        setCellBackgroundColor(row, col, YELLOW_COLOR)
        logStatus("delay 3");
        await delay()
        setCellBackgroundColor(row, col, GREY_COLOR_FIXED)
        return;
    }

    setHTMLValue(row, col, value)

    let isValidValue = isValidRow(row, col, value) && isValidCol(row, col, value) &&
        isValidBox(row, col, value);
    if (isValidValue)
    //param value is a valid value for cell (row,col)
    {
        logStatus("delay 4");
        await delay()
        setCellBackgroundColor(row, col, GREEN_COLOR);
        setBoardValue(row, col, value);
        setHTMLValue(row, col, value);
        await recursiveValidate(nextRow, nextCol, 1);
    }
    setCellBackgroundColor(row, col, YELLOW_COLOR)
    //No solution exists with this value 

    if (value != 9) {
        logStatus("delay 5");
        await delay()
        setBoardValue(row, col, value);
        setHTMLValue(row, col, value);
        //Try next value in this cell
        logStatus(`${value} not correct, trying next value`);
        await recursiveValidate(row, col, value + 1)
        return;
    }
    else {
        logStatus("Delay 6")
        await delay()
        setBoardValue(row, col, 0);
        setHTMLValue(row, col, 0);
        setCellBackgroundColor(row, col, WHITE_COLOR)
    }
    printBoard(board);
}

function setHTMLValue(row: number, col: number, value: number): void {
    let cell = getHTMLCellFromRowCol(row, col)
    cell.value = value == 0 ? "" : value.toString();
    logStatus(`setHTMLValue: (row, col, value): (${row}, ${col}, ${value})`);
}

function setBoardValue(row: number, col: number, value: number): void {
    if (board[row][col].fixed) {
        throw new Error(`Tried to setCellValue of fixed cell with params row: ${row}, col: ${col}, value: ${value}`);
    }
    const newBoardValue = value == 0 ? NaN : value
    logStatus(`setBoardValue: (row,col,value): (${row}, ${col}, ${value})`);
    board[row][col].value = newBoardValue;
}

function isValidRow(row: number, col: number, value: number): boolean {
    logFunctionStart("Row validation");
    logStatus(`(row, col, value) = (${row}, ${col}, ${value})`);

    for (let currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
        if (currentCol == col) continue;
        if (board[row][currentCol].value == value) {
            logStatus("Row Validation: false");
            logFunctionEnd("Row Validation");
            return false;
        }
    }
    logStatus("Row Validation: true");
    logFunctionEnd("Row Validation");
    return true;
}

function isValidCol(row: number, col: number, value: number): boolean {
    logFunctionStart("Column Validation")
    logStatus(`(row, col, value): (${row}, ${col}, ${value})`);

    for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        if (currentRow == row) continue;
        if (board[currentRow][col].value == value) {
            logStatus("Column validation: false");
            logFunctionEnd("Column Validation");
            return false;
        }
    }
    logStatus("Column validation: true");
    logFunctionEnd("Column Validation");
    return true;
}

function isValidBox(row: number, col: number, value: number): boolean {
    logFunctionStart(" Box validation")
    logStatus(`(row, col, value) = (${row}, ${col}, ${value})`);
    var currentRow = row - row % 3;
    var nextHorizontalEdge = currentRow + 2;
    var currentCol = col - col % 3;
    var nextVerticalEdge = currentCol + 2;

    while (currentRow <= nextHorizontalEdge && currentCol <= nextVerticalEdge) {
        const boardValue = board[currentRow][currentCol].value
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

function showDoneAnimation() {
    //TODO Vis, at algoritmen er færdig. Eventuelt tæl antal løsninger
}

function showSolution(solutionIndex: number) {
    updateHTMLWithBoard(solutions[solutionIndex])
}

window.onload = main;

//TASK Vis antal løsninger der er fundet LOLllll
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
//FEATURE Opsætning af GIT

