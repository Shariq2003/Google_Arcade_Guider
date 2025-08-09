const XLSX = require('xlsx');

exports.readExcelBuffer = (buffer) => {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = XLSX.utils.decode_range(sheet['!ref']);

    const rows = [];

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const titleCell = sheet[XLSX.utils.encode_cell({ r: R, c: 0 })];
        const title = titleCell?.v || '';
        let link = '';

        if (titleCell?.l?.Target) {
            link = titleCell.l.Target;
        } else if (typeof titleCell?.v === 'string' && /^https?:\/\//.test(titleCell.v)) {
            link = titleCell.v;
        }
        // console.log(`Row ${R}: Title Cell: ${titleCell?.v}, Link: ${link}`);
        rows.push({ Title: title, Link: link });
    }

    // console.log(`Read ${rows.length} rows from Excel file.`);
    return rows;
};

exports.writeExcelBuffer = (rows) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'SortedCourses');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
};
