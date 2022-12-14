import styles from './PuzzleWorkspace.module.css';
import './bootstrapOverrides.css';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import AppFrame from '../AppFrame/AppFrame';
import FileEditor from '../FileEditor/FileEditor';
import SplitPane, {Pane} from '../SplitPane';
import PuzzleFiles from '../PuzzleFiles/PuzzleFiles';
import ConsoleFrame from '../ConsoleFrame/ConsoleFrame';
import {Decode} from 'console-feed';
import PuzzleOverview from '../PuzzleOverview/PuzzleOverview';
import {useDebouncedCallback} from 'use-debounce';
import classNames from 'classnames';
import PuzzleVariables from '../PuzzleVariables/PuzzleVariables';
import {apiUrl} from '../../api/apiConfig';

PuzzleWorkspace.propTypes = {
    puzzle: PropTypes.object,
    files: PropTypes.array,
    onSave: PropTypes.func,
};

function PuzzleWorkspace({ puzzle, files, onChange, onSave, onReset }) {
    let [appVersion, setAppVersion] = useState(0);
    let [openedFileIndex, setOpenedFileIndex] = useState();
    let [isResizingPanes, setResizingPanes] = useState(false);
    let [logs, setLogs] = useState([]);
    let [preferredSize, setPreferredSize] = useState({});
    let iframeRef = useRef();
    let debouncedSaveAllCodeFrames = useDebouncedCallback(saveAllCodeFrames, 1000);

    let appUrl = puzzle && `${apiUrl}/workspace/${puzzle?.mainPage}`;
    let variables = puzzle?.variables ?? [];

    let resizerStyle = {
        padding: 3,
        lineColor: 'var(--theme-border)',
        lineColorActive: 'var(--theme-border-active)',
        borderColor: 'transparent',
        borderColorActive: 'rgba(var(--theme-border-rgb), 20%)',
    };

    let openedFile = files[openedFileIndex];

    useEffect(() => {
        let unbindIframeMessageListener = bindIframeMessageListener();

        return () => {
            unbindIframeMessageListener();
        };
    }, []);

    useEffect(() => {
        setPreferredSize(getPreferredSize(puzzle));
    }, [puzzle]);

    function bindIframeMessageListener() {
        let listener = e => {
            if (e.data?.type !== 'console-log') {
                return;
            }

            let decoded = Decode(e.data.data);

            setLogs(logs => [...logs, decoded]);
        };

        window.addEventListener('message', listener);

        return () => {
            window.removeEventListener('message', listener);
        };
    }

    function onOpenFile(fileIndex) {
        setOpenedFileIndex(fileIndex);

        setTimeout(debouncedSaveAllCodeFrames.cancel, 100);
    }

    function onFileChanged(fileIndex, codeFrames) {
        onChange(() => {
            let copy = [...files];

            copy[fileIndex].codeFrames = codeFrames;

            return copy;
        });

        debouncedSaveAllCodeFrames();
    }

    function saveAllCodeFrames() {
        let codeFrames = files
            .flatMap(fileProps => {
                return fileProps.codeFrames.map((codeFrame, index) => {
                    if (!codeFrame.editedContents) {
                        return null;
                    }

                    return {
                        file: fileProps.file,
                        codeFrameIndex: index,
                        contents: codeFrame.editedContents,
                    };
                });
            })
            .filter(c => c !== null);

        onSave(codeFrames)
            .then(() => {
                setAppVersion(i => i + 1);
            });
    }

    function onAppFrameLoad() {
        setLogs([]);
    }

    let resizeCallbacks = {
        onResizeStart: () => setResizingPanes(true),
        onResizeEnd: () => setResizingPanes(false),
    };

    return (
        <SplitPane resizerStyle={resizerStyle} {...resizeCallbacks}>
            <Pane minSize={200} maxSize={200} initialSize={1}>
                <SplitPane split='horizontal' resizerStyle={resizerStyle} {...resizeCallbacks}>
                    <Pane minSize={200}>
                        <PuzzleFiles
                            files={files}
                            selectedIndex={openedFileIndex}
                            onSelect={(file, index) => onOpenFile(index)}
                            onReset={onReset}
                        />
                    </Pane>
                    <Pane minSize={200}>
                        <PuzzleVariables variables={variables} />
                    </Pane>
                </SplitPane>
            </Pane>
            <Pane minSize={400}>
                {openedFile
                    ?
                    <FileEditor
                        fileProps={openedFile}
                        onChange={codeFrames => onFileChanged(openedFileIndex, codeFrames)}
                        onClose={() => onOpenFile(null)}
                    />
                    :
                    <PuzzleOverview puzzle={puzzle} />
                }
            </Pane>
            <Pane minSize={preferredSize?.width ?? 400}>
                <SplitPane split='horizontal' resizerStyle={resizerStyle} {...resizeCallbacks}>
                    <Pane minSize={preferredSize?.height ?? 200} className={classNames({
                        [styles.appFrameContainer]: true,
                        [styles.noPointerEvents]: isResizingPanes,
                    })}>
                        <AppFrame
                            innerRef={iframeRef}
                            version={appVersion}
                            url={appUrl}
                            onLoad={onAppFrameLoad}
                            onReload={saveAllCodeFrames}
                        />
                    </Pane>
                    <Pane minSize={200}>
                        <ConsoleFrame logs={logs} />
                    </Pane>
                </SplitPane>
            </Pane>
        </SplitPane>
    );
}

function getPreferredSize(puzzle) {
    let size = {
        width: 0,
        height: 0,
    };
    let appFrameHeaderHeight = 32;

    if (puzzle?.preferredIframeWidth) {
        size.width = puzzle.preferredIframeWidth;
    }

    if (puzzle?.preferredIframeHeight) {
        size.height = appFrameHeaderHeight + puzzle.preferredIframeHeight;
    }

    return size;
}

export default PuzzleWorkspace;