import axios from 'axios';
import {apiUrl} from './apiConfig';

async function saveCodeFrame(file, codeFrameIndex, contents) {
    return axios
        .post(`${apiUrl}/workspace/${file}`, {
            codeFrameIndex,
            contents,
        });
}