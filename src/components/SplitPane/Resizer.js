import styles from './Resizer.module.css';
import React, { Component } from 'react';

function Wrapper({innerRef, split, children, ...props}) {
    return (
        <div {...props} ref={innerRef} className={[styles.resizer, styles[split]].join(' ')}>
            {children}
        </div>
    );
}

function convertStyles(style) {
    let styles = {
        '--padding': style?.padding && (style.padding + 'px'),
        '--line-color': style?.lineColor,
        '--line-color-active': style?.lineColorActive,
        '--border-color': style?.borderColor,
        '--border-color-active': style?.borderColorActive,
    };

    let filteredEntries = Object.entries(styles)
        .filter(([_, v]) => v != null);

    return Object.fromEntries(filteredEntries);
}

class Resizer extends Component {
    render() {
        const {
            index,
            style,
            split = 'vertical',
            onClick = () => {},
            onDoubleClick = () => {},
            onMouseDown = () => {},
            onTouchEnd = () => {},
            onTouchStart = () => {},
        } = this.props;

        let eventCallback = (callback, event, index) => {
            if (!callback) {
                return;
            }

            event.preventDefault();
            callback(event, index);
        };

        const props = {
            onMouseDown: event => eventCallback(onMouseDown, event, index),
            onTouchStart: event => eventCallback(onTouchStart, event, index),
            onTouchEnd: event => eventCallback(onTouchEnd, event, index),
            onClick: event => eventCallback(onClick, event, index),
            onDoubleClick: event => eventCallback(onDoubleClick, event, index),
        };

        return <Wrapper {...props} split={split} style={convertStyles(style)} />;
    }
}

export default Resizer;