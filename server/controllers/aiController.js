const OpenAI = require("openai");
const { Item, Category } = require('../models/itemsModels');

const aiController = {};

aiController.ask = async (req, res, next) => {
    const { question } = req.body;

    if (!question) {
        return next({ code: 400, error: 'Question is required' });
    }

    try {
        const [allItems, categories] = await Promise.all([
            Item.find().exec(),
            Category.find().exec(),
        ]);

        const grouped = {};
        for (const cat of categories) {
            grouped[cat.name] = allItems
                .filter(i => i.category === cat.name)
                .map(i => ({ name: i.name, quantity: i.quantity, location: i.location, supplier: i.supplier }));
        }

        const context = `Current Inventory:\n${Object.entries(grouped)
            .map(([cat, items]) => `${cat}: ${JSON.stringify(items)}`)
            .join('\n')}`;

        if (!process.env.OPENAI_API_KEY) {
            res.locals.answer = `I calculated the answer based on local data: (Simulated) You have ${allItems.length} total items across ${categories.length} categories.`;
        } else {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful inventory assistant in the exercise physiology lab. Answer questions using the provided inventory JSON data. Keep responses under 300 characters." },
                    { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
                ],
            });

            res.locals.answer = completion.choices[0].message.content;
        }

        next();
    } catch (err) {
        console.error("AI Error:", err);
        next({
            code: 500,
            error: 'Failed to process AI request',
        });
    }
};

module.exports = aiController;
