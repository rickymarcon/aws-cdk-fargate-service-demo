import express, { Request, Response, NextFunction } from 'express';
const pkg = require('../package.json');

const PORT = 80;

const app = express();

app.listen(PORT, () => {
  console.info(`✅ Started ${pkg.name}`);
  console.info(`✅ Listening at ${PORT}`);
});

// AWS health check
app.get('/ping', (req, res) => res.send('Pong!'));

app.get('/', (req, res) => res.send('Hello, world!'));
