import styles from './Puzzles.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Card, ListGroup} from 'react-bootstrap';
import {useNavigate} from 'react-router';
import PuzzleList from '../PuzzleList/PuzzleList';
import _ from 'lodash';

Puzzles.propTypes = {
    puzzles: PropTypes.arrayOf(PropTypes.object),
};

function Puzzles({puzzles}) {
    let navigate = useNavigate();

    let sortedPuzzles = _.sortBy(puzzles, puzzle => puzzle.index ?? puzzle.title);
    let puzzlesByAppNames = _.groupBy(sortedPuzzles, puzzle => puzzle.appName);

    function onPuzzleClicked(puzzle) {
        navigate(`/puzzles/${puzzle.name}`);
    }

    return (
        <Card className={styles.puzzles}>
            <Card.Header>
                <Card.Title>Список пазлов</Card.Title>
            </Card.Header>
            <Card.Body>
                {Array.from(Object.entries(puzzlesByAppNames)).map(([appName, puzzles]) =>
                    <div key={appName} className={styles.appPuzzles}>
                        <Card.Subtitle className={styles.appTitle}>
                            Приложение: {appName}
                        </Card.Subtitle>
                        <PuzzleList
                            className={styles.puzzleListContainer}
                            puzzles={puzzles}
                            onClickPuzzle={onPuzzleClicked}
                        />
                    </div>
                )}
                {Array.from(Object.entries(puzzlesByAppNames)).map(([appName, puzzles]) =>
                    <div key={appName} className={styles.appPuzzles}>
                        <Card.Subtitle className={styles.appTitle}>
                            Приложение: {appName}
                        </Card.Subtitle>
                        <PuzzleList
                            className={styles.puzzleListContainer}
                            puzzles={puzzles}
                            onClickPuzzle={onPuzzleClicked}
                        />
                    </div>
                )}
                {Array.from(Object.entries(puzzlesByAppNames)).map(([appName, puzzles]) =>
                    <div key={appName} className={styles.appPuzzles}>
                        <Card.Subtitle className={styles.appTitle}>
                            Приложение: {appName}
                        </Card.Subtitle>
                        <PuzzleList
                            className={styles.puzzleListContainer}
                            puzzles={puzzles}
                            onClickPuzzle={onPuzzleClicked}
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}



export default Puzzles;