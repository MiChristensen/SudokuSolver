"use strict";
/** Uses the board variable to change the background colors
 */
function setHTMLBackgroundsUsingBoard() {
    for (var row = 0; row < BOARD_SIZE; row++) {
        for (var col = 0; col < BOARD_SIZE; col++) {
            //Render board in page by coloring every fixed cell grey, every 0/empty red
            var currentCell = board[row][col];
            var htmlCell = getHTMLCellFromCell(currentCell);
            if (currentCell.fixed)
                htmlCell.style.backgroundColor = GREY_COLOR_FIXED;
            if (!currentCell.value) {
                htmlCell.style.backgroundColor = WHITE_COLOR;
                htmlCell.value = "";
            }
        }
    }
}
/** Sets the background color of cell at (row, col)
 * @param row Row of the cell to change background color for.
 * @param col Column of the cell to change background color for.
 * @param color The color (string) to change background color to.
 */
function setCellBackgroundColor(row, col, color) {
    var cell = cells[convertRowColToCellNo(row, col)];
    cell.style.backgroundColor = color;
}
/** Thickens the two vertical borders on the board between column
 * 2 and 3 as well as 5 and 6
 */
function setVerticalBorders() {
    var thickBorderSize = "4px";
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        //Set the two vertical borders  
        var isEndOfBoxCol = (i + 1) % 3 == 0;
        var isRightMostCol = (i + 1) % 9 == 0;
        if (isEndOfBoxCol && !isRightMostCol)
            cell.style.borderRightWidth = thickBorderSize;
    }
}
//# sourceMappingURL=dynamic_styles.js.map