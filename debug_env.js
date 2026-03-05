const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env.local') });

console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID);
console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
