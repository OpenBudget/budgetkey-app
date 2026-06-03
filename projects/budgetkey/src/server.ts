import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import AppServerModule from './main.server';
import { REQUEST, RESPONSE } from './express.tokens';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

const MCP_ENDPOINT = 'https://next.obudget.org/mcp';
const MCP_PROTOCOL_VERSION = '2025-06-18';

const MCP_MANIFEST = {
  mcp_version: MCP_PROTOCOL_VERSION,
  server_name: 'מפתח התקציב — Israel State Budget MCP',
  server_version: '1.0.0',
  endpoints: {
    streamable_http: MCP_ENDPOINT,
  },
  capabilities: {
    tools: true,
    resources: false,
    prompts: false,
  },
  authentication: {
    required: false,
  },
  documentation: 'https://next.obudget.org/about/mcp',
};

const MCP_SERVER_CARD = {
  $schema: 'https://modelcontextprotocol.io/schemas/server-card/v1.0',
  version: '1.0',
  protocolVersion: MCP_PROTOCOL_VERSION,
  serverInfo: {
    name: 'מפתח התקציב — Israel State Budget MCP',
    version: '1.0.0',
    description: 'Query the Israeli State Budget: budget items, supports, contracts, tenders, entities, revenues, and budgetary changes (1997–present).',
    homepage: 'https://next.obudget.org/',
  },
  transport: {
    type: 'streamable-http',
    url: MCP_ENDPOINT,
  },
  capabilities: {
    tools: true,
    resources: false,
    prompts: false,
  },
};

const MCP_SERVER_IETF = {
  mcp_version: MCP_PROTOCOL_VERSION,
  name: 'מפתח התקציב — Israel State Budget MCP',
  endpoint: MCP_ENDPOINT,
  transport: 'http',
  description: 'Israeli state budget data: budget book, support programs, contracts, tenders, entities, revenues, transfers.',
  capabilities: ['tools'],
  auth: { type: 'none' },
  trust_class: 'public',
};

function sendMcpDiscoveryJson(res: express.Response, body: unknown) {
  res.set({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
  });
  res.send(JSON.stringify(body, null, 2));
}

app.options(['/.well-known/mcp', '/.well-known/mcp/server-card.json', '/.well-known/mcp-server'], (_req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
    'Cache-Control': 'public, max-age=3600',
  });
  res.sendStatus(204);
});

app.get('/.well-known/mcp', (_req, res) => sendMcpDiscoveryJson(res, MCP_MANIFEST));
app.get('/.well-known/mcp/server-card.json', (_req, res) => sendMcpDiscoveryJson(res, MCP_SERVER_CARD));
app.get('/.well-known/mcp-server', (_req, res) => sendMcpDiscoveryJson(res, MCP_SERVER_IETF));

/**
 * Serve static files from /browser
 */
app.get(
  '*.*',
  express.static(browserDistFolder, {
    maxAge: '1h',
    index: 'index.html'
  }),
);

app.get('*.*', (_req, res) => res.sendStatus(404));

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res, next) => {

  const user_agent = req.headers['user-agent'];
  if (user_agent && (user_agent === 'thesis-research-bot' || user_agent?.indexOf('python-httpx') > -1)) {
    res.send('יש לנו קובץ מידע פתוח לשימוש וקל להורדה עם כל המידע באתר, בבקשה לא לעשות לנו סקרייפינג!');
    console.log(`${new Date().toISOString()} | ${res.statusCode} | REJECT | ${req.url} | ${user_agent}`);
    return;
  }

  const hostname = req.headers['x-forwarded-host'] || req.hostname;
  if (req.path === '/' && hostname.indexOf('socialpro.org.il') > -1) {
    res.redirect('https://www.socialpro.org.il/i/units/gov_social_service_unit/main?theme=soproc');
    return;
  }

  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap: AppServerModule,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: RESPONSE, useValue: res },
        { provide: REQUEST, useValue: req }
      ],
    })
    .then((html) => {
      console.log(`${new Date().toISOString()} | ${res.statusCode} | OK | ${req.url} | ${user_agent}`);
      if (html) {
        return res.send(html);
      }
      return '';
    })
    .catch((err) => {
      console.log(`${new Date().toISOString()} | ${res.statusCode} | ${err?.name || 'ERR'} | ${req.url} | ${user_agent}`);
      if (res.statusCode !== 302) {
        console.log('ERR:', err);
      }
      return next(err);
    });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = parseInt(process.env['PORT'] || '4000');
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
