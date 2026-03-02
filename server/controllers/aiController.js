const OpenAI = require("openai");
const {
    MedCart: MedCartModel,
    PowerLab: PowerLabModel,
    Physioflow: PhysioflowModel,
    Bloodwork: BloodworkModel,
} = require('../models/itemsModels');

const aiController = {};

aiController.ask = async (req, res, next) => {
    const { question } = req.body;

    if (!question) {
        return next({ code: 400, error: 'Question is required' });
    }

    try {
        // 1. Fetch Inventory Context
        const [medCartItems, powerLabItems, physioflowItems, bloodworkItems] = await Promise.all([
            MedCartModel.find().exec(),
            PowerLabModel.find().exec(),
            PhysioflowModel.find().exec(),
            BloodworkModel.find().exec()
        ]);

        // 2. Format Context for AI
        const context = `
      Current Inventory:
      MedCart: ${JSON.stringify(medCartItems.map(i => ({ name: i.name, quantity: i.quantity, location: i.location })))}
      PowerLab: ${JSON.stringify(powerLabItems.map(i => ({ name: i.name, quantity: i.quantity, location: i.location })))}
      Physioflow: ${JSON.stringify(physioflowItems.map(i => ({ name: i.name, species: i.species, location: i.location })))}
      Bloodwork: ${JSON.stringify(bloodworkItems.map(i => ({ name: i.name, maintenance: i.lastMaintenance, location: i.location })))}
    `;

        // 3. Call OpenAI (Mock or Real based on Key)
        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key for safety/testing without key
            res.locals.answer = `I calculated the answer based on local data: (Simulated) You have ${medCartItems.length} MedCart, ${powerLabItems.length} PowerLab, ${physioflowItems.length} Physioflow, and ${bloodworkItems.length} Bloodwork items.`;
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
