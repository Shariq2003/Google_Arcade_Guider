const excelService = require('../services/excelService');
const scraperService = require('../services/scraperService');

exports.sortCourses = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const rows = excelService.readExcelBuffer(req.file.buffer);
        // console.log("Excel Rows:", rows);

        const results = await scraperService.scrapeAll(rows, {
            selector: '.course-details',
            concurrency: 5,
            pageTimeoutMs: 30000
        });
        // console.log("Scraping Results:", results);

        results.forEach((r, i) => {
            rows[i]['Duration in Minutes'] = r.minutes != null ? r.minutes : null;
            rows[i]['Total Duration'] = r.rawText || '';
            rows[i]['Scrape Error'] = r.error || '';
        });

        const filteredRows = rows.filter(r => r['Duration in Minutes'] != null);

        filteredRows.sort((a, b) => a['Duration in Minutes'] - b['Duration in Minutes']);

        const outBuffer = excelService.writeExcelBuffer(filteredRows);
        res.set({
            'Content-Disposition': 'attachment; filename="sorted_courses.xlsx"',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        return res.send(outBuffer);

    } catch (err) {
        console.error('Controller error:', err);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};
