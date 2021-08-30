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
//# sourceMappingURL=logging.js.map