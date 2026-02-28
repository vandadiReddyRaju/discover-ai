require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Trust the Render proxy for secure cookies
app.set('trust proxy', 1);

// Allow credentials for frontend requests
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

// Session setup
app.use(
    session({
        secret: 'supersecret_discover_ai_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production' || process.env.BACKEND_URL?.includes('https'),
            sameSite: process.env.NODE_ENV === 'production' || process.env.BACKEND_URL?.includes('https') ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24
        } // 1 day
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoutes);


app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});


const productsFilePath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "product-discovery"
    }
});


const productsContext = products.map(p =>
    `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: $${p.price}, Tags: ${p.tags.join(', ')}, Description: ${p.description}`
).join('\n---\n');


app.get('/api/products', (req, res) => {

    const categoryQuery = req.query.category;
    if (categoryQuery) {
        const filtered = products.filter(p => p.category.toLowerCase() === categoryQuery.toLowerCase());
        return res.json(filtered);
    }
    res.json(products);
});


app.post('/api/ask', async (req, res) => {

    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'You must be logged in to use the AI assistant.' });
    }

    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const systemPrompt = `You are a helpful product discovery assistant. Below is our product catalog.

Catalog:
${productsContext}

A user is going to search for a product using natural language. 
Analyze their request and return the matching product IDs. Plus, give a very brief (1-2 sentences) natural language summary or recommendation based on their query.
Return your response ONLY as a valid JSON object matching this exact schema:
{
    "productIds": ["P001", "P002"],
    "summary": "Here are some gaming laptops that fit your needs."
}`;

        const response = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            temperature: 0.2 // Low temperature for more deterministic JSON matching
        });

        const replyContent = response.choices[0].message.content;
        let resultJSON;
        try {
            resultJSON = JSON.parse(replyContent);
        } catch {
            resultJSON = {
                productIds: [],
                summary: replyContent
            };
        }

        const matchedProducts = products.filter(p => resultJSON.productIds.includes(p.id));

        res.json({
            products: matchedProducts,
            summary: resultJSON.summary
        });

    } catch (error) {
        console.error('LLM Error:', error);
        res.status(500).json({
            error: 'Failed to process natural language query',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
