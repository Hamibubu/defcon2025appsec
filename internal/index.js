const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 1234;

app.get('/api/track', (req, res) => {
    console.log("REQ");
    const { action, user, time } = req.query;

    if (!action || !user || !time) {
        return res.status(400).json({ error: 'Missing required fields: action, user, or time' });
    }

    const logEntry = `${new Date().toISOString()} | User: ${user} | Action: ${action} | Time: ${time}\n`;
    fs.appendFileSync(path.join(__dirname, 'tracker.log'), logEntry);

    res.status(200).json({ success: true, received: { action, user, time } });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Tracker API listening on http://127.0.0.1:${PORT}`);
});
