import styles from './PuzzleList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import PuzzleListItem from '../PuzzleListItem/PuzzleListItem';
import {ListGroup} from 'react-bootstrap';
import classNames from 'classnames';

PuzzleList.propTypes = {
    puzzles: PropTypes.arrayOf(PropTypes.object),
    onClickPuzzle: PropTypes.func,
};

function PuzzleList({puzzles, className, onClickPuzzle}) {
    return (
        <ListGroup className={classNames(styles.puzzleList, className)}>
            {puzzles.map(puzzle =>
                <PuzzleListItem
                    key={puzzle.name}
                    puzzle={puzzle}
                    onClick={() => onClickPuzzle(puzzle)}
                />
            )}
        </ListGroup>
    );
}

export default PuzzleList;