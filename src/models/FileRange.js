
export default class FileRange {

    start;

    end;

    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    get isEmpty() {
        return this.start === 0 && this.end === 0;
    }

    static fromString(range) {
        let parts = range.split('-');

        return new FileRange(+parts[0], +parts[1] ?? +parts[0]);
    }
}
