import styles from './PuzzleVariables.module.css';
import React, {useState} from 'react';
import {Card, ListGroup} from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';
import classNames from 'classnames';

function Variable({ variable, isActive, onSelect }) {
    return (
        <ListGroup.Item
            className={classNames(styles.variable, isActive && styles.active)}
            action
            active={isActive}
            onClick={onSelect}
        >
            <Card.Subtitle className={styles.variableTitle}>
                <span className={styles.variableName}>
                    {variable.name}
                </span>
                {!isActive && variable.title && ' - ' + variable.title}
            </Card.Subtitle>
            {isActive && (
                <Card.Text as='div' className={styles.variableDescription}>
                    <small>
                        {variable.description
                            ? <RawHtml html={variable.description} />
                            : variable.title}
                    </small>
                </Card.Text>
            )}
        </ListGroup.Item>
    );
}

PuzzleVariables.propTypes = {

};

function PuzzleVariables({variables}) {
    const [selectedIndex, setSelectedIndex] = useState();

    function onSelectVariable(index) {
        setSelectedIndex(index === selectedIndex ? null : index);
    }

    return (
        <Card className={styles.puzzleVariables}>
            <Card.Header>
                <Card.Title>Переменные</Card.Title>
            </Card.Header>
            <Card.Body>
                <ListGroup className={styles.variableList}>
                    {variables.map((variable, index) =>
                        <Variable
                            key={variable.name}
                            variable={variable}
                            isActive={index === selectedIndex}
                            onSelect={() => onSelectVariable(index)}
                        />
                    )}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default PuzzleVariables;