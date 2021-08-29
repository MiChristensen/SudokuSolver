type Cell = {
    row: number,
    col: number,
    value: number,
    fixed: boolean
}

type Board = Cell[][]


type HTMLCell = HTMLInputElement & {
    index: number
}

const enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
    RANDOM = "random"
}