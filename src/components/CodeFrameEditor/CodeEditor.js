import React, {useRef, useState} from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/worker-javascript';
import 'ace-builds/src-noconflict/ext-language_tools';
import './aceTheme.css';
import './aceDisableScrollbar.css';

let theme = 'solarized_dark';

let nextAceEditorId = 0;

function nextName() {
    return `ace-editor-${nextAceEditorId++}`;
}

function CodeEditor(props) {
    let {
        language,
        contents,
        onChange,
        onChangeCursorCoords,
        wrapLines = false,
        showGutter = false,
        ...aceProps
    } = props;

    const [name] = useState(nextName());
    const ref = useRef();

    let rightPadding = 32;
    let characterWidth = 8.8;
    let longestLineLength = contents
        ?.split('\n')
        .map(line => line.length)
        .reduce((a, b) => a > b ? a : b, 0) ?? 0;

    let style = {
        minWidth: '100%',
        lineHeight: 'inherit',
    };

    if (wrapLines) {
        style.maxWidth = '100%';
    }

    function onCursorMoved(e) {
        if (!onChangeCursorCoords) {
            return;
        }

        setTimeout(() => {
            let cursorElement = ref.current.refEditor.getElementsByClassName('ace_cursor')?.[0];
            let x = cursorElement.offsetLeft;
            let y = cursorElement.offsetTop;

            onChangeCursorCoords(x, y); // ace_cursor
        }, 25);
    }

    return (
        <AceEditor
            ref={ref}
            className={`language-${language}`}
            mode={language}
            theme={theme}
            name={name}

            value={contents}
            onChange={onChange}
            onCursorChange={onCursorMoved}

            highlightActiveLine={false}
            focus={false}

            editorProps={{
                $blockScrolling: true,
            }}

            enableBasicAutocompletion
            enableLiveAutocompletion

            showPrintMargin={false}
            showGutter={showGutter}
            fontSize='inherit'
            maxLines={Infinity} // Это необходимо, чтобы высота поля ввода всегда соответствовала количеству строк

            width={(longestLineLength * characterWidth + rightPadding) +'px'}
            style={style}

            wrapEnabled={wrapLines}

            {...aceProps}
        />
    );
}

export default CodeEditor;