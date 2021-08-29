"use strict";
function logStatus(msg) {
    if (PRINT_INFO)
        console.log(msg);
}
function logFunctionStart(functionName) {
    if (PRINT_INFO) {
        console.log("\n");
        console.log("==========================  " + functionName + "  ==========================");
    }
}
function logFunctionEnd(functionName) {
    if (PRINT_INFO) {
        console.log("==========================  End of " + functionName + "  ==========================");
        console.log("\n");
    }
}
function printBoard(board) {
    logFunctionStart("Printing board");
    for (var row = 0; row < BOARD_SIZE; row++) {
        var rowString = "";
        for (var col = 0; col < BOARD_SIZE; col++) {
            var currentCell = board[row][col];
            var currentValue = !currentCell.value ? "%" : currentCell.value;
            rowString += "" + currentValue + (currentCell.fixed ? "f" : " ") + " | ";
        }
        logStatus(rowString);
    }
    logFunctionEnd("Printing board");
}
//# sourceMappingURL=logging.js.map