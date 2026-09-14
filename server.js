const path = require('path');
try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  require('dotenv').config({ path: path.join(__dirname, '.env.local') });
} catch (e) {}

process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = 'library';

const { createServer } = require('http');
const { parse } = require('url');
const next = require('./node_modules/next');

const dev = false;
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, dir: __dirname, hostname, port: typeof port === 'number' ? port : undefined });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${port}`);
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  process.exit(1);
});