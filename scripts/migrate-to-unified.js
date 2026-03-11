/**
 * One-time migration script.
 *
 * Moves documents from the old per-category collections (medcarts, powerlabs,
 * physioflows, bloodworks) into a single "items" collection, adding a
 * `category` field to each document. Also seeds the `categories` and
 * `suppliers` collections.
 *
 * Usage:
 *   node scripts/migrate-to-unified.js
 *
 * Requires MONGO_URI in .env
 */
require('dotenv').config();
const mongoose = require('mongoose');

const OLD_COLLECTIONS = [
  { collection: 'medcarts', category: 'MedCart' },
  { collection: 'powerlabs', category: 'PowerLab' },
  { collection: 'physioflows', category: 'Physioflow' },
  { collection: 'bloodworks', category: 'Bloodwork' },
];

const SEED_CATEGORIES = ['MedCart', 'PowerLab', 'Physioflow', 'Bloodwork'];
const SEED_SUPPLIERS = ['Radiometer', 'Cardinal Health', 'Others'];

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db;

  // 1. Migrate items
  let totalMigrated = 0;
  for (const { collection, category } of OLD_COLLECTIONS) {
    const exists = await db.listCollections({ name: collection }).hasNext();
    if (!exists) {
      console.log(`  [skip] "${collection}" does not exist`);
      continue;
    }

    const docs = await db.collection(collection).find().toArray();
    if (docs.length === 0) {
      console.log(`  [skip] "${collection}" is empty`);
      continue;
    }

    const itemsToInsert = docs.map(({ _id, __v, ...rest }) => ({
      ...rest,
      category,
    }));

    await db.collection('items').insertMany(itemsToInsert);
    console.log(`  [migrated] ${docs.length} docs from "${collection}" -> items (category: "${category}")`);
    totalMigrated += docs.length;
  }
  console.log(`\nTotal items migrated: ${totalMigrated}\n`);

  // 2. Seed categories
  for (const name of SEED_CATEGORIES) {
    try {
      await db.collection('categories').updateOne(
        { name },
        { $setOnInsert: { name } },
        { upsert: true }
      );
      console.log(`  [category] "${name}" ensured`);
    } catch (err) {
      console.log(`  [category] "${name}" already exists or error:`, err.message);
    }
  }

  // 3. Seed suppliers
  for (const name of SEED_SUPPLIERS) {
    try {
      await db.collection('suppliers').updateOne(
        { name },
        { $setOnInsert: { name } },
        { upsert: true }
      );
      console.log(`  [supplier] "${name}" ensured`);
    } catch (err) {
      console.log(`  [supplier] "${name}" already exists or error:`, err.message);
    }
  }

  console.log('\nMigration complete.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
