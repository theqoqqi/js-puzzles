import FileRange from './FileRange';

export default class CodeFrame {

    title;

    description;

    visibleLines;

    editableLines;

    content;

    constructor(json) {
        this.title = json.title;
        this.description = json.description;
        this.visibleLines = FileRange.fromString(json.visibleLines ?? '0-0');
        this.editableLines = FileRange.fromString(json.editableLines ?? '0-0');
        this.contents = json.contents;
        this.editedContents = json.editedContents;
    }

    static fromJson(json) {
        return new CodeFrame(json);
    }
}