/** Uses the board variable to change the background colors 
 */
 function setHTMLBackgroundsUsingBoard(): void {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            //Render board in page by coloring every fixed cell grey, every 0/empty red
            const currentCell = board[row][col]
            const htmlCell = getHTMLCellFromCell(currentCell)
            if (currentCell.fixed) htmlCell.style.backgroundColor = GREY_COLOR_FIXED
            if (!currentCell.value) {
                htmlCell.style.backgroundColor = WHITE_COLOR
                htmlCell.value = ""
            }
        }
    }
}

/** Sets the background color of cell at (row, col)
 * @param row Row of the cell to change background color for.
 * @param col Column of the cell to change background color for.
 * @param color The color (string) to change background color to.
 */
function setCellBackgroundColor(row: number, col: number, color: string): void {
    const cell = cells[convertRowColToCellNo(row, col)]
    cell.style.backgroundColor = color
}

/** Thickens the two vertical borders on the board between column 
 * 2 and 3 as well as 5 and 6 
 */
function setVerticalBorders() {
    const thickBorderSize: string = "4px"
    
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i] as HTMLInputElement
        //Set the two vertical borders  
        const isEndOfBoxCol = (i + 1) % 3 == 0
        const isRightMostCol = (i + 1) % 9 == 0;
        if (isEndOfBoxCol && !isRightMostCol) cell.style.borderRightWidth = thickBorderSize
    }
}