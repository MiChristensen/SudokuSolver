import { BOARD_SIZE } from "./constants";

export const PRINT_INFO = false;

export function logStatus(msg: string) {
    if (PRINT_INFO) console.log(msg);
}

export function logFunctionStart(functionName: string) {
    if(PRINT_INFO) {
        console.log("\n");   
        console.log(`==========================  ${functionName}  ==========================`);
    }
}

export function logFunctionEnd(functionName: string) {
    if(PRINT_INFO) {
        console.log(`==========================  End of ${functionName}  ==========================`);
        console.log("\n");
    }
}

export function printBoard(board: Board): void {
    logFunctionStart("Printing board")
    for (let row = 0; row < BOARD_SIZE; row++) {
        let rowString = ""
        for (let col = 0; col < BOARD_SIZE; col++) {
            const currentCell = board[row][col]
            const currentValue = !currentCell.value? "%" : currentCell.value;
            rowString += `${currentValue}${currentCell.fixed ? "f" : " "} | `
        }
        logStatus(rowString);
    }
    logFunctionEnd("Printing board")
}