import styles from './ThemeVariables.module.css';
import './bootstrapOverrides.css';
import React from 'react';

function ThemeVariables(props) {
    return (
        <div className={styles.themeVariables}>
            {props.children}
        </div>
    );
}

export default ThemeVariables;