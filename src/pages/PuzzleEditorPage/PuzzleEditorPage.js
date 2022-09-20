import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {loadPuzzle} from '../../api/editorLoadPuzzle';
import SplitPane, {Pane} from '../../components/SplitPane';
import {Button, Card, FormControl, ListGroup} from 'react-bootstrap';
import styles from '../../components/PuzzleFiles/PuzzleFiles.module.css';
import _ from 'lodash';
import PuzzleOverview from '../../components/PuzzleOverview/PuzzleOverview';
import CodeEditor from '../../components/CodeFrameEditor/CodeEditor';
import {savePuzzle} from '../../api/editorSavePuzzle';
import PuzzleVariables from '../../components/PuzzleVariables/PuzzleVariables';
import FileEditor from '../../components/FileEditor/FileEditor';
import FileProps from '../../models/FileProps';

// Структура puzzle.json
//
// title
// description
// order
// name
// appName
// mainPage
// preferredIframeWidth
// preferredIframeHeight
// variables
//     name
//     title
//     description
// files
//     title
//     description
//     file
//     codeFrames
//         title
//         description
//         visibleLines
//         editableLines
//         removedLines
//         replacement

function PuzzleEditorPage({}) {
    let { puzzleId } = useParams();

    const [puzzle, setPuzzle] = useState();
    const [itemPaths, setItemPaths] = useState([]);
    const [openedItem, setOpenedItem] = useState();

    useEffect(() => {
        loadPuzzle(puzzleId).then(puzzle => {
            setPuzzle(puzzle);

            let itemPaths = collectItemPaths(puzzle);

            setItemPaths(itemPaths);
        });
    }, []);

    let resizerStyle = {
        padding: 3,
        lineColor: 'var(--theme-border)',
        lineColorActive: 'var(--theme-border-active)',
        borderColor: 'transparent',
        borderColorActive: 'rgba(var(--theme-border-rgb), 20%)',
    };

    function onSelectItem(item) {
        setOpenedItem(item);
    }

    function onTitleChanged(title) {
        setPuzzleField('title', title);
    }

    function onDescriptionChanged(description) {
        setPuzzleField('description', description);
    }

    function onSave() {
        savePuzzle(puzzle).then();
    }

    function setPuzzleField(name, value) {
        let puzzleCopy = _.cloneDeep(puzzle);

        _.set(puzzleCopy, getSubPath(name), value);

        setPuzzle(puzzleCopy);
    }

    function getItemValue(name) {
        return _.get(puzzle, getSubPath(name));
    }

    function setItemValue(name, value) {
        _.set(puzzle, getSubPath(name), value);
    }

    function getSubPath(subPath) {
        return openedItem?.path ? openedItem.path + '.' + subPath : subPath;
    }

    function getCurrentFileProps() {
        let fileProps = _.get(puzzle, openedItem.filePath);

        return FileProps.fromJson(fileProps);
    }

    return (
        <SplitPane resizerStyle={resizerStyle}>
            <Pane minSize={200} maxSize={200} initialSize='200px'>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            Описания
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup className={styles.fileList}>
                            {itemPaths.map((item, index) =>
                                item.type === 'separator'
                                    ?
                                    <hr key={`hr-${index}`} />
                                    :
                                    <ListGroup.Item
                                        className={styles.file}
                                        action
                                        active={item.path === openedItem?.path}
                                        key={item.path}
                                        onClick={() => onSelectItem(item)}
                                    >
                                        {item.title}
                                    </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Pane>
            <Pane minSize={400}>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            HTML-разметка
                        </Card.Title>
                        <Button onClick={onSave}>
                            Сохранить
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Card.Subtitle>
                            Заголовок
                        </Card.Subtitle>
                        <FormControl
                            value={getItemValue('title') ?? ''}
                            onChange={e => onTitleChanged(e.target.value)}
                        />
                        <Card.Subtitle>
                            Описание
                        </Card.Subtitle>
                        <CodeEditor
                            language='html'
                            contents={getItemValue('description') ?? ''}
                            onChange={onDescriptionChanged}
                            wrapLines
                            showGutter
                        />
                    </Card.Body>
                </Card>
            </Pane>
            <Pane minSize={200} maxSize={200} initialSize='200px'>
                <PuzzleVariables variables={puzzle?.variables ?? []} />
            </Pane>
            <Pane minSize={400}>
                {['file', 'codeFrame'].includes(openedItem?.type)
                    ?
                    <FileEditor fileProps={getCurrentFileProps()} />
                    :
                    <PuzzleOverview puzzle={puzzle} />
                }
            </Pane>
        </SplitPane>
    );
}

function collectItemPaths(puzzle) {
    let descriptionPaths = [
        {
            type: 'puzzle',
            path: '',
            title: 'Описание пазла',
        }
    ];

    descriptionPaths.push({
        type: 'separator',
    });

    puzzle.variables?.forEach((variable, index) => {
        descriptionPaths.push({
            type: 'variable',
            path: `variables.${index}`,
            title: title('variable', variable, index),
        });
    });

    puzzle.files?.forEach((file, fileIndex) => {
        descriptionPaths.push({
            type: 'separator',
        });

        descriptionPaths.push({
            type: 'file',
            filePath: `files.${fileIndex}`,
            path: `files.${fileIndex}`,
            title: title('file', file, fileIndex),
        });

        file.codeFrames?.forEach((codeFrame, frameIndex) => {
            descriptionPaths.push({
                type: 'codeFrame',
                filePath: `files.${fileIndex}`,
                path: `files.${fileIndex}.codeFrames.${frameIndex}`,
                title: title('frame', codeFrame, frameIndex),
            });
        });
    });

    function title(type, item, index) {
        let title = type + ' ' + index;

        if (item.title) {
            title += ': ' + item.title;
        }

        return title;
    }

    return descriptionPaths;
}

export default PuzzleEditorPage;