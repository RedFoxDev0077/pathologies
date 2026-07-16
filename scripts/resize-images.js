import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SOURCE_DIR = './images';
const TARGET_DIR = './public/images';

// Image configurations: source filename -> { target folder, target filename, width, height }
const imageConfigs = [
  // Hero
  { src: 'hero-illustration.png', folder: 'hero', name: 'hero-illustration.webp', width: 1400, height: 900 },

  // Pathologies (800x600)
  { src: 'humedades.jpg', folder: 'pathologies', name: 'humedades.webp', width: 800, height: 600 },
  { src: 'moho.jpg', folder: 'pathologies', name: 'moho.webp', width: 800, height: 600 },
  { src: 'grietas.jpg', folder: 'pathologies', name: 'grietas.webp', width: 800, height: 600 },
  { src: 'movimientos.jpg', folder: 'pathologies', name: 'movimientos.webp', width: 800, height: 600 },
  { src: 'cubiertas.jpg', folder: 'pathologies', name: 'cubiertas.webp', width: 800, height: 600 },
  { src: 'fachadas.jpg', folder: 'pathologies', name: 'fachadas.webp', width: 800, height: 600 },

  // How It Works (600x450)
  { src: 'step-1-chat.png', folder: 'how-it-works', name: 'step-1-chat.webp', width: 600, height: 450 },
  { src: 'step-2-upload.png', folder: 'how-it-works', name: 'step-2-upload.webp', width: 600, height: 450 },
  { src: 'step-3-diagnosis.png', folder: 'how-it-works', name: 'step-3-diagnosis.webp', width: 600, height: 450 },
  { src: 'step-4-report.png', folder: 'how-it-works', name: 'step-4-report.webp', width: 600, height: 450 },

  // Profiles (400x400)
  { src: 'particular.png', folder: 'profiles', name: 'particular.webp', width: 400, height: 400 },
  { src: 'abogado.png', folder: 'profiles', name: 'abogado.webp', width: 400, height: 400 },
  { src: 'administrador.png', folder: 'profiles', name: 'administrador.webp', width: 400, height: 400 },

  // Brand - multiple sizes
  { src: 'logo.png', folder: 'brand', name: 'logo.webp', width: 512, height: 512 },
  { src: 'logo.png', folder: 'brand', name: 'logo-small.webp', width: 200, height: 200 },

  // Packs (200x200)
  { src: 'pack-free.png', folder: 'packs', name: 'pack-free.webp', width: 200, height: 200 },
  { src: 'pack-standard.png', folder: 'packs', name: 'pack-standard.webp', width: 200, height: 200 },
  { src: 'pack-priority.png', folder: 'packs', name: 'pack-priority.webp', width: 200, height: 200 },
];

async function processImage(config) {
  const sourcePath = path.join(SOURCE_DIR, config.src);
  const targetPath = path.join(TARGET_DIR, config.folder, config.name);

  try {
    // Check if source exists
    await fs.access(sourcePath);

    // Process image
    await sharp(sourcePath)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(targetPath);

    // Get file sizes
    const sourceStats = await fs.stat(sourcePath);
    const targetStats = await fs.stat(targetPath);

    const sourceSizeKB = (sourceStats.size / 1024).toFixed(1);
    const targetSizeKB = (targetStats.size / 1024).toFixed(1);
    const savings = ((1 - targetStats.size / sourceStats.size) * 100).toFixed(1);

    console.log(`✓ ${config.src} -> ${config.folder}/${config.name}`);
    console.log(`  ${config.width}x${config.height} | ${sourceSizeKB}KB -> ${targetSizeKB}KB (${savings}% smaller)`);

    return true;
  } catch (error) {
    console.error(`✗ Failed: ${config.src} - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Image Resize Script ===\n');

  // Ensure target directories exist
  const folders = ['hero', 'pathologies', 'how-it-works', 'profiles', 'brand', 'packs'];
  for (const folder of folders) {
    await fs.mkdir(path.join(TARGET_DIR, folder), { recursive: true });
  }

  // Process all images
  let success = 0;
  let failed = 0;

  for (const config of imageConfigs) {
    const result = await processImage(config);
    if (result) success++;
    else failed++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Success: ${success}/${imageConfigs.length}`);
  console.log(`Failed: ${failed}/${imageConfigs.length}`);
}

main().catch(console.error);
