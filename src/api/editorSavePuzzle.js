import axios from 'axios';
import {apiUrl} from './apiConfig';

export async function savePuzzle(puzzle) {
    return axios
        .post(`${apiUrl}/editor/puzzles/${puzzle.name}`, {
            puzzle,
        });
}