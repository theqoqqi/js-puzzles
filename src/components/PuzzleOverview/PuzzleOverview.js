import styles from './PuzzleOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';

function Variable({variable}) {
    return (
        <div className={styles.variable}>
            <Card.Subtitle>
                <span className={styles.variableName}>
                    {variable.name}
                </span>
                {' - '}
                <span className={styles.variableTitle}>
                    {variable.title}
                </span>
            </Card.Subtitle>
            {variable.description && (
                <Card.Text className={styles.variableDescription}>
                    {variable.description}
                </Card.Text>
            )}
        </div>
    );
}

PuzzleOverview.propTypes = {

};

function PuzzleOverview({puzzle}) {
    return (
        <Card className={styles.puzzleOverview}>
            <Card.Header>
                <Card.Title>Обзор</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle>
                    {puzzle?.title}
                </Card.Subtitle>
                <Card.Text as='div'>
                    <RawHtml html={puzzle?.description} />
                </Card.Text>
                <hr />
                <Card.Subtitle>
                    Список доступных глобальных переменных:
                </Card.Subtitle>
                {puzzle?.variables?.map(variable =>
                    <Variable key={variable} variable={variable} />
                )}
            </Card.Body>
        </Card>
    );
}

export default PuzzleOverview;