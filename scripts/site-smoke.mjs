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

const approvedAssets = [
  'logo-invictus.png',
  'favicon-invictus.png',
  'favicon.ico',
  'og-invictus.jpg',
  'home-hero.webp',
  'home-hero-mobile.webp',
  'championships-hero.webp',
  'cardio-hero.webp',
  'cardio-hero-mobile.webp',
  'strength-hero.webp',
  'friends-hero.webp',
  'powerlift-hero.webp',
  'drops-hero.webp',
  'account-hero.webp',
  'season-card.webp',
  'cardio-card.webp',
  'strength-card.webp',
  'institutional-banner.webp',
];

const sourceContracts = [
  ['src/RebuildApp.tsx', ['window.location.assign(route)', 'logo-invictus.png', 'home-hero-mobile.webp', 'approvedInstitutional', 'Crie uma disputa privada', 'Prove sua evolução em Supino']],
  ['src/entry.tsx', ['ChampionshipsLivePage', 'PrivateChallengesPortalPage', 'PowerLiftPortalPage', 'DropsStorePage', 'AccountSignupPage', 'AccountOnboardingPage', 'ApprovedAssets.css']],
  ['src/public/DropsStorePage.tsx', ['subscribeAdminRealtime', 'getStoreOrder', 'STORE_ORDER_CHANGED']],
  ['src/public/PrivateChallengesPortalPage.tsx', ['RANKING POR IGA', 'COINS OPCIONAIS', 'stakeAmount', 'igaScore']],
  ['src/public/ChampionshipsLivePage.tsx', ['cardio-card.webp', 'strength-card.webp', "import './ChampionshipsLive.css';", '<b>Entre Amigos</b>', '<b>Power Lift</b>']],
  ['src/public/ChampionshipSignupPage.tsx', ['cardio-hero-mobile.webp', 'strength-hero.webp', 'championship-detail-hero']],
  ['index.html', ['favicon-invictus.png', 'og-invictus.jpg', 'twitter:image']],
];

function fail(message) {
  const safe = String(message).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  console.error(`::error title=Production route smoke::${safe}`);
  throw new Error(message);
}

async function assertSourceContracts() {
  console.log('[smoke] checking source contracts');
  for (const [file, snippets] of sourceContracts) {
    const content = await readFile(file, 'utf8');
    for (const snippet of snippets) {
      if (!content.includes(snippet)) fail(`${file} perdeu o contrato obrigatório: ${snippet}`);
    }
    console.log(`[smoke] source OK ${file}`);
  }
  const home = await readFile('src/RebuildApp.tsx', 'utf8');
  const forbiddenDemoContent = ['Mariana Costa', 'Lucas Ferreira', '531 atletas', '1.856 atletas', 'R$ 49,90'];
  for (const snippet of forbiddenDemoContent) {
    if (home.includes(snippet)) fail(`Home ainda contém dado demonstrativo removido: ${snippet}`);
  }
  const championships = await readFile('src/public/ChampionshipsLivePage.tsx', 'utf8');
  const forbiddenUpfrontPlanCopy = ['PRO · IGA + PRÊMIO EM COINS', 'BENEFÍCIO PRO', 'Entre Amigos · PRO', 'Power Lift · PRO'];
  for (const snippet of forbiddenUpfrontPlanCopy) {
    if (home.includes(snippet) || championships.includes(snippet)) fail(`Descoberta pública voltou a expor plano antes do fluxo: ${snippet}`);
  }
}

async function waitForServer(previewState) {
  for (let attempt = 0; attempt < 75; attempt += 1) {
    if (previewState.exited) fail(`Vite preview encerrou antes de ficar pronto: ${previewState.exitDescription}`);
    try {
      const response = await fetch(origin, { redirect: 'manual' });
      if (response.ok) {
        console.log(`[smoke] preview ready after ${attempt + 1} attempt(s)`);
        return;
      }
    } catch {}
    await sleep(200);
  }
  fail('Vite preview não iniciou dentro da janela de smoke test.');
}

async function assertRoute(pathname) {
  const response = await fetch(`${origin}${pathname}`, { redirect: 'manual' });
  if (!response.ok) fail(`${pathname} respondeu HTTP ${response.status}`);
  const html = await response.text();
  if (!html.includes('id="root"')) fail(`${pathname} não retornou o shell React esperado.`);
  console.log(`[smoke] route OK ${pathname}`);
  return html;
}

async function assertBundles(html) {
  const urls = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+\.(?:js|css))"/g)].map(match => match[1]);
  if (!urls.length) fail('Build não expôs bundles JS/CSS em /assets.');
  for (const url of new Set(urls)) {
    const response = await fetch(`${origin}${url}`);
    if (!response.ok) fail(`Bundle ${url} respondeu HTTP ${response.status}`);
    console.log(`[smoke] bundle OK ${url}`);
  }
}

async function assertApprovedAssets() {
  for (const file of approvedAssets) {
    const url = `/assets/invictus/${file}`;
    const response = await fetch(`${origin}${url}`, { redirect: 'manual' });
    if (!response.ok) fail(`Asset aprovado ${url} respondeu HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) fail(`Asset aprovado ${url} retornou HTML em vez do arquivo visual.`);
    console.log(`[smoke] asset OK ${url}`);
  }
}

try {
  await assertSourceContracts();

  const previewState = { exited: false, exitDescription: '' };
  const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', host, '--port', String(port), '--strictPort'], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  preview.on('exit', (code, signal) => {
    previewState.exited = true;
    previewState.exitDescription = signal ? `signal ${signal}` : `código ${code}`;
  });

  try {
    await waitForServer(previewState);
    let homeHtml = '';
    for (const route of routes) {
      const html = await assertRoute(route);
      if (route === '/') homeHtml = html;
    }
    await assertBundles(homeHtml);
    await assertApprovedAssets();
    console.log(`Smoke OK: ${routes.length} rotas + bundles + ${approvedAssets.length} assets aprovados + contratos de fonte.`);
  } finally {
    if (!previewState.exited) {
      preview.kill('SIGTERM');
      await Promise.race([
        new Promise(resolve => preview.once('exit', resolve)),
        sleep(1500),
      ]);
    }
  }
} catch (error) {
  if (!String(error?.message || '').includes('Production route smoke')) {
    const message = error instanceof Error ? error.message : String(error);
    const safe = message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    console.error(`::error title=Production route smoke::${safe}`);
  }
  process.exitCode = 1;
}
