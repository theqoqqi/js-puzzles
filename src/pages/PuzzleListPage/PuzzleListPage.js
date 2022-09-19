import styles from './PuzzleListPage.module.css';
import React, {useEffect, useState} from 'react';
import {getPuzzleList} from '../../api/getPuzzleList';
import Puzzles from '../../components/Puzzles/Puzzles';

PuzzleListPage.propTypes = {

};

function PuzzleListPage({}) {
    const [puzzles, setPuzzles] = useState([]);

    useEffect(() => {
        getPuzzleList().then(setPuzzles);
    }, []);

    return (
        <div className={styles.puzzleListContainer}>
            <Puzzles puzzles={puzzles} />
        </div>
    );
}

export default PuzzleListPage;