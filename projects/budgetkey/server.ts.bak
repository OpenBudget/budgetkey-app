import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/budgetkey/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
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
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] }, (err, html) => {
      console.log(`${new Date().toISOString()} | ${res.statusCode} | ${err?.name || 'OK'} | ${req.url} | ${user_agent}`);
      if (err) {
        if (res.statusCode !== 302) {
          console.log('ERR:', err);
        }
        res.end();
      } else {
        // if (res.statusCode === 404) {
        //   req.path = '/not-found';
        //   res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
        // } else {
          res.send(html);
        // }
      }
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';