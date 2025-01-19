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

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '*.*',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res, next) => {

  const user_agent = req.headers['user-agent'];
  if (user_agent === 'thesis-research-bot') {
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
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
