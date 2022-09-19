import axios from 'axios';
import {apiUrl} from './apiConfig';

export async function loadPuzzle(puzzleId) {
    return axios
        .post(`${apiUrl}/workspace/load`, {
            puzzle: puzzleId,
        })
        .then(response => {
            return response.data.puzzle;
        });
}