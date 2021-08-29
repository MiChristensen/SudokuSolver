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
var SUGOKU_URL = "https://sugoku.herokuapp.com/board";
var PRINT_INFO = false;
var BOARD_SIZE = 9;
var rows = document.getElementsByClassName("row");
var cells = document.getElementsByClassName("cell");
var GREEN_COLOR = "#8cf91f";
var RED_COLOR = "#e63946";
var GREY_COLOR_FIXED = "#828282";
var GREY_COLOR_FOCUS = "bdbdbd";
var YELLOW_COLOR = "#ffff33";
var WHITE_COLOR = "white";
var board;
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
            processHTMLCells();
            board = initBoard();
            runTests();
            updateSpeedHTMLValue(currentSpeed);
            setVerticalBorders();
            // setHTMLBackgroundsUsingBoard();
            fillHTMLWithPreset(preset);
            updateBoardWithHTMLInput();
            return [2 /*return*/];
        });
    });
}
function getPreset(difficulty) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, window.fetch(SUGOKU_URL + "?difficulty=" + difficulty)
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
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var row = Math.floor(i / 9);
        var col = i % 9;
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
                    logStatus("delay 1");
                    return [4 /*yield*/, delay()];
                case 1:
                    _b.sent();
                    noOfSolutions++;
                    console.dir(board);
                    solutions.push(board);
                    //BUG Det er ikke board der skal pushes til solutions men en kopi heraf. Implementer en cloneBoard(board) metode, som returnerer en kopi af boarded. 
                    showDoneAnimation();
                    return [2 /*return*/];
                case 2:
                    setCellBackgroundColor(row, col, YELLOW_COLOR);
                    logStatus("RecursiveValidate: (row, col, value): (" + row + ", " + col + ", " + value + ")");
                    isFixed = board[row][col].fixed;
                    _a = GetNextRowAndCol(row, col), nextRow = _a[0], nextCol = _a[1];
                    if (!isFixed) return [3 /*break*/, 6];
                    logStatus("delay 2");
                    return [4 /*yield*/, delay()];
                case 3:
                    _b.sent();
                    setCellBackgroundColor(row, col, GREY_COLOR_FIXED);
                    return [4 /*yield*/, recursiveValidate(nextRow, nextCol, 1)];
                case 4:
                    _b.sent();
                    setCellBackgroundColor(row, col, YELLOW_COLOR);
                    logStatus("delay 3");
                    return [4 /*yield*/, delay()];
                case 5:
                    _b.sent();
                    setCellBackgroundColor(row, col, GREY_COLOR_FIXED);
                    return [2 /*return*/];
                case 6:
                    setHTMLValue(row, col, value);
                    isValidValue = isValidRow(row, col, value) && isValidCol(row, col, value) &&
                        isValidBox(row, col, value);
                    if (!isValidValue) return [3 /*break*/, 9];
                    logStatus("delay 4");
                    return [4 /*yield*/, delay()];
                case 7:
                    _b.sent();
                    setCellBackgroundColor(row, col, GREEN_COLOR);
                    setBoardValue(row, col, value);
                    setHTMLValue(row, col, value);
                    return [4 /*yield*/, recursiveValidate(nextRow, nextCol, 1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    setCellBackgroundColor(row, col, YELLOW_COLOR);
                    if (!(value != 9)) return [3 /*break*/, 12];
                    logStatus("delay 5");
                    return [4 /*yield*/, delay()];
                case 10:
                    _b.sent();
                    setBoardValue(row, col, value);
                    setHTMLValue(row, col, value);
                    //Try next value in this cell
                    logStatus(value + " not correct, trying next value");
                    return [4 /*yield*/, recursiveValidate(row, col, value + 1)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
                case 12:
                    logStatus("Delay 6");
                    return [4 /*yield*/, delay()];
                case 13:
                    _b.sent();
                    setBoardValue(row, col, 0);
                    setHTMLValue(row, col, 0);
                    setCellBackgroundColor(row, col, WHITE_COLOR);
                    _b.label = 14;
                case 14:
                    printBoard(board);
                    return [2 /*return*/];
            }
        });
    });
}
function setHTMLValue(row, col, value) {
    var cell = getHTMLCellFromRowCol(row, col);
    cell.value = value == 0 ? "" : value.toString();
    logStatus("setHTMLValue: (row, col, value): (" + row + ", " + col + ", " + value + ")");
}
function setBoardValue(row, col, value) {
    if (board[row][col].fixed) {
        throw new Error("Tried to setCellValue of fixed cell with params row: " + row + ", col: " + col + ", value: " + value);
    }
    var newBoardValue = value == 0 ? NaN : value;
    logStatus("setBoardValue: (row,col,value): (" + row + ", " + col + ", " + value + ")");
    board[row][col].value = newBoardValue;
}
function isValidRow(row, col, value) {
    logFunctionStart("Row validation");
    logStatus("(row, col, value) = (" + row + ", " + col + ", " + value + ")");
    for (var currentCol = 0; currentCol < BOARD_SIZE; currentCol++) {
        if (currentCol == col)
            continue;
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
function isValidCol(row, col, value) {
    logFunctionStart("Column Validation");
    logStatus("(row, col, value): (" + row + ", " + col + ", " + value + ")");
    for (var currentRow = 0; currentRow < BOARD_SIZE; currentRow++) {
        if (currentRow == row)
            continue;
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
function isValidBox(row, col, value) {
    logFunctionStart(" Box validation");
    logStatus("(row, col, value) = (" + row + ", " + col + ", " + value + ")");
    var currentRow = row - row % 3;
    var nextHorizontalEdge = currentRow + 2;
    var currentCol = col - col % 3;
    var nextVerticalEdge = currentCol + 2;
    while (currentRow <= nextHorizontalEdge && currentCol <= nextVerticalEdge) {
        var boardValue = board[currentRow][currentCol].value;
        logStatus("(row, NHE, col, NVE, boardValud, valueToValidate): (" + currentRow + ", " + nextHorizontalEdge + ", " + currentCol + ", " + nextVerticalEdge + ", " + boardValue + ", " + value + ")");
        var ignore = currentRow == row && currentCol == col;
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
    logFunctionEnd("Box validation");
    return true;
}
function showDoneAnimation() {
    //TODO Vis, at algoritmen er færdig. Eventuelt tæl antal løsninger
}
function showSolution(solutionIndex) {
    updateHTMLWithBoard(solutions[solutionIndex]);
}
window.onload = main;
//TASK Test 
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
//FEATURE Opsætning af GIT
//# sourceMappingURL=main.js.map