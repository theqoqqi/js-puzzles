import axios from 'axios';
import {apiUrl} from './apiConfig';

export async function saveCodeFrames(codeFrames) {
    return axios
        .post(`${apiUrl}/workspace`, {
            codeFrames,
        });
}