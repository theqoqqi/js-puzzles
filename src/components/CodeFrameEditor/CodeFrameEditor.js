import styles from './CodeFrameEditor.module.css';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes, {func} from 'prop-types';
import CodeFrame from '../../models/CodeFrame';
import CodeHighlighter from './CodeHighlighter';
import CodeEditor from './CodeEditor';
import ScrollPane from '../ScrollPane/ScrollPane';

CodeFrameEditor.propTypes = {
    codeFrame: PropTypes.instanceOf(CodeFrame),
    onChange: PropTypes.func,
};

function CodeFrameEditor({codeFrame, language, onChange}) {
    let [before, setBefore] = useState();
    let [contents, setContents] = useState();
    let [after, setAfter] = useState();
    let [cursorCoords, setCursorCoords] = useState({x: 0, y: 0});
    let [initialBefore, initialContents, initialAfter] = splitByParts(codeFrame);

    useEffect(() => {
        let contents = codeFrame.editedContents ?? trimEol(initialContents);

        setBefore(trimEol(initialBefore));
        setContents(contents);
        setAfter(initialAfter);

        onChange(contents);
    }, [codeFrame]);

    function onCodeChanged(newContents) {
        setContents(newContents);
        onChange(newContents);
    }

    function onCursorCoordsChanged(x, y) {
        setCursorCoords({ x, y });
    }

    return (
        <ScrollPane
            className={styles.codeFrameEditor}
            keepInViewport={{
                ...cursorCoords,
                padding: 32,
            }}
            fitContent
        >
            {before && (
                <CodeHighlighter
                    language={language}
                    contents={before}
                />
            )}
            {!codeFrame.editableLines.isEmpty && contents !== undefined && (
                <CodeEditor
                    language={language}
                    contents={contents}
                    onChange={onCodeChanged}
                    onChangeCursorCoords={onCursorCoordsChanged}
                />
            )}
            {after && (
                <CodeHighlighter
                    language={language}
                    contents={after}
                />
            )}
        </ScrollPane>
    );
}

function trimEol(string) {
    return string.replace(/[\r\n]?$/, '');
}

function splitByParts(codeFrame) {
    let visibleLines = codeFrame.visibleLines;
    let editableLines = codeFrame.editableLines;
    let visibleContents = codeFrame?.contents ?? '';

    if (visibleLines.isEmpty) {
        return ['', '', ''];
    }

    if (editableLines.isEmpty) {
        return [visibleContents, '', ''];
    }

    let startLine = editableLines.start - visibleLines.start;
    let endLine = editableLines.end - visibleLines.start;
    let totalLines = visibleLines.end - visibleLines.start + 1;

    let before = getLines(visibleContents, 0, startLine - 1) + '\n';
    let contents = codeFrame.editedContents ?? getLines(visibleContents, startLine, endLine) + '\n';
    let after = getLines(visibleContents, endLine + 1, totalLines);

    return [before, contents, after];
}

function getLines(string, from, to) {
    return string
        .split('\n')
        .slice(from, to + 1)
        .join('\n');
}

export default CodeFrameEditor;