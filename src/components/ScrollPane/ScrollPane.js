import styles from './ScrollPane.module.css';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';

ScrollPane.propTypes = {
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    keepInViewport: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        padding: PropTypes.number,
    }),
    contentProps: PropTypes.object,
    style: PropTypes.object,
    children: PropTypes.any,
    fitContent: PropTypes.bool,
};

function ScrollPane({className, style = {}, contentProps = {}, children, keepInViewport, fitContent, ...props}) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const ref = useRef();

    if (fitContent) {
        contentProps = {
            ...contentProps,
            style: {
                ...contentProps.style,
                // minWidth: 'initial',
                minHeight: 'initial',
            }
        };

        style = {
            ...style,
            // maxWidth: size.width,
            maxHeight: size.height,
        };
    }

    useEffect(() => {
        if (!keepInViewport || !ref.current) {
            return;
        }

        let viewportWidth = ref.current.clientWidth;
        let viewportHeight = ref.current.clientHeight;
        let scrollX = ref.current.scrollLeft;
        let scrollY = ref.current.scrollTop;
        let padding = keepInViewport?.padding ?? 0;

        let scrollToX =
            keepInViewport.x - padding < scrollX ? keepInViewport.x - padding
                : keepInViewport.x + padding > scrollX + viewportWidth ? keepInViewport.x - viewportWidth + padding
                : scrollX;
        let scrollToY =
            keepInViewport.y - padding < scrollY ? keepInViewport.y - padding
                : keepInViewport.y + padding > scrollY + viewportHeight ? keepInViewport.y - viewportHeight + padding
                : scrollY;

        ref.current.scrollTo(scrollToX, scrollToY);
    }, [keepInViewport]);

    function onUpdate() {
        if (!fitContent) {
            return;
        }

        let rect = ref.current?.contentElement.getBoundingClientRect();
        let scrollbarWidth = ref.current?.trackYElement?.getBoundingClientRect().width ?? 0;
        let scrollbarHeight = ref.current?.trackXElement?.getBoundingClientRect().height ?? 0;

        setSize({
            width: Math.ceil(rect.width + scrollbarWidth + 1),
            height: Math.ceil(rect.height + scrollbarHeight + 1),
        });
    }

    return (
        <Scrollbar
            ref={ref}
            className={classNames(styles.scrollPane, className)}
            style={style}
            onUpdate={onUpdate}
            contentProps={contentProps}
            {...props}
        >
            {children}
        </Scrollbar>
    );
}

export default ScrollPane;