import styles from './AppFrame.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card} from 'react-bootstrap';

AppFrame.propTypes = {
    version: PropTypes.number,
    key: PropTypes.string,
    onReload: PropTypes.func,
};

function AppFrame({ innerRef, version, url, onLoad, onReload }) {
    return (
        <Card className={styles.appFrame}>
            <Card.Header>
                <Card.Title>
                    Приложение
                </Card.Title>
                <Button className={styles.runButton} onClick={onReload}>
                    Запустить
                </Button>
            </Card.Header>
            <Card.Body className={styles.iframeWrapper}>
                <iframe
                    className={styles.iframe}
                    ref={innerRef}
                    key={version}
                    src={url}
                    onLoad={onLoad}
                />
            </Card.Body>
        </Card>
    );
}

export default AppFrame;