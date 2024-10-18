const fs = require('fs').promises;
const path = require('path');

async function testFileAccess() {
    const testFile = path.join(__dirname, 'test_access.txt');
    try {
        await fs.writeFile(testFile, 'Test file access');
        await fs.readFile(testFile, 'utf8');
        await fs.unlink(testFile);
        console.log('File access test passed successfully');
    } catch (error) {
        console.error('File access test failed:', error);
    }
}

module.exports = testFileAccess;
