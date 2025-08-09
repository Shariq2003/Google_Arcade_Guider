function parseDurationToMinutes(text) {
    if (!text || typeof text !== 'string') return null;

    // normalize text
    const s = text.trim().toLowerCase();
    console.log("Normalized Text:", s);

    // match "X hours" or "X hour"
    const hoursMatch = s.match(/(\d+(?:\.\d+)?)\s*hour/);
    const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
    console.log("Hours:", hours);

    // match "Y minutes" or "Y minute"
    const minutesMatch = s.match(/(\d+(?:\.\d+)?)\s*minute/);
    const minutes = minutesMatch ? parseFloat(minutesMatch[1]) : 0;
    console.log("Minutes:", minutes);

    // return total minutes if found, else null
    return (hours || minutes) ? Math.round(hours * 60 + minutes) : null;
}

module.exports = { parseDurationToMinutes };
