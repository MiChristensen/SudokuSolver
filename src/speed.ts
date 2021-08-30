import { logStatus } from "./logging";

const DEFAULT_SPEED = getCurrentSpeedSliderValue();
export let currentSpeed: number = DEFAULT_SPEED
let instantSolve: boolean;

export async function delay() {
    if (instantSolve) return;
    return new Promise(res => {
        setTimeout(res, currentSpeed)
    })
}

export function setupSpeedSlider() {
    const speedSlider = document.querySelector("#speedSlider") as HTMLInputElement
    speedSlider.addEventListener("input", () => setSpeed(getCurrentSpeedSliderValue()))
}

/**
 * Sets the instantSolve variable depending on which "Solve Algorithm Yes/No" radio button is currently checked 
 */
 export function updateInstantSolve(): void {
    const doNotShowAlgorithm = (document.querySelector("#doNotShowAlgorithm") as HTMLInputElement).checked
    logStatus(`setting instantSolve to: ${doNotShowAlgorithm}`)
    instantSolve = doNotShowAlgorithm
}

function setSpeed(newSpeed: number) {
    logStatus(`Setting new speed to: ${newSpeed}`)
    updateSpeedHTMLValue(newSpeed)
    currentSpeed = newSpeed
}

export function updateSpeedHTMLValue(newSpeed: number) {
    // logStatus(`Updating speed HTML Value to: ${newSpeed}`)
    let prefix: string = "Speed:";
    (document.querySelector("#speedHeader") as HTMLElement).innerHTML = `${prefix} ${newSpeed}`
}



function getCurrentSpeedSliderValue() {
    const rangeSlider: HTMLInputElement = getRangeSlider();
    return Number.parseInt(rangeSlider.max) - Number.parseInt(rangeSlider.value)
}


function getRangeSlider(): HTMLInputElement {
    return document.querySelector("#speedSlider") as HTMLInputElement
}

