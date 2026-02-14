const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcryptjs');

// Debug MONGO_URL (mask password)
const mongoUrl = "mongodb+srv://visheshdadhich20_db_user:z3E9K9XcOR9LIkfR@minor-proj.vkrn61j.mongodb.net/?appName=minor-proj"

const migratePasswords = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUrl);
        console.log('✅ Connected to Database');

        const users = await User.find({});
        console.log(`Found ${users.length} users to check.`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            // value stored in DB
            const currentPassword = user.password;

            // Simple check: bcrypt hashes usually start with $2a$ or $2b$ and are 60 chars long
            if (currentPassword.startsWith('$2') && currentPassword.length === 60) {
                console.log(`User ${user.email} already has a hashed password. Skipping.`);
                skippedCount++;
                continue;
            }

            console.log(`Migrating password for user: ${user.email}`);

            // Mark password as modified so the pre-save hook kicks in
            // The pre-save hook in model/user.js handles the hashing
            user.markModified('password');
            await user.save();

            migratedCount++;
        }

        console.log('-----------------------------------');
        console.log(`Migration Complete.`);
        console.log(`Migrated: ${migratedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migratePasswords();
