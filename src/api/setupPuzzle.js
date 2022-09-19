import axios from 'axios';
import {apiUrl} from './apiConfig';

export async function setupPuzzle(puzzleId) {
    return axios
        .post(`${apiUrl}/workspace/setup`, {
            puzzle: puzzleId,
        })
        .then(response => {
            return response.data.puzzle;
        });
}