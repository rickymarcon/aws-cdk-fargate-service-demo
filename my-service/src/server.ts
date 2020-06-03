import express, { Request, Response, NextFunction } from 'express';
const pkg = require('../package.json');

const PORT = 8080;

const app = express();

app.listen(PORT, () => {
  console.info(`✅ Started ${pkg.name}`);
  console.info(`✅ Listening at ${PORT}`);
});

app.get('/hello/:name', (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  res.send(`Hello ${name} from express`);
});
