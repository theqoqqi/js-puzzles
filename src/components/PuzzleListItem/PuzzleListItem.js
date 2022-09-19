import styles from './PuzzleListItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Card, ListGroup} from 'react-bootstrap';

PuzzleListItem.propTypes = {
    puzzle: PropTypes.object,
    onClick: PropTypes.func,
};

function PuzzleListItem({puzzle, onClick}) {
    return (
        <ListGroup.Item
            className={styles.puzzleListItem}
            action
            onClick={() => onClick()}
        >
            {puzzle.title}
        </ListGroup.Item>
    );
}

export default PuzzleListItem;