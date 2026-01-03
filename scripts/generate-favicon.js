const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const source = 'src/components/projekt1455logo.png';
// We will generate it in both typical locations to be safe
const destApp = 'src/app/favicon.ico';
const destPublic = 'public/favicon.ico';

async function generateFavicon() {
    try {
        // Resize to 32x32 for standard favicon (png format renamed to ico is often supported, 
        // but sharp can output raw buffer we can save as .ico or just png)
        // Ideally .ico is a container, but modern browsers accept png as ico.
        // For strict compliance we'd use a library like 'png-to-ico', but 
        // let's just create a 32x32 png and save it. 
        // Actually, Next.js App Router supports icon.png.

        // Let's create icon.png in src/app which acts as favicon in App Router
        await sharp(source)
            .resize(32, 32)
            .toFile('src/app/icon.png');

        console.log('Generated src/app/icon.png (Next.js App Router Favicon)');

        // Also try to replace legacy favicon.ico if it exists, roughly
        // We'll just write the 32x32 png data to the .ico path. 
        // Most modern browsers handle this fine.
        await sharp(source)
            .resize(32, 32)
            .toFile(destApp);

        console.log('Overwritten src/app/favicon.ico');

    } catch (err) {
        console.error('Error generating favicon:', err);
    }
}

generateFavicon();
