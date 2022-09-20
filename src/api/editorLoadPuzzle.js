import axios from 'axios';
import {apiUrl} from './apiConfig';

export async function loadPuzzle(puzzleId) {
    return axios
        .get(`${apiUrl}/editor/puzzles/${puzzleId}`)
        .then(response => {
            return response.data.puzzle;
        });
}