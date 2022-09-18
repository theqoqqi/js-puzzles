import React from 'react';
import PropTypes from 'prop-types';

RawHtml.propTypes = {
    html: PropTypes.string,
};

function RawHtml({html = ''}) {
    return (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    );
}

export default RawHtml;