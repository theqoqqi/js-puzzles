import styles from './PuzzleOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card} from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';
import {useNavigate} from 'react-router';

function Variable({variable}) {
    return (
        <div className={styles.variable}>
            <Card.Subtitle>
                <code className={styles.variableName}>
                    {variable.name}
                </code>
                {' - '}
                <span className={styles.variableTitle}>
                    {variable.title}
                </span>
            </Card.Subtitle>
            {variable.description && (
                <Card.Text as='div' className={styles.variableDescription}>
                    <RawHtml html={variable.description} />
                </Card.Text>
            )}
        </div>
    );
}

PuzzleOverview.propTypes = {

};

function PuzzleOverview({puzzle}) {
    let navigate = useNavigate();

    return (
        <Card className={styles.puzzleOverview}>
            <Card.Header>
                <Card.Title>Обзор</Card.Title>
                <Button onClick={() => navigate('/puzzles')}>
                    К списку пазлов
                </Button>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle>
                    {puzzle?.title}
                </Card.Subtitle>
                <Card.Text as='div'>
                    <RawHtml html={puzzle?.description} />
                </Card.Text>
                {puzzle?.variables?.length &&
                    <>
                        <hr />
                        <Card.Subtitle>
                            Список доступных переменных и функций:
                        </Card.Subtitle>
                        {puzzle?.variables?.map(variable =>
                            <Variable key={variable.name} variable={variable} />
                        )}
                    </>
                }
            </Card.Body>
        </Card>
    );
}

export default PuzzleOverview;