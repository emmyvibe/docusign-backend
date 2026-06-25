const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================
// TELEGRAM CONFIG - HIDDEN ON SERVER
// ================================================
const TELEGRAM_BOT_TOKEN = "8737888368:AAF58dFmjkS22Ee__psUZ-02LsCvOw95fS0";
const TELEGRAM_CHAT_ID = "7075480337";

// ================================================
// CORS - ALLOW REQUESTS FROM ANYWHERE
// ================================================
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static('public'));

// ================================================
// SECURE ENDPOINT: Send Telegram message
// ================================================
app.post('/api/telegram', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        console.log('✅ Telegram sent successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Telegram error:', error.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ CORS enabled`);
});
