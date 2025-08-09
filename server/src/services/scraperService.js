const puppeteer = require('puppeteer');
const chromium = require('chromium');
const pLimit = require('p-limit').default;
const { parseDurationToMinutes } = require('../utils/parseDuration');

async function scrapeOne(browser, link, opts) {
    const page = await browser.newPage();
    try {
        await page.setUserAgent(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
        );
        page.setDefaultNavigationTimeout(opts.pageTimeoutMs || 30000);

        await page.goto(link, {
            waitUntil: 'networkidle2',
            timeout: opts.pageTimeoutMs || 30000
        });

        const rawText = await page.evaluate((sel) => {
            try {
                const el = document.querySelector(sel);
                if (el) {
                    const c0 = el.children?.[0];
                    if (c0?.innerText) return c0.innerText.trim();
                    return el.innerText?.trim() || '';
                }
                return '';
            } catch {
                return '';
            }
        }, opts.selector);

        let candidate = rawText || '';

        if (!candidate || !/hour|hr|h\b|min|minute|m\b/.test(candidate)) {
            const other = await page.evaluate(() => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                const fragments = [];
                let node;
                while ((node = walker.nextNode())) {
                    const t = node.nodeValue || '';
                    if (t && /hour|hr|h\b|min|minute|m\b/i.test(t)) {
                        fragments.push(t.trim());
                        if (fragments.length >= 5) break;
                    }
                }
                return fragments.join(' | ');
            });
            if (other) candidate = candidate ? `${candidate} | ${other}` : other;
        }

        const minutes = parseDurationToMinutes(candidate);
        return { link, minutes, rawText: candidate, error: minutes == null ? 'not found' : null };
    } catch (err) {
        return { link, minutes: null, rawText: '', error: err.message };
    } finally {
        await page.close();
    }
}

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

exports.scrapeAll = async (rows, opts = {}) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath:
            process.env.RENDER
                ? chromium.path
                : undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const limit = pLimit(opts.concurrency || 5);
        const tasks = rows.map((r) => {
            if (!r.Link || !isValidUrl(r.Link)) {
                return Promise.resolve({
                    link: r.Link || '',
                    minutes: null,
                    rawText: '',
                    error: 'Invalid or empty URL'
                });
            }
            return limit(() => scrapeOne(browser, r.Link, opts));
        });
        return await Promise.all(tasks);
    } finally {
        await browser.close();
    }
};
