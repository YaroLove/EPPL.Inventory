const OpenAI = require("openai");
const { Item, Category } = require('../models/itemsModels');
const ActionLog = require('../models/actionLogModel');
const { isLowStock } = require('../utils/itemUtils');

const aiController = {};

const SYSTEM_PROMPT = `You are Lab Inventory AI — the intelligent assistant for an exercise physiology lab's inventory management system. You have access to the lab's full inventory database and can search the web for product information.

Your capabilities:
1. **Inventory queries** — answer questions about stock levels, expiration dates, locations, and suppliers.
2. **Product lookup** — search the web for manufacturer details, catalog numbers, pricing, availability, and specifications. Always include the source URL when citing web results.
3. **Database updates** — when asked, update item details (description, specifications, manual URLs, etc.) directly in the database. Always confirm what you changed.
4. **Ordering help** — help users figure out what needs reordering, find supplier contacts, and gather product information for purchase orders.

Guidelines:
- Be concise but thorough. Use bullet points for lists.
- When you update the database, clearly state which item and fields were modified.
- If you search the web and find useful details about an item already in inventory, offer to update its record.
- For ordering requests, look up the product online to get current pricing and availability when possible.
- Always state when information comes from web search vs. the local database.
- When you don't know something, say so honestly.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_items",
      description: "Search the lab inventory database by keyword. Matches against item name, catalog number, supplier, description, category, and location.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search keyword (name, catalog number, supplier, etc.)" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_inventory_summary",
      description: "Get a full summary of all inventory items grouped by category, including counts and low-stock alerts.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "update_item",
      description: "Update fields of an inventory item in the database. Use when the user asks to add details, correct information, or modify item records.",
      parameters: {
        type: "object",
        properties: {
          itemId: { type: "string", description: "The MongoDB _id of the item to update" },
          updates: {
            type: "object",
            description: "Fields to update. Allowed: name, itemType, sizeDimension, catalog, supplier, description, quantity, quantityUnit, location, minStock, expirationDate, lastMaintenance, calibration, manualUrl, species, lastFreeze"
          }
        },
        required: ["itemId", "updates"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Search the web for product/manufacturer information. Use to look up catalog numbers, pricing, availability, specifications, or supplier websites.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query (e.g. 'Radiometer sensor cassette 946-010 price')" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "fetch_webpage",
      description: "Fetch and read the text content of a specific URL. Use after search_web to get detailed information from a manufacturer or supplier page.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to fetch" }
        },
        required: ["url"]
      }
    }
  }
];

const ALLOWED_UPDATE_FIELDS = [
  'name', 'itemType', 'sizeDimension', 'catalog', 'supplier',
  'description', 'quantity', 'quantityUnit', 'location', 'minStock',
  'expirationDate', 'lastMaintenance', 'calibration', 'manualUrl',
  'species', 'lastFreeze',
];

async function toolSearchItems(query) {
  const tokens = String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const items = await Item.find().lean().exec();
  const matches = items.filter(item => {
    const catalog = (item.catalog || '').toLowerCase();
    if (catalog && tokens.every(token => catalog.includes(token))) return true;

    const searchable = [
      item.name, item.itemType, item.sizeDimension,
      item.catalog, item.supplier, item.description,
      item.location, item.category,
    ].filter(Boolean).join(' ').toLowerCase();

    return tokens.every(token => searchable.includes(token));
  });

  matches.sort((a, b) => {
    const aCatalog = (a.catalog || '').toLowerCase();
    const bCatalog = (b.catalog || '').toLowerCase();
    const aCatalogHit = tokens.every(token => aCatalog.includes(token)) ? 1 : 0;
    const bCatalogHit = tokens.every(token => bCatalog.includes(token)) ? 1 : 0;
    if (aCatalogHit !== bCatalogHit) return bCatalogHit - aCatalogHit;
    return 0;
  });

  return matches.slice(0, 15).map(i => ({
    _id: i._id,
    name: i.name,
    itemType: i.itemType || null,
    sizeDimension: i.sizeDimension || null,
    catalog: i.catalog || null,
    supplier: i.supplier || null,
    description: i.description || null,
    quantity: i.quantity,
    quantityUnit: i.quantityUnit || 'items',
    minStock: i.minStock,
    location: i.location || null,
    category: i.category,
    expirationDate: i.expirationDate || null,
    manualUrl: i.manualUrl || null,
  }));
}

async function toolGetInventorySummary() {
  const [items, categories] = await Promise.all([
    Item.find().lean().exec(),
    Category.find().lean().exec(),
  ]);

  const grouped = {};
  for (const cat of categories) {
    const catItems = items.filter(i => i.category === cat.name);
    const lowStock = catItems.filter(isLowStock);
    grouped[cat.name] = {
      totalItems: catItems.length,
      lowStockCount: lowStock.length,
      items: catItems.map(i => ({
        _id: i._id,
        title: [i.name, i.itemType, i.sizeDimension].filter(Boolean).join(' - '),
        quantity: i.quantity,
        quantityUnit: i.quantityUnit || 'items',
        minStock: i.minStock,
        supplier: i.supplier,
        catalog: i.catalog,
        location: i.location,
        expirationDate: i.expirationDate,
      })),
    };
  }

  const uncategorized = items.filter(i => !categories.some(c => c.name === i.category));
  if (uncategorized.length > 0) {
    grouped['(uncategorized)'] = {
      totalItems: uncategorized.length,
      lowStockCount: uncategorized.filter(isLowStock).length,
      items: uncategorized.map(i => ({
        _id: i._id,
        title: [i.name, i.itemType, i.sizeDimension].filter(Boolean).join(' - '),
        quantity: i.quantity,
        quantityUnit: i.quantityUnit || 'items',
        supplier: i.supplier,
      })),
    };
  }

  return {
    totalItems: items.length,
    totalCategories: categories.length,
    totalLowStock: items.filter(isLowStock).length,
    categories: grouped,
  };
}

async function toolUpdateItem(itemId, updates, userId, username) {
  const safeUpdates = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_UPDATE_FIELDS.includes(key)) safeUpdates[key] = value;
  }
  if (Object.keys(safeUpdates).length === 0) {
    return { error: 'No valid fields to update' };
  }

  const item = await Item.findByIdAndUpdate(itemId, safeUpdates, { new: true });
  if (!item) return { error: 'Item not found with that ID' };

  await ActionLog.create({
    userId,
    username: username || 'AI Assistant',
    itemId: item._id.toString(),
    itemName: [item.name, item.itemType, item.sizeDimension].filter(Boolean).join(' - '),
    action: 'edited',
  });

  return {
    success: true,
    updatedFields: Object.keys(safeUpdates),
    item: {
      _id: item._id,
      name: item.name,
      itemType: item.itemType,
      sizeDimension: item.sizeDimension,
      ...safeUpdates,
    },
  };
}

async function toolSearchWeb(query) {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const html = await response.text();

    const results = [];
    const resultRegex = /<a[^>]+class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
      const url = match[1];
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      results.push({ title, url });
    }

    let i = 0;
    while ((match = snippetRegex.exec(html)) !== null && i < results.length) {
      results[i].snippet = match[1].replace(/<[^>]+>/g, '').trim();
      i++;
    }

    if (results.length === 0) {
      return { message: 'No search results found', query };
    }
    return { results, query };
  } catch (err) {
    return { error: `Web search failed: ${err.message}`, query };
  }
}

async function toolFetchWebpage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const html = await response.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000);

    return { url, content: text || 'Page content could not be extracted' };
  } catch (err) {
    return { error: `Failed to fetch page: ${err.message}`, url };
  }
}

async function executeToolCall(name, args, userId, username) {
  switch (name) {
    case 'search_items':
      return await toolSearchItems(args.query);
    case 'get_inventory_summary':
      return await toolGetInventorySummary();
    case 'update_item':
      return await toolUpdateItem(args.itemId, args.updates, userId, username);
    case 'search_web':
      return await toolSearchWeb(args.query);
    case 'fetch_webpage':
      return await toolFetchWebpage(args.url);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

aiController.ask = async (req, res, next) => {
  const { question, history } = req.body;

  if (!question) {
    return next({ code: 400, error: 'Question is required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-')) {
    try {
      const summary = await toolGetInventorySummary();
      const lowItems = [];
      for (const [cat, data] of Object.entries(summary.categories)) {
        data.items.forEach(i => {
          if (isLowStock(i)) lowItems.push(`${i.title} (${cat})`);
        });
      }

      res.locals.answer = `**AI assistant is not configured.** Smart responses, inventory lookups, and web search require a valid \`OPENAI_API_KEY\` in your \`.env\` file (must start with \`sk-\`).

Here is a basic snapshot from the local database:

You have **${summary.totalItems} items** across **${summary.totalCategories} categories**.`
        + (lowItems.length > 0
          ? `\n\n⚠️ Low stock items:\n${lowItems.map(i => `• ${i}`).join('\n')}`
          : '\n\nAll items are well-stocked!')
        + `\n\n_Add your OpenAI API key to .env and restart the server to enable full AI chat._`;
      return next();
    } catch (err) {
      return next({ code: 500, error: 'Failed to process request' });
    }
  }

  try {
    const openai = new OpenAI({ apiKey });

    const messages = [{ role: "system", content: SYSTEM_PROMPT }];

    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-10);
      for (const msg of recent) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: "user", content: question });

    const userId = req.user?._id;
    const username = req.user?.displayName || req.user?.email || 'User';
    const MAX_TOOL_ROUNDS = 5;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools: TOOLS,
        tool_choice: "auto",
        max_tokens: 1024,
      });

      const choice = completion.choices[0];

      if (choice.finish_reason === 'tool_calls' || choice.message.tool_calls?.length > 0) {
        messages.push(choice.message);

        for (const toolCall of choice.message.tool_calls) {
          let args;
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch {
            args = {};
          }

          const result = await executeToolCall(
            toolCall.function.name, args, userId, username
          );

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }
      } else {
        res.locals.answer = choice.message.content;
        return next();
      }
    }

    const finalCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 512,
    });
    res.locals.answer = finalCompletion.choices[0]?.message?.content
      || 'I completed the requested operations. Is there anything else?';
    next();
  } catch (err) {
    console.error("AI Error:", err?.message || err);
    if (err?.status === 401 || err?.code === 'invalid_api_key') {
      return next({ code: 500, error: 'OpenAI API key is invalid. Please check configuration.' });
    }
    next({ code: 500, error: 'Failed to process AI request' });
  }
};

