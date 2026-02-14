const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.log('Usage: node scripts/generateHash.js <password>');
    process.exit(1);
}

const generateHash = async (pwd) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pwd, salt);
    console.log(`\nPassword: ${pwd}`);
    console.log(`Hash: ${hash}\n`);
    console.log('Copy the above hash and paste it into your MongoDB User document "password" field.');
};

generateHash(password);
