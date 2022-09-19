import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import FileProps from '../../models/FileProps';
import PuzzleWorkspace from '../../components/PuzzleWorkspace/PuzzleWorkspace';
import {setupPuzzle} from '../../api/setupPuzzle';
import {loadPuzzle} from '../../api/loadPuzzle';
import {saveCodeFrames} from '../../api/saveCodeFrames';

function PuzzlePage({}) {
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

export default PuzzlePage;