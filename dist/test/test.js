"use strict";
// let fixedCellsTest: Set<[number, number]>
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = void 0;
var helpers_1 = require("../src/helpers");
var logging_1 = require("../src/logging");
var main_1 = require("../src/main");
function runTests() {
    setupTest();
    testIsValidRow();
    testIsValidCol();
    testIsValidBox();
    testSetCellValue();
    allTestsPassed();
    //Setup board again
    // setupBoard();
}
exports.runTests = runTests;
function setupTest() {
    var testPreset = [
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
    main_1.fillHTMLWithPreset(testPreset);
    helpers_1.updateBoardWithHTMLInput();
}
function testIsValidRow() {
    setupTest();
    if (helpers_1.isValidRow(0, 0, 3) == true)
        testFailed();
    setupTest();
    if (helpers_1.isValidRow(0, 5, 4) == false)
        testFailed();
    setupTest();
    if (helpers_1.isValidRow(8, 4, 5) == false)
        testFailed();
}
function testIsValidCol() {
    if (helpers_1.isValidCol(0, 3, 4))
        testFailed();
    if (helpers_1.isValidCol(8, 8, 3))
        testFailed();
    if (!helpers_1.isValidCol(4, 5, 5))
        testFailed();
    if (!helpers_1.isValidCol(6, 0, 1))
        testFailed();
}
function testIsValidBox() {
    if (helpers_1.isValidBox(3, 3, 6))
        testFailed();
    if (helpers_1.isValidBox(0, 0, 9))
        testFailed();
    if (!helpers_1.isValidBox(5, 0, 6))
        testFailed();
    if (!helpers_1.isValidBox(8, 8, 1))
        testFailed();
}
function testSetCellValue() {
    setupTest();
    helpers_1.setBoardValue(0, 0, 1);
    helpers_1.setHTMLValue(0, 0, 1);
    if (helpers_1.getHTMLValue(0, 0) != 1)
        testFailed();
    setupTest();
    helpers_1.setBoardValue(8, 8, 6);
    helpers_1.setHTMLValue(8, 8, 6);
    if (helpers_1.getHTMLValue(8, 8) != 6)
        testFailed();
    setupTest();
    try {
        helpers_1.setBoardValue(8, 4, 8);
        helpers_1.setHTMLValue(8, 4, 8);
    }
    catch (error) {
        if (helpers_1.getHTMLValue(8, 4) != 1)
            testFailed();
    }
}
function allTestsPassed() {
    logging_1.logStatus("All tests passed");
}
function testFailed() {
    alert("Test Failed");
    throw new Error("Test failed");
}
//# sourceMappingURL=test.js.map