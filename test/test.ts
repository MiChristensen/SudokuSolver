// let fixedCellsTest: Set<[number, number]>

import { updateBoardWithHTMLInput, isValidRow, isValidCol, isValidBox, getHTMLValue, setBoardValue, setHTMLValue } from "../src/helpers";
import { logStatus } from "../src/logging";
import { fillHTMLWithPreset } from "../src/main";

export function runTests() {
    setupTest();
    testIsValidRow();
    testIsValidCol();
    testIsValidBox();
    testSetCellValue()
    allTestsPassed();
    //Setup board again
    // setupBoard();

}


function setupTest() {
    const testPreset: number[][] =
        [
            [0, 6, 8, /**/ 0, 0, 0, /**/ 3, 0, 0],
            [0, 3, 0, /**/ 1, 0, 0, /**/ 0, 4, 0],
            [0, 4, 9, /**/ 3, 0, 0, /**/ 7, 0, 0],
            /*                            */
            [5, 2, 0, /**/ 0, 0, 0, /**/ 0, 9, 4],
            [0, 0, 1, /**/ 0, 0, 6, /**/ 8, 7, 3],
            [0, 0, 0, /**/ 0, 0, 0, /**/ 0, 0, 6],
            /*                            */
            [0, 0, 0, /**/ 0, 0, 8, /**/ 0, 0, 0],
            [0, 0, 0, /**/ 4, 0, 7, /**/ 5, 0, 0],
            [0, 0, 0, /**/ 0, 1, 0, /**/ 0, 6, 0]
        ];
    fillHTMLWithPreset(testPreset);
    updateBoardWithHTMLInput();
}

function testIsValidRow() {
    setupTest()
    if (isValidRow(0, 0, 3) == true) testFailed();
    setupTest()
    if (isValidRow(0, 5, 4) == false) testFailed();
    setupTest()
    if (isValidRow(8, 4, 5) == false) testFailed();
}

function testIsValidCol() {
    if (isValidCol(0, 3, 4)) testFailed();
    if (isValidCol(8, 8, 3)) testFailed();
    if (!isValidCol(4, 5, 5)) testFailed();
    if (!isValidCol(6, 0, 1)) testFailed();
}

function testIsValidBox() {
    if (isValidBox(3, 3, 6)) testFailed();
    if (isValidBox(0, 0, 9)) testFailed();
    if (!isValidBox(5, 0, 6)) testFailed();
    if (!isValidBox(8, 8, 1)) testFailed();
}

function testSetCellValue() {
    setupTest()
    setBoardValue(0, 0, 1);
    setHTMLValue(0, 0, 1);
    if (getHTMLValue(0, 0) != 1) testFailed();

    setupTest()
    setBoardValue(8, 8, 6);
    setHTMLValue(8, 8, 6);
    if (getHTMLValue(8, 8) != 6) testFailed();

    setupTest()
    try {
        setBoardValue(8, 4, 8);
        setHTMLValue(8, 4, 8);
    } catch (error) {
        if (getHTMLValue(8, 4) != 1) testFailed();
    }
}

function allTestsPassed() {
    logStatus("All tests passed")
}

function testFailed() {
    alert("Test Failed")
    throw new Error("Test failed");
}


