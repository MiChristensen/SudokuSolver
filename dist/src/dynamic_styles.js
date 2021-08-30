"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVerticalBorders = exports.setCellBackgroundColor = exports.setHTMLBackgroundsUsingBoard = void 0;
var colors_1 = require("./colors");
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
var main_1 = require("./main");
/** Uses the board variable to change the background colors
 */
function setHTMLBackgroundsUsingBoard() {
    for (var row = 0; row < constants_1.BOARD_SIZE; row++) {
        for (var col = 0; col < constants_1.BOARD_SIZE; col++) {
            //Render board in page by coloring every fixed cell grey, every 0/empty red
            var currentCell = main_1.BOARD[row][col];
            var htmlCell = helpers_1.getHTMLCellFromCell(currentCell);
            if (currentCell.fixed)
                htmlCell.style.backgroundColor = colors_1.GREY_COLOR_FIXED;
            if (!currentCell.value) {
                htmlCell.style.backgroundColor = colors_1.WHITE_COLOR;
                htmlCell.value = "";
            }
        }
    }
}
exports.setHTMLBackgroundsUsingBoard = setHTMLBackgroundsUsingBoard;
/** Sets the background color of cell at (row, col)
 * @param row Row of the cell to change background color for.
 * @param col Column of the cell to change background color for.
 * @param color The color (string) to change background color to.
 */
function setCellBackgroundColor(row, col, color) {
    var cell = constants_1.cells[helpers_1.convertRowColToCellNo(row, col)];
    cell.style.backgroundColor = color;
}
exports.setCellBackgroundColor = setCellBackgroundColor;
/** Thickens the two vertical borders on the board between column
 * 2 and 3 as well as 5 and 6
 */
function setVerticalBorders() {
    var thickBorderSize = "4px";
    for (var i = 0; i < constants_1.cells.length; i++) {
        var cell = constants_1.cells[i];
        //Set the two vertical borders  
        var isEndOfBoxCol = (i + 1) % 3 == 0;
        var isRightMostCol = (i + 1) % 9 == 0;
        if (isEndOfBoxCol && !isRightMostCol)
            cell.style.borderRightWidth = thickBorderSize;
    }
}
exports.setVerticalBorders = setVerticalBorders;
//# sourceMappingURL=dynamic_styles.js.map