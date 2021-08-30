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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showSolution = exports.solveClick = exports.fillHTMLWithPreset = exports.BOARD = void 0;
//#region imports
var helpers_1 = require("./helpers");
var constants_1 = require("./constants");
var colors_1 = require("./colors");
var logging_1 = require("./logging");
var dynamic_styles_1 = require("./dynamic_styles");
var interactivity_1 = require("./interactivity");
var speed_1 = require("./speed");
var just_clone_1 = __importDefault(require("just-clone"));
var test_1 = require("../test/test");
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
            interactivity_1.setupHTMLElements();
            exports.BOARD = helpers_1.initBoard();
            test_1.runTests();
            speed_1.updateSpeedHTMLValue(speed_1.currentSpeed);
            dynamic_styles_1.setVerticalBorders();
            // setHTMLBackgroundsUsingBoard();
            fillHTMLWithPreset(preset);
            helpers_1.updateBoardWithHTMLInput();
            return [2 /*return*/];
        });
    });
}
function fetchSugokuBoardAsync(difficulty) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, window.fetch(constants_1.SUGOKU_URL + "?difficulty=" + difficulty)
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
    for (var i = 0; i < constants_1.cells.length; i++) {
        var cell = constants_1.cells[i];
        var row = Math.floor(i / 9);
        var col = i % 9;
        //Replace "0"'s in preset with "" while filling html board
        cell.value = preset[row][col] == 0 ? "" : preset[row][col].toString();
    }
}
exports.fillHTMLWithPreset = fillHTMLWithPreset;
function solveClick() {
    //TASK disable solve when solving
    helpers_1.updateBoardWithHTMLInput();
    logging_1.printBoard(exports.BOARD);
    interactivity_1.makeBoardReadOnly();
    dynamic_styles_1.setHTMLBackgroundsUsingBoard();
    speed_1.updateInstantSolve();
    logging_1.logStatus("Solving...");
    startSolve();
}
exports.solveClick = solveClick;
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
                    logging_1.logStatus("delay 1");
                    return [4 /*yield*/, speed_1.delay()];
                case 1:
                    _b.sent();
                    noOfSolutions++;
                    console.dir(exports.BOARD);
                    solutions.push(just_clone_1.default(exports.BOARD));
                    //BUG Det er ikke board der skal pushes til solutions men en kopi heraf. Implementer en cloneBoard(board) metode, som returnerer en kopi af boarded. 
                    showDoneAnimation();
                    return [2 /*return*/];
                case 2:
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.YELLOW_COLOR);
                    logging_1.logStatus("RecursiveValidate: (row, col, value): (" + row + ", " + col + ", " + value + ")");
                    isFixed = exports.BOARD[row][col].fixed;
                    _a = helpers_1.GetNextRowAndCol(row, col), nextRow = _a[0], nextCol = _a[1];
                    if (!isFixed) return [3 /*break*/, 6];
                    logging_1.logStatus("delay 2");
                    return [4 /*yield*/, speed_1.delay()];
                case 3:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.GREY_COLOR_FIXED);
                    return [4 /*yield*/, recursiveValidate(nextRow, nextCol, 1)];
                case 4:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.YELLOW_COLOR);
                    logging_1.logStatus("delay 3");
                    return [4 /*yield*/, speed_1.delay()];
                case 5:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.GREY_COLOR_FIXED);
                    return [2 /*return*/];
                case 6:
                    helpers_1.setHTMLValue(row, col, value);
                    isValidValue = helpers_1.isValidRow(row, col, value) && helpers_1.isValidCol(row, col, value) &&
                        helpers_1.isValidBox(row, col, value);
                    if (!isValidValue) return [3 /*break*/, 9];
                    logging_1.logStatus("delay 4");
                    return [4 /*yield*/, speed_1.delay()];
                case 7:
                    _b.sent();
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.GREEN_COLOR);
                    helpers_1.setBoardValue(row, col, value);
                    helpers_1.setHTMLValue(row, col, value);
                    return [4 /*yield*/, recursiveValidate(nextRow, nextCol, 1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.YELLOW_COLOR);
                    if (!(value != 9)) return [3 /*break*/, 12];
                    logging_1.logStatus("delay 5");
                    return [4 /*yield*/, speed_1.delay()];
                case 10:
                    _b.sent();
                    helpers_1.setBoardValue(row, col, value);
                    helpers_1.setHTMLValue(row, col, value);
                    //Try next value in this cell
                    logging_1.logStatus(value + " not correct, trying next value");
                    return [4 /*yield*/, recursiveValidate(row, col, value + 1)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
                case 12:
                    logging_1.logStatus("Delay 6");
                    return [4 /*yield*/, speed_1.delay()];
                case 13:
                    _b.sent();
                    helpers_1.setBoardValue(row, col, 0);
                    helpers_1.setHTMLValue(row, col, 0);
                    dynamic_styles_1.setCellBackgroundColor(row, col, colors_1.WHITE_COLOR);
                    _b.label = 14;
                case 14:
                    logging_1.printBoard(exports.BOARD);
                    return [2 /*return*/];
            }
        });
    });
}
function showDoneAnimation() {
    //TODO Vis, at algoritmen er færdig. Eventuelt tæl antal løsninger
}
function showSolution(solutionIndex) {
    helpers_1.updateHTMLWithBoard(solutions[solutionIndex]);
}
exports.showSolution = showSolution;
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
//# sourceMappingURL=main.js.map