import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const host = '127.0.0.1';
const port = 4173;
const origin = `http://${host}:${port}`;
const routes = [
  '/',
  '/campeonatos',
  '/campeonatos/cardio',
  '/campeonatos/musculacao',
  '/entre-amigos',
  '/power-lift',
  '/drops',
  '/conta',
  '/conta/cadastro',
  '/conta/completar',
  '/admin',
  '/admin/audit',
  '/admin/audit/athlete',
  '/admin/championships',
  '/admin/championships/operations',
  '/admin/powerlift',
];

const sourceContracts = [
  ['src/RebuildApp.tsx', ['window.location.assign(route)', 'PRO · IGA + PRÊMIO EM COINS', 'BENEFÍCIO PRO']],
  ['src/entry.tsx', ['ChampionshipsLivePage', 'PrivateChallengesPortalPage', 'PowerLiftPortalPage', 'DropsStorePage', 'AccountSignupPage', 'AccountOnboardingPage']],
  ['src/public/DropsStorePage.tsx', ['subscribeAdminRealtime', 'getStoreOrder', 'STORE_ORDER_CHANGED']],
  ['src/public/PrivateChallengesPortalPage.tsx', ['RESULTADO POR IGA', 'PRÊMIO EM COINS', 'stakeAmount']],
];

async function assertSourceContracts() {
  for (const [file, snippets] of sourceContracts) {
    const content = await readFile(file, 'utf8');
    for (const snippet of snippets) {
      if (!content.includes(snippet)) throw new Error(`${file} perdeu o contrato obrigatório: ${snippet}`);
    }
  }
  const home = await readFile('src/RebuildApp.tsx', 'utf8');
  const forbiddenDemoContent = ['Mariana Costa', 'Lucas Ferreira', '531 atletas', '1.856 atletas', 'R$ 49,90'];
  for (const snippet of forbiddenDemoContent) {
    if (home.includes(snippet)) throw new Error(`Home ainda contém dado demonstrativo removido: ${snippet}`);
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(origin, { redirect: 'manual' });
      if (response.ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('Vite preview não iniciou dentro da janela de smoke test.');
}

async function assertRoute(pathname) {
  const response = await fetch(`${origin}${pathname}`, { redirect: 'manual' });
  if (!response.ok) throw new Error(`${pathname} respondeu HTTP ${response.status}`);
  const html = await response.text();
  if (!html.includes('id="root"')) throw new Error(`${pathname} não retornou o shell React esperado.`);
  return html;
}

async function assertBundles(html) {
  const urls = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+\.(?:js|css))"/g)].map(match => match[1]);
  if (!urls.length) throw new Error('Build não expôs bundles JS/CSS em /assets.');
  for (const url of new Set(urls)) {
    const response = await fetch(`${origin}${url}`);
    if (!response.ok) throw new Error(`Bundle ${url} respondeu HTTP ${response.status}`);
  }
}

await assertSourceContracts();

const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', host, '--port', String(port), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderr = '';
preview.stderr.on('data', chunk => { stderr += String(chunk); });

try {
  await waitForServer();
  let homeHtml = '';
  for (const route of routes) {
    const html = await assertRoute(route);
    if (route === '/') homeHtml = html;
  }
  await assertBundles(homeHtml);
  console.log(`Smoke OK: ${routes.length} rotas + bundles + contratos de fonte.`);
} finally {
  preview.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => preview.once('exit', resolve)),
    sleep(1500),
  ]);
}

if (preview.exitCode && preview.exitCode !== 0) {
  throw new Error(`Vite preview encerrou com código ${preview.exitCode}. ${stderr}`);
}
