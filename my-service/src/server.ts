import express, { Request, Response, NextFunction } from 'express';
const pkg = require('../package.json');

const PORT = 80;

const app = express();

app.listen(PORT, () => {
  console.info(`✅ Started ${pkg.name}`);
  console.info(`✅ Listening at ${PORT}`);
});

app.get('/', (req, res) => res.send('Hello, world!'));

app.get('/hello/:name', (req, res, next) => {
  const { name } = req.params;
  res.send(`Hello ${name} from express`);
});
