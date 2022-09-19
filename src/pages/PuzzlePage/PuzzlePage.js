import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router';
import FileProps from '../../models/FileProps';
import PuzzleWorkspace from '../../components/PuzzleWorkspace/PuzzleWorkspace';

let apiUrl = 'http://127.0.0.1:8000/api';

PuzzlePage.propTypes = {

};

function PuzzlePage(props) {
    let { puzzleId } = useParams();

    let [puzzle, setPuzzle] = useState();
    let [files, setFiles] = useState([]);

    useEffect(() => {
        loadPuzzle(puzzleId).then(onPuzzleLoaded);
    }, []);

    function onSave(codeFrames) {
        return saveCodeFrames(codeFrames);
    }

    function onReset() {
        setupPuzzle(puzzleId).then(onPuzzleLoaded);
    }

    function onPuzzleLoaded(puzzle) {
        setPuzzle(puzzle);
        setFiles(puzzle.files.map(FileProps.fromJson));
    }

    return (
        <PuzzleWorkspace
            puzzle={puzzle}
            files={files}
            onChange={files => setFiles(files)}
            onSave={codeFrames => onSave(codeFrames)}
            onReset={onReset}
        />
    );
}

async function setupPuzzle(puzzleId) {
    return axios
        .post(`${apiUrl}/workspace/setup`, {
            puzzle: puzzleId,
        })
        .then(response => {
            return response.data.puzzle;
        });
}

async function loadPuzzle(puzzleId) {
    return axios
        .post(`${apiUrl}/workspace/load`, {
            puzzle: puzzleId,
        })
        .then(response => {
            return response.data.puzzle;
        });
}

async function saveCodeFrame(file, codeFrameIndex, contents) {
    return axios
        .post(`${apiUrl}/workspace/${file}`, {
            codeFrameIndex,
            contents,
        });
}

async function saveCodeFrames(codeFrames) {
    return axios
        .post(`${apiUrl}/workspace`, {
            codeFrames,
        });
}

export default PuzzlePage;