aiController.suggestions = async (req, res, next) => {
  try {
    const items = await Item.find().lean().exec();
    const lowStock = items.filter(isLowStock);
    const suppliers = [...new Set(items.map(i => i.supplier).filter(Boolean))];

    const suggestions = [
      {
        icon: '📦',
        text: 'What items are running low and need reordering?',
        description: lowStock.length > 0
          ? `${lowStock.length} item${lowStock.length !== 1 ? 's' : ''} below minimum stock`
          : 'Check stock levels across all categories',
      },
      {
        icon: '🔍',
        text: suppliers.length > 0
          ? `Look up pricing for ${suppliers[0]} products`
          : 'Look up product pricing and availability',
        description: 'Search manufacturer websites for details',
      },
      {
        icon: '✏️',
        text: 'Help me add missing details to my inventory items',
        description: 'AI can look up and fill in product specs',
      },
    ];

    res.locals.suggestions = suggestions;
    next();
  } catch {
    res.locals.suggestions = [
      { icon: '📦', text: 'What items need reordering?', description: 'Check low stock levels' },
      { icon: '🔍', text: 'Look up product info from a manufacturer', description: 'Search the web for details' },
      { icon: '✏️', text: 'Help me update item details', description: 'AI fills in missing specs' },
    ];
    next();
  }
};

module.exports = aiController;
