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
        this.visibleLines = FileRange.fromString(json.visibleLines);
        this.editableLines = FileRange.fromString(json.editableLines ?? '0-0');
        this.contents = json.contents;
    }

    static fromJson(json) {
        return new CodeFrame(json);
    }
}