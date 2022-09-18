import CodeFrame from './CodeFrame';

export default class FileProps {

    title;

    description;

    file;

    codeFrames;

    constructor(json) {
        this.title = json.title;
        this.description = json.description;
        this.file = json.file;
        this.codeFrames = json.codeFrames.map(CodeFrame.fromJson);
    }

    static fromJson(json) {
        return new FileProps(json);
    }
}