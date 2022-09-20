import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import React from 'react';
import prismTheme from './prismTheme';

function CodeHighlighter({ language, contents, ...props }) {

    let style = {
        fontSize: 'inherit',
        lineHeight: 'inherit',
        overflow: 'hidden',
    };

    if (contents.endsWith('\n')) {
        contents += ' ';
    }

    return (
        <SyntaxHighlighter
            language={language}
            style={prismTheme}
            customStyle={style}
            children={contents}

            {...props}
        />
    );
}

export default CodeHighlighter;
