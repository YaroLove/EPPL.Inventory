const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

async function seedAdmin() {
  try {
    const existing = await User.findOne({ email: 'vasyaroslav.24@gmail.com' });
    if (!existing) {
      const hash = await bcrypt.hash('1234567890', 10);
      await User.create({
        email: 'vasyaroslav.24@gmail.com',
        password: hash,
        role: 'admin',
        displayName: 'Admin',
      });
      console.log('Admin user seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  }
}

module.exports = { seedAdmin };
