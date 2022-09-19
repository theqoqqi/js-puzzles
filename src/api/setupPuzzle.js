import axios from 'axios';
import {apiUrl} from './apiConfig';

function applyReplacements(puzzle) {
    for (let fileProps of puzzle.files) {
        for (let codeFrame of fileProps.codeFrames) {
            if (codeFrame.replacement) {
                codeFrame.editedContents = codeFrame.replacement;
            }
        }
    }
}

export async function setupPuzzle(puzzleId) {
    return axios
        .post(`${apiUrl}/workspace/setup`, {
            puzzle: puzzleId,
        })
        .then(response => {
            let puzzle = response.data.puzzle;

            applyReplacements(puzzle);

            return puzzle;
        });
}