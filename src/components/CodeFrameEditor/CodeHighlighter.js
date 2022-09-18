import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import React from 'react';
import prismTheme from './prismTheme';

function CodeHighlighter({ language, contents, ...props }) {

    let style = {
        fontSize: 'inherit',
        lineHeight: 'inherit',
        overflow: 'hidden',
    };

    return (
        <SyntaxHighlighter
            language={language}
            style={prismTheme}
            customStyle={style}
            children={contents + '\n'}

            {...props}
        />
    );
}

export default CodeHighlighter;
