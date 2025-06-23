import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());

// TODO: Add authentication, routes, error handling

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app; 