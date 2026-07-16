const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../images');
const TARGET_DIR = path.resolve(__dirname, '../public/images/backgrounds');

// Direct file mapping
const FILES = [
  { source: 'bg-hero.jpg', target: 'bg-hero.webp' },
  { source: 'bg-process.jpg', target: 'bg-process.webp' },
  { source: 'bg-services.jpg', target: 'bg-services.webp' },
  { source: 'bg-trust.jpg', target: 'bg-trust.webp' }
];

async function processBackgrounds() {
  // Ensure target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log('Source directory:', SOURCE_DIR);
  console.log('Target directory:', TARGET_DIR);
  console.log('');

  let totalOriginal = 0;
  let totalNew = 0;

  for (const { source, target } of FILES) {
    const sourcePath = path.join(SOURCE_DIR, source);
    const targetPath = path.join(TARGET_DIR, target);

    // Check if file exists
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠ File not found: ${source}`);
      continue;
    }

    try {
      // Get original metadata
      const originalSize = fs.statSync(sourcePath).size;
      totalOriginal += originalSize;
      const metadata = await sharp(sourcePath).metadata();

      console.log(`Processing: ${target}`);
      console.log(`  Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(1)}KB`);

      // Process image - resize if needed, convert to WebP
      let pipeline = sharp(sourcePath);

      // Resize to exactly 2560x1440 for consistency
      pipeline = pipeline.resize(2560, 1440, {
        fit: 'cover',
        position: 'center'
      });

      // Convert to WebP with good quality for backgrounds
      await pipeline
        .webp({ quality: 85 })
        .toFile(targetPath);

      const newSize = fs.statSync(targetPath).size;
      totalNew += newSize;
      const newMetadata = await sharp(targetPath).metadata();
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`  Output: ${newMetadata.width}x${newMetadata.height}, ${(newSize / 1024).toFixed(1)}KB`);
      console.log(`  Reduction: ${reduction}%`);
      console.log(`  ✓ Saved\n`);

    } catch (error) {
      console.error(`✗ Error processing ${target}:`, error.message);
    }
  }

  // List final results
  console.log('\n--- Final Results ---');
  const outputFiles = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.webp'));
  outputFiles.forEach(f => {
    const size = fs.statSync(path.join(TARGET_DIR, f)).size;
    console.log(`${f}: ${(size / 1024).toFixed(1)}KB`);
  });

  console.log(`\nTotal original: ${(totalOriginal / 1024).toFixed(1)}KB`);
  console.log(`Total output: ${(totalNew / 1024).toFixed(1)}KB`);
  console.log(`Overall reduction: ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%`);
  console.log('\nDone! All background images processed.');
}

processBackgrounds().catch(console.error);
