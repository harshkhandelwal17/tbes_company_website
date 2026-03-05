const { generatePresignedUploadUrl } = require('./src/lib/r2.ts');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function test() {
    try {
        console.log('Testing R2 URL generation...');
        const url = await generatePresignedUploadUrl('test-key', 'text/plain');
        console.log('Generated URL:', url);

        const accountId = process.env.R2_ACCOUNT_ID;
        if (url.includes(accountId)) {
            console.log('SUCCESS: URL contains the correct account ID.');
        } else {
            console.error('FAILURE: URL does not contain the account ID.');
        }
    } catch (error) {
        console.error('Error during test:', error);
    }
}

test();
