const UPSTREAM = 'https://sem-desculpa.vercel.app';

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function appendQuery(url, query) {
  for (const [key, value] of Object.entries(query || {})) {
    if (key === 'path' || value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item));
    } else {
      url.searchParams.append(key, String(value));
    }
  }
}

function requestBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.body === undefined || req.body === null) return undefined;
  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) return req.body;
  return JSON.stringify(req.body);
}

export default async function handler(req, res) {
  const path = String(first(req.query?.path) || '').replace(/^\/+/, '');
  if (!path) return res.status(400).json({ error: 'Caminho da API ausente.' });

  const target = new URL(`/api/${path}`, UPSTREAM);
  appendQuery(target, req.query);

  const headers = {};
  const authorization = first(req.headers.authorization);
  const contentType = first(req.headers['content-type']);
  const accept = first(req.headers.accept);
  const userAgent = first(req.headers['user-agent']);

  if (authorization) headers.Authorization = authorization;
  if (contentType) headers['Content-Type'] = contentType;
  if (accept) headers.Accept = accept;
  if (userAgent) headers['User-Agent'] = userAgent;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: requestBody(req),
      redirect: 'manual',
    });

    const responseContentType = upstream.headers.get('content-type');
    const location = upstream.headers.get('location');
    if (responseContentType) res.setHeader('Content-Type', responseContentType);
    if (location) res.setHeader('Location', location);
    res.setHeader('Cache-Control', 'no-store');

    if (upstream.status === 204 || req.method === 'HEAD') return res.status(upstream.status).end();

    const bytes = Buffer.from(await upstream.arrayBuffer());
    return res.status(upstream.status).send(bytes);
  } catch (error) {
    console.error('[site-api-proxy] upstream failure', {
      path,
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(502).json({ error: 'Não foi possível conectar ao serviço Invictus agora.' });
  }
}
