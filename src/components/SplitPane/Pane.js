import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getUnit, convertSizeToCssValue } from './SplitPane';
import ScrollPane from '../../components/ScrollPane/ScrollPane';

function PaneStyle({ split, initialSize, size, minSize, maxSize, resizerSize }) {
    const value = size || initialSize;
    const vertical = split === 'vertical';
    const styleProp = {
        minSize: vertical ? 'minWidth' : 'minHeight',
        maxSize: vertical ? 'maxWidth' : 'maxHeight',
        size: vertical ? 'width' : 'height'
    };

    let style = {
        display: 'flex',
        flexDirection: 'column',
        outline: 'none'
    };

    style[styleProp.minSize] = convertSizeToCssValue(minSize, resizerSize);
    style[styleProp.maxSize] = convertSizeToCssValue(maxSize, resizerSize);

    switch(getUnit(value)) {
        case 'ratio':
            style.flex = value;
            break;
        case '%':
        case 'px':
            style.flexGrow = 0;
            style[styleProp.size] = convertSizeToCssValue(value, resizerSize);
            break;
    }

    return style;
}

class Pane extends PureComponent {
    setRef = element => {
        this.props.innerRef?.(this.props.index, element);
    };

    render() {
        const { split, children, className } = this.props;
        const style = PaneStyle(this.props);

        return (
            <div
                className={className}
                style={style}
                ref={this.setRef}
            >
                <ScrollPane
                    style={{
                        flex: '1',
                    }}
                    contentProps={{
                        style: {
                            display: 'flex',
                            flexDirection: split === 'horizontal' ? 'row' : 'column',
                        }
                    }}
                >
                    {children}
                </ScrollPane>
            </div>
        );
    }
}

Pane.propTypes = {
    children: PropTypes.node,
    innerRef: PropTypes.func,
    index: PropTypes.number,
    className: PropTypes.string,
    initialSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Pane.defaultProps = {
    initialSize: '1',
    split: 'vertical',
    minSize: '0',
    maxSize: '100%',
};

export default Pane;