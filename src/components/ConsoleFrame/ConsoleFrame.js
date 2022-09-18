import styles from './ConsoleFrame.module.css';
import React from 'react';
import {Card} from 'react-bootstrap';
import {Console} from 'console-feed';

ConsoleFrame.propTypes = {};

function ConsoleFrame({ logs }) {
    return (
        <Card className={styles.consoleFrame}>
            <Card.Header>
                <Card.Title>
                    Консоль
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Console logs={logs} variant='dark' />
            </Card.Body>
        </Card>
    );
}

export default ConsoleFrame;