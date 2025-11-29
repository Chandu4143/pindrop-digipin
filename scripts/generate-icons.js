/**
 * Icon Generation Script
 * 
 * This script generates PNG icons from the SVG source.
 * Run with: node scripts/generate-icons.js
 * 
 * Prerequisites:
 * npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Install with: npm install sharp --save-dev');
  console.log('Then run this script again.');
  
  // Create placeholder instructions
  console.log('\nAlternatively, manually create these PNG files in public/:');
  console.log('- favicon.ico (32x32)');
  console.log('- icon-192.png (192x192)');
  console.log('- icon-512.png (512x512)');
  console.log('- icon-maskable-192.png (192x192 with padding)');
  console.log('- icon-maskable-512.png (512x512 with padding)');
  console.log('- apple-touch-icon.png (180x180)');
  console.log('- og-image.png (1200x630)');
  process.exit(0);
}

const publicDir = path.join(__dirname, '..', 'public');
const iconSvg = path.join(publicDir, 'icon.svg');
const ogSvg = path.join(publicDir, 'og-image.svg');

async function generateIcons() {
  console.log('Generating icons...\n');

  // Read SVG files
  const iconBuffer = fs.readFileSync(iconSvg);
  const ogBuffer = fs.readFileSync(ogSvg);

  // Generate standard icons
  const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512];
  
  for (const size of sizes) {
    await sharp(iconBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }

  // Generate favicon.ico (32x32)
  await sharp(iconBuffer)
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ favicon.ico');

  // Generate apple-touch-icon (180x180)
  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // Generate maskable icons (with safe zone padding)
  // Maskable icons need 10% padding on each side
  for (const size of [192, 512]) {
    const iconSize = Math.floor(size * 0.8); // 80% of total size
    const padding = Math.floor(size * 0.1); // 10% padding
    
    const resizedIcon = await sharp(iconBuffer)
      .resize(iconSize, iconSize)
      .toBuffer();
    
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 37, g: 99, b: 235, alpha: 1 } // #2563eb
      }
    })
      .composite([{
        input: resizedIcon,
        top: padding,
        left: padding
      }])
      .png()
      .toFile(path.join(publicDir, `icon-maskable-${size}.png`));
    console.log(`✓ icon-maskable-${size}.png`);
  }

  // Generate OG image (1200x630)
  await sharp(ogBuffer)
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ og-image.png');

  // Generate Twitter card image (same as OG)
  await sharp(ogBuffer)
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'twitter-image.png'));
  console.log('✓ twitter-image.png');

  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
