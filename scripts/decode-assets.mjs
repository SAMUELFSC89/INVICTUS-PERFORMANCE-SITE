import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcesRoot = path.join(root, 'asset-sources');
const outputRoot = path.join(root, 'public', 'assets', 'invictus');

if (!fs.existsSync(sourcesRoot)) process.exit(0);
fs.mkdirSync(outputRoot, { recursive: true });

const manifests = fs.readdirSync(sourcesRoot).filter((name) => name.endsWith('.manifest.json'));
for (const manifestName of manifests) {
  const manifestPath = path.join(sourcesRoot, manifestName);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!manifest.output || !Array.isArray(manifest.parts) || manifest.parts.length === 0) {
    throw new Error(`Manifesto de asset inválido: ${manifestName}`);
  }
  const base64 = manifest.parts
    .map((part) => fs.readFileSync(path.join(sourcesRoot, part), 'utf8').trim())
    .join('');
  const bytes = Buffer.from(base64, 'base64');
  if (!bytes.length) throw new Error(`Asset vazio após decodificação: ${manifest.output}`);
  fs.writeFileSync(path.join(outputRoot, manifest.output), bytes);
  console.log(`[assets] ${manifest.output}: ${bytes.length} bytes`);
}
