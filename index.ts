import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import connect from './db/connect';
import cors from 'cors';

dotenv.config();

const app = express();
const { PORT, DB_URI } = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/api', apiRouter);

app.listen(Number(PORT), () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);

  connect(String(DB_URI));


});