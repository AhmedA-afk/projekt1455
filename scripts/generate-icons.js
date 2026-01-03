const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const source = 'src/components/projekt1455logo.png';
const destDir = 'public/icons';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

async function generateIcons() {
    try {
        await sharp(source)
            .resize(192, 192)
            .toFile(path.join(destDir, 'icon-192x192.png'));

        await sharp(source)
            .resize(512, 512)
            .toFile(path.join(destDir, 'icon-512x512.png'));

        console.log('Icons generated successfully!');
    } catch (err) {
        console.error('Error generating icons:', err);
    }
}

generateIcons();
