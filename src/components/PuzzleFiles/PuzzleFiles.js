import styles from './PuzzleFiles.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Card, ListGroup} from 'react-bootstrap';

PuzzleFiles.propTypes = {
    files: PropTypes.array,
    onSelect: PropTypes.func,
};

function PuzzleFiles({files, selectedIndex, onSelect}) {
    return (
        <Card className={styles.puzzleFiles}>
            <Card.Header>
                <Card.Title>
                    Файлы
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <ListGroup className={styles.fileList}>
                    {files.map((fileProps, index) =>
                        <ListGroup.Item
                            className={styles.file}
                            action
                            active={index === selectedIndex}
                            key={fileProps.file}
                            onClick={() => onSelect(fileProps, index)}
                        >
                            {fileProps.file}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default PuzzleFiles;