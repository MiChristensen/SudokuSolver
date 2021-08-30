//#region imports
import { GetNextRowAndCol, initBoard, isValidBox, isValidCol, isValidRow, setBoardValue, setHTMLValue, updateBoardWithHTMLInput, updateHTMLWithBoard } from "./helpers";
import { SUGOKU_URL, cells } from "./constants";
import { GREEN_COLOR, GREY_COLOR_FIXED, WHITE_COLOR, YELLOW_COLOR } from "./colors"
import { printBoard, logStatus } from "./logging";
import { setVerticalBorders, setHTMLBackgroundsUsingBoard, setCellBackgroundColor } from "./dynamic_styles";
import { processHTMLCells, makeBoardReadOnly } from "./interactivity";
import { updateSpeedHTMLValue, updateInstantSolve, delay, currentSpeed } from "./speed";
import clone from "just-clone";
import { runTests } from "../test/test";
//#endregion

export let BOARD: Board;

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
    BOARD = initBoard();
    runTests();
    updateSpeedHTMLValue(currentSpeed)
    setVerticalBorders();
    // setHTMLBackgroundsUsingBoard();
    fillHTMLWithPreset(preset);
    updateBoardWithHTMLInput();
}

async function fetchSugokuBoardAsync(difficulty: Difficulty) {
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
export function fillHTMLWithPreset(preset: number[][]) {
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
    printBoard(BOARD);
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
        console.dir(BOARD)
        solutions.push(clone(BOARD));
        //BUG Det er ikke board der skal pushes til solutions men en kopi heraf. Implementer en cloneBoard(board) metode, som returnerer en kopi af boarded. 
        showDoneAnimation();
        return;
    }

    setCellBackgroundColor(row, col, YELLOW_COLOR)
    logStatus(`RecursiveValidate: (row, col, value): (${row}, ${col}, ${value})`);
    const isFixed = BOARD[row][col].fixed
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
    printBoard(BOARD);
}



function showDoneAnimation() {
    //TODO Vis, at algoritmen er færdig. Eventuelt tæl antal løsninger
}

function showSolution(solutionIndex: number) {
    updateHTMLWithBoard(solutions[solutionIndex])
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

