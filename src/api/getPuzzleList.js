import axios from 'axios';
import {apiUrl} from './apiConfig';

export async function getPuzzleList() {
    return axios
        .get(`${apiUrl}/puzzles`)
        .then(response => {
            return response.data.puzzles;
        });
}