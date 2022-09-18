import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';

import Resizer from './Resizer';
import Pane from './Pane';

const DEFAULT_PANE_SIZE = '1';
const DEFAULT_PANE_MIN_SIZE = '0';
const DEFAULT_PANE_MAX_SIZE = '100%';

SplitPaneRoot.propsTypes = {
    innerRef: PropTypes.any,
};

function SplitPaneRoot({ innerRef, children, split, ...props }) {
    return (
        <div {...props} ref={innerRef} style={{
            display: 'flex',
            height: '100%',
            flexDirection: split === 'vertical' ? 'row' : 'column',
            flex: 1,
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'text'
        }}>
            {children}
        </div>
    );
}

function convert(str, size) {
    const tokens = String(str).match(/([0-9]+)([px|%]*)/);
    const value = tokens[1];
    const unit = tokens[2];

    return toPx(value, unit, size);
}

function toPx(value, unit = 'px', size) {
    switch (unit) {
        case '%': {
            return +(size * value / 100).toFixed(2);
        }
        default: {
            return +value;
        }
    }
}

function removeNullChildren(children) {
    return React.Children.toArray(children).filter(c => c);
}

export function getUnit(size) {
    if (typeof size === 'number' || size.endsWith('px')) {
        return 'px';
    }

    if (size.endsWith('%')) {
        return '%';
    }

    return 'ratio';
}

export function convertSizeToCssValue(value, resizerSize) {
    let unit = getUnit(value);

    if (unit !== '%') {
        return unit === 'px' ? value : value + 'px';
    }

    if (!resizerSize) {
        return value;
    }

    const idx = value.search('%');
    const percent = value.slice(0, idx) / 100;

    if (percent === 0) {
        return value;
    }

    return `calc(${value} - ${resizerSize}px*${percent})`;
}

function convertToUnit(size, unit, containerSize) {
    switch (unit) {
        case '%':
            return `${(size / containerSize * 100).toFixed(2)}%`;
        case 'px':
            return `${size.toFixed(2)}px`;
        case 'ratio':
            return (size * 100).toFixed(0);
    }
}

class SplitPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sizes: this.getPanePropSize(props)
        };
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);

        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onMouseUp);
    }

    onMouseDown = (event, resizerIndex) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();

        this.onDown(resizerIndex, event.clientX, event.clientY);
    };

    onTouchStart = (event, resizerIndex) => {
        event.preventDefault();

        const { clientX, clientY } = event.touches[0];

        this.onDown(resizerIndex, clientX, clientY);
    };

    onDown = (resizerIndex, clientX, clientY) => {
        const { allowResize, onResizeStart, split } = this.props;

        if (!allowResize) {
            return;
        }

        this.resizerIndex = resizerIndex;
        this.dimensionsSnapshot = this.getDimensionsSnapshot(this.props);
        this.startClientX = clientX;
        this.startClientY = clientY;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onMouseUp);
        document.addEventListener('touchcancel', this.onMouseUp);

        if (onResizeStart) {
            onResizeStart();
        }
    };

    onMouseMove = (event) => {
        event.preventDefault();

        this.onMove(event.clientX, event.clientY);
    };

    onTouchMove = (event) => {
        event.preventDefault();

        const { clientX, clientY } = event.touches[0];

        this.onMove(clientX, clientY);
    };

    onMouseUp = (event) => {
        event.preventDefault();

        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);

        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onMouseUp);
        document.removeEventListener('touchcancel', this.onMouseUp);

        if (this.props.onResizeEnd) {
            this.props.onResizeEnd(this.state.sizes);
        }
    };

    getDimensionsSnapshot(props) {
        const split = props.split;
        const paneDimensions = this.getPaneDimensions();
        const splitPaneDimensions = this.splitPane.getBoundingClientRect();
        const minSizes = this.getPanePropMinMaxSize(props, 'minSize');
        const maxSizes = this.getPanePropMinMaxSize(props, 'maxSize');

        const resizerSize = this.getResizerSize(removeNullChildren(this.props.children));
        const splitPaneSizePx = split === 'vertical'
            ? splitPaneDimensions.width - resizerSize
            : splitPaneDimensions.height - resizerSize;

        const minSizesPx = minSizes.map(s => convert(s, splitPaneSizePx));
        const maxSizesPx = maxSizes.map(s => convert(s, splitPaneSizePx));
        const sizesPx = paneDimensions.map(d => split === 'vertical' ? d.width : d.height);

        return {
            resizerSize,
            paneDimensions,
            splitPaneSizePx,
            minSizesPx,
            maxSizesPx,
            sizesPx
        };
    }

    getPanePropSize(props) {
        return removeNullChildren(props.children).map(child => {
            const value = child.props['size'] || child.props['initialSize'];
            if (value === undefined) {
                return DEFAULT_PANE_SIZE;
            }

            return String(value);
        });
    }

    getPanePropMinMaxSize(props, key) {
        return removeNullChildren(props.children).map(child => {
            const value = child.props[key];
            if (value === undefined) {
                return key === 'maxSize' ? DEFAULT_PANE_MAX_SIZE : DEFAULT_PANE_MIN_SIZE;
            }

            return value;
        });
    }

    getPaneDimensions() {
        return this.paneElements.filter(el => el).map(el => el.getBoundingClientRect());
    }

    getSizes() {
        return this.state.sizes;
    }

    onMove(clientX, clientY) {
        const { split, onChange } = this.props;
        const resizerIndex = this.resizerIndex;
        const {
            sizesPx,
            minSizesPx,
            maxSizesPx,
            splitPaneSizePx,
            paneDimensions
        } = this.dimensionsSnapshot;

        const sizeDim = split === 'vertical' ? 'width' : 'height';
        const primary = paneDimensions[resizerIndex];
        const secondary = paneDimensions[resizerIndex + 1];
        const maxSize = primary[sizeDim] + secondary[sizeDim];

        const primaryMinSizePx = minSizesPx[resizerIndex];
        const secondaryMinSizePx = minSizesPx[resizerIndex + 1];
        const primaryMaxSizePx = Math.min(maxSizesPx[resizerIndex], maxSize);
        const secondaryMaxSizePx = Math.min(maxSizesPx[resizerIndex + 1], maxSize);

        const moveOffset = split === 'vertical'
            ? this.startClientX - clientX
            : this.startClientY - clientY;

        let primarySizePx = primary[sizeDim] - moveOffset;
        let secondarySizePx = secondary[sizeDim] + moveOffset;

        let primaryHasReachedLimit = false;
        let secondaryHasReachedLimit = false;

        if (primarySizePx < primaryMinSizePx) {
            primarySizePx = primaryMinSizePx;
            primaryHasReachedLimit = true;
        } else if (primarySizePx > primaryMaxSizePx) {
            primarySizePx = primaryMaxSizePx;
            primaryHasReachedLimit = true;
        }

        if (secondarySizePx < secondaryMinSizePx) {
            secondarySizePx = secondaryMinSizePx;
            secondaryHasReachedLimit = true;
        } else if (secondarySizePx > secondaryMaxSizePx) {
            secondarySizePx = secondaryMaxSizePx;
            secondaryHasReachedLimit = true;
        }

        if (primaryHasReachedLimit) {
            secondarySizePx = primary[sizeDim] + secondary[sizeDim] - primarySizePx;
        } else if (secondaryHasReachedLimit) {
            primarySizePx = primary[sizeDim] + secondary[sizeDim] - secondarySizePx;
        }

        sizesPx[resizerIndex] = primarySizePx;
        sizesPx[resizerIndex + 1] = secondarySizePx;

        let sizes = this.getSizes().concat();
        let updateRatio;

        [primarySizePx, secondarySizePx].forEach((paneSize, idx) => {
            const unit = getUnit(sizes[resizerIndex + idx]);
            if (unit !== 'ratio') {
                sizes[resizerIndex + idx] = convertToUnit(paneSize, unit, splitPaneSizePx);
            } else {
                updateRatio = true;
            }
        });

        if (updateRatio) {
            let ratioCount = 0;
            let lastRatioIdx;
            sizes = sizes.map((size, idx) => {
                if (getUnit(size) === 'ratio') {
                    ratioCount++;
                    lastRatioIdx = idx;

                    return convertToUnit(sizesPx[idx], 'ratio');
                }

                return size;
            });

            if (ratioCount === 1) {
                sizes[lastRatioIdx] = '1';
            }
        }

        onChange && onChange(sizes);

        this.setState({
            sizes
        });
    }

    setPaneRef = (idx, el) => {
        if (!this.paneElements) {
            this.paneElements = [];
        }

        this.paneElements[idx] = el;
    };

    getResizerSize(children) {
        return (children.length - 1) * this.props.resizerSize;
    }

    render() {
        const { resizerStyle, children, className, split } = this.props;
        const notNullChildren = removeNullChildren(children);
        const sizes = this.getSizes();
        const resizerSize = this.getResizerSize(notNullChildren);

        const elements = notNullChildren.reduce((acc, child, idx) => {
            let pane;
            const resizerIndex = idx - 1;
            const isPane = child.type === Pane;
            const paneProps = {
                index: idx,
                split: split,
                key: `Pane-${idx}`,
                innerRef: this.setPaneRef,
                resizerSize,
                size: sizes[idx]
            };

            if (isPane) {
                pane = cloneElement(child, paneProps);
            } else {
                pane = <Pane {...paneProps}>{child}</Pane>;
            }

            if (acc.length === 0) {
                return [...acc, pane];
            } else {
                const resizer = (
                    <Resizer
                        index={resizerIndex}
                        key={`Resizer-${resizerIndex}`}
                        split={split}
                        onMouseDown={this.onMouseDown}
                        onTouchStart={this.onTouchStart}
                        style={resizerStyle}
                    />
                );

                return [...acc, resizer, pane];
            }
        }, []);

        return (
            <SplitPaneRoot
                className={className}
                data-split={split}
                split={split}
                innerRef={el => {
                    this.splitPane = el;
                }}
            >
                {elements}
            </SplitPaneRoot>
        );
    }
}

SplitPane.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    className: PropTypes.string,
    split: PropTypes.oneOf(['vertical', 'horizontal']),
    resizerSize: PropTypes.number,
    resizerStyle: PropTypes.shape({
        padding: PropTypes.number,
        lineColor: PropTypes.string,
        lineColorActive: PropTypes.string,
        borderColor: PropTypes.string,
        borderColorActive: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResizeEnd: PropTypes.func,
};

SplitPane.defaultProps = {
    split: 'vertical',
    resizerSize: 1,
    allowResize: true
};

export default SplitPane;