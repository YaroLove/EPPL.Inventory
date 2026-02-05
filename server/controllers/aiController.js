const OpenAI = require("openai");
const { Consumable, Reagent, Cell, Equipment } = require('../models/itemsModels');

const aiController = {};

aiController.ask = async (req, res, next) => {
    const { question } = req.body;

    if (!question) {
        return next({ code: 400, error: 'Question is required' });
    }

    try {
        // 1. Fetch Inventory Context
        const [consumables, reagents, cells, equipment] = await Promise.all([
            Consumable.find().exec(),
            Reagent.find().exec(),
            Cell.find().exec(),
            Equipment.find().exec()
        ]);

        // 2. Format Context for AI
        const context = `
      Current Inventory:
      Consumables: ${JSON.stringify(consumables.map(i => ({ name: i.name, quantity: i.quantity, location: i.location })))}
      Reagents: ${JSON.stringify(reagents.map(i => ({ name: i.name, quantity: i.quantity, location: i.location })))}
      Cells: ${JSON.stringify(cells.map(i => ({ name: i.name, species: i.species, location: i.location })))}
      Equipment: ${JSON.stringify(equipment.map(i => ({ name: i.name, maintenance: i.lastMaintenance, location: i.location })))}
    `;

        // 3. Call OpenAI (Mock or Real based on Key)
        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key for safety/testing without key
            res.locals.answer = `I calculated the answer based on local data: (Simulated) You have ${consumables.length} consumables, ${reagents.length} reagents, ${cells.length} cell lines, and ${equipment.length} equipment items.`;
        } else {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful inventory assistant. Answer questions based on the provided inventory JSON data." },
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
