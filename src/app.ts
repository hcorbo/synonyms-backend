import express, { Application } from 'express';
import routes from './routes';
import cors from 'cors';

const app: Application = express();

app.use(express.json());
app.use(cors());

export const data: Record<string, Array<string>> = {};

app.use(routes);

export default app;
