import styles from './FileEditor.module.css';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import FileProps from '../../models/FileProps';
import CodeFrameEditor from '../CodeFrameEditor/CodeFrameEditor';
import {Button, Card} from 'react-bootstrap';
import RawHtml from '../RawHtml/RawHtml';

FileEditor.propTypes = {
    fileProps: PropTypes.instanceOf(FileProps),
    onChange: PropTypes.func,
};

function FileEditor({fileProps, onChange, onClose}) {
    let [codeFrames, setCodeFrames] = useState([]);

    function onCodeFrameChanged(index, contents) {
        setCodeFrames(codeFrames => {
            let copy = [...codeFrames];
            copy[index].editedContents = contents;
            return copy;
        });
    }

    useEffect(() => {
        setCodeFrames(fileProps.codeFrames ?? []);
    }, [fileProps]);

    useEffect(() => {
        if (fileProps) {
            onChange(codeFrames);
        }
    }, [codeFrames]);

    let language = getLanguageFromExtension(fileProps.file);

    return (
        <Card className={styles.fileEditor}>
            <Card.Header>
                <Card.Title>
                    {fileProps.file}
                </Card.Title>
                <Button onClick={onClose}>
                    Закрыть
                </Button>
            </Card.Header>
            <Card.Body>
                {fileProps?.title && (
                    <Card.Subtitle>{fileProps.title}</Card.Subtitle>
                )}
                {fileProps?.description && (
                    <Card.Text as='div'>
                        <RawHtml html={fileProps.description} />
                    </Card.Text>
                )}
                {codeFrames.map((codeFrame, index) =>
                    <React.Fragment key={`${fileProps.file}-${index}`}>
                        {codeFrame?.title && (
                            <Card.Subtitle>{codeFrame.title}</Card.Subtitle>
                        )}
                        {codeFrame?.description && (
                            <Card.Text as='div'>
                                <RawHtml html={codeFrame.description} />
                            </Card.Text>
                        )}
                        <CodeFrameEditor
                            codeFrame={codeFrame}
                            language={language}
                            onChange={contents => onCodeFrameChanged(index, contents)}
                        />
                    </React.Fragment>
                )}
            </Card.Body>
        </Card>
    );
}

function getLanguageFromExtension(filenameOrExtension) {
    if (!filenameOrExtension) {
        return null;
    }

    let dotIndex = filenameOrExtension.indexOf('.');
    let extension = dotIndex === -1 ? filenameOrExtension : filenameOrExtension.slice(dotIndex + 1);

    let languagesByExtension = {
        js: 'javascript',
        html: 'html',
        css: 'css',
    };

    return languagesByExtension[extension] ?? extension;
}

export default FileEditor;