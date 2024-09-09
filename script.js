function convertMarkdownTableToBoxDrawing(markdownTable, heavy = false) {
    const lines = markdownTable.trim().split('\n');
    const headers = lines[0].split('|').map(header => header.trim()).filter(header => header);
    const alignments = lines[1].split('|').map(header => header.trim()).filter(header => header);
    const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(cell => cell));

    const columnWidths = headers.map((header, i) => {
        return Math.max(header.length, ...rows.map(row => row[i].length));
    });

    const drawLine = (char, junction, start, end) => {
        return start + columnWidths.map(width => char.repeat(width + 2)).join(junction) + end;
    };

    const drawRow = (cells, left, middle, right, alignments) => {
        return left + cells.map((cell, i) => {
            const width = columnWidths[i];
            if (alignments[i].startsWith(':') && alignments[i].endsWith(':')) {
                return ' ' + cell.padStart((width + cell.length) / 2).padEnd(width) + ' ';
            } else if (alignments[i].endsWith(':')) {
                return ' ' + cell.padStart(width) + ' ';
            } else {
                return ' ' + cell.padEnd(width) + ' ';
            }
        }).join(middle) + right;
    };

    const topLine = heavy ?
        drawLine('━', '┳', '┏', '┓') :
        drawLine('─', '┬', '┌', '┐');
    const headerLine = heavy ?
        drawRow(headers, '┃', '┃', '┃', alignments) :
        drawRow(headers, '│', '│', '│', alignments);
    const separatorLine = heavy ?
        drawLine('━', '╇', '┣', '┫') :
        drawLine('─', '┼', '├', '┤');
    const bottomLine = heavy ?
        drawLine('━', '┷', '┗', '┛') :
        drawLine('─', '┴', '└', '┘');
    const bodyLines = rows.map(row => heavy ?
        drawRow(row, '┃', '│', '┃', alignments) :
        drawRow(row, '│', '│', '│', alignments));

    return [topLine, headerLine, separatorLine, ...bodyLines, bottomLine].join('\n');
}

function convertTable() {
    const markdownTable = document.getElementById('markdownInput').value;
    const thickBorders = document.getElementById('thick-borders').checked;
    document.getElementById('boxDrawingOutput').value = convertMarkdownTableToBoxDrawing(markdownTable, thickBorders);
}

/*
const markdownTable = `
| Quadrant | sin | cos | tan | cot |
|---|:-:|:-:|:-:|:-:|
| 1 (0-90) | + | + | + | + |
| 2 (90-180) | + | - | - | - |
| 3 (180-270) | - | - | + | + |
| 4 (270-360) | - | + | - | - |
`;

console.log(convertMarkdownTableToBoxDrawing(markdownTable));
*